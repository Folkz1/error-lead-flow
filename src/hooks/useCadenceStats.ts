
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCadenceStats = () => {
  return useQuery({
    queryKey: ['cadence-stats'],
    queryFn: async () => {
      console.log('Buscando estatísticas de cadência...');
      
      // Contar empresas em cadência ativa
      const { count: totalEmCadencia } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .in('status_cadencia_geral', [
          'cadencia_dia1_ativa',
          'aguardando_reforco1_dia1',
          'aguardando_reforco2_dia1',
          'dia1_concluido_aguardando_dia2',
          'cadencia_dia2_ativa',
          'aguardando_reforco1_dia2',
          'aguardando_reforco2_dia2',
          'dia2_concluido_aguardando_dia3',
          'cadencia_dia3_ativa',
          'dia3_concluido_aguardando_finalizacao'
        ]);

      // Contar interações de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const { count: interacoesHoje } = await supabase
        .from('interacoes')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp_criacao', hoje.toISOString());

      // Contar agendamentos
      const { count: agendamentos } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status_agendamento', 'confirmado');

      // Calcular taxa de sucesso
      const { count: totalEmpresas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .not('status_cadencia_geral', 'is', null);

      const { count: sucessos } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('status_cadencia_geral', 'sucesso_contato_realizado');

      const taxaSucesso = totalEmpresas && totalEmpresas > 0 
        ? Math.round((sucessos || 0) / totalEmpresas * 100) 
        : 0;

      console.log('Estatísticas de cadência calculadas:', {
        totalEmCadencia,
        interacoesHoje,
        agendamentos,
        taxaSucesso
      });

      return {
        totalEmCadencia: totalEmCadencia || 0,
        interacoesHoje: interacoesHoje || 0,
        agendamentos: agendamentos || 0,
        taxaSucesso,
      };
    },
  });
};
