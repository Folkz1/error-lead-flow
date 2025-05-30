
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  canal?: string;
  tipoErro?: string;
  etapaCadencia?: number;
  templateId?: number;
}

export const useAnalytics = (filters: AnalyticsFilters = {}) => {
  return useQuery({
    queryKey: ['analytics', filters],
    queryFn: async () => {
      console.log('Buscando dados de analytics com filtros:', filters);
      
      // Construir filtros de data
      const dateFilter = filters.startDate && filters.endDate 
        ? `AND timestamp_criacao >= '${filters.startDate}' AND timestamp_criacao <= '${filters.endDate}'`
        : '';

      // 1. Funil de Conversão
      const { data: empresasTotal, error: empresasError } = await supabase
        .from('empresas')
        .select('id')
        .not('data_criacao', 'is', null);

      if (empresasError) throw empresasError;

      const { data: errosDetectados, error: errosError } = await supabase
        .from('eventos_erro')
        .select('empresa_id')
        .not('timestamp_erro_detectado', 'is', null);

      if (errosError) throw errosError;

      let interacoesQuery = supabase
        .from('interacoes')
        .select('id, empresa_id, status_interacao, canal');
      
      if (filters.canal && filters.canal !== 'todos') {
        interacoesQuery = interacoesQuery.eq('canal', filters.canal);
      }

      const { data: interacoes, error: interacoesError } = await interacoesQuery;
      if (interacoesError) throw interacoesError;

      const { data: agendamentos, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('id, empresa_id, status_agendamento');

      if (agendamentosError) throw agendamentosError;

      // 2. Performance por Template
      const { data: templates, error: templatesError } = await supabase
        .from('templates_mensagens')
        .select('*');

      if (templatesError) throw templatesError;

      // 3. Análise de IA
      const { data: chatHistories, error: chatError } = await supabase
        .from('n8n_chat_histories')
        .select('session_id, message, timestamp_criacao');

      if (chatError) throw chatError;

      // 4. Follow-ups
      let followUpsQuery = supabase
        .from('tarefas_follow_up')
        .select('*');

      const { data: followUps, error: followUpsError } = await followUpsQuery;
      if (followUpsError) throw followUpsError;

      // Processar dados do funil
      const funnelData = [
        {
          name: 'Empresas Cadastradas',
          value: empresasTotal?.length || 0,
          percentage: 100
        },
        {
          name: 'Erros Detectados',
          value: new Set(errosDetectados?.map(e => e.empresa_id)).size || 0,
          percentage: empresasTotal?.length ? Math.round((new Set(errosDetectados?.map(e => e.empresa_id)).size / empresasTotal.length) * 100) : 0
        },
        {
          name: 'Interações Iniciadas',
          value: interacoes?.length || 0,
          percentage: empresasTotal?.length ? Math.round((interacoes?.length || 0) / empresasTotal.length * 100) : 0
        },
        {
          name: 'Agendamentos Solicitados',
          value: agendamentos?.length || 0,
          percentage: interacoes?.length ? Math.round((agendamentos?.length || 0) / interacoes.length * 100) : 0
        },
        {
          name: 'Agendamentos Confirmados',
          value: agendamentos?.filter(a => a.status_agendamento === 'confirmado').length || 0,
          percentage: agendamentos?.length ? Math.round((agendamentos?.filter(a => a.status_agendamento === 'confirmado').length || 0) / agendamentos.length * 100) : 0
        }
      ];

      // Performance por canal
      const channelPerformance = interacoes?.reduce((acc, int) => {
        if (!acc[int.canal]) {
          acc[int.canal] = { total: 0, sucesso: 0, agendamentos: 0 };
        }
        acc[int.canal].total += 1;
        if (int.status_interacao === 'finalizada_com_sucesso_agendamento') {
          acc[int.canal].sucesso += 1;
        }
        return acc;
      }, {} as Record<string, any>) || {};

      // Performance de templates
      const templatePerformance = templates?.map(template => {
        const templateInteracoes = interacoes?.filter(i => 
          chatHistories?.some(ch => ch.session_id === i.contato_utilizado)
        ) || [];
        
        const templateAgendamentos = agendamentos?.filter(a => 
          templateInteracoes.some(ti => ti.empresa_id === a.empresa_id)
        ) || [];

        return {
          id: template.id,
          nome: template.nome_template,
          canal: template.canal,
          envios: templateInteracoes.length,
          respostas: templateInteracoes.filter(i => i.status_interacao !== 'enviada_sem_resposta').length,
          agendamentos: templateAgendamentos.length,
          taxaConversao: templateInteracoes.length > 0 ? Math.round((templateAgendamentos.length / templateInteracoes.length) * 100) : 0
        };
      }) || [];

      // Análise da IA
      const iaStats = {
        totalInteracoes: interacoes?.length || 0,
        interacoesComResposta: interacoes?.filter(i => i.status_interacao !== 'enviada_sem_resposta').length || 0,
        agendamentosGerados: interacoes?.filter(i => i.status_interacao === 'finalizada_com_sucesso_agendamento').length || 0,
        optOuts: interacoes?.filter(i => i.status_interacao === 'opt_out').length || 0,
        tempoMedioResposta: '2.3h', // Placeholder - seria necessário calcular baseado nos dados
        mensagensPorInteracao: chatHistories?.length && interacoes?.length ? Math.round(chatHistories.length / interacoes.length) : 0
      };

      // Status de agendamentos
      const agendamentosStatus = agendamentos?.reduce((acc, ag) => {
        const status = ag.status_agendamento || 'pendente';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Follow-ups por status
      const followUpsStats = followUps?.reduce((acc, fu) => {
        const status = fu.status_follow_up || 'pendente';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      console.log('Dados de analytics processados');
      
      return {
        funnelData,
        channelPerformance,
        templatePerformance,
        iaStats,
        agendamentosStatus,
        followUpsStats,
        totalEmpresas: empresasTotal?.length || 0,
        totalInteracoes: interacoes?.length || 0,
        totalAgendamentos: agendamentos?.length || 0,
        totalFollowUps: followUps?.length || 0
      };
    },
  });
};
