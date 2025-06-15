
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCadenceStats = () => {
  return useQuery({
    queryKey: ['cadence-stats'],
    queryFn: async () => {
      console.log('Buscando estatísticas de cadências...');
      
      // Buscar total de empresas em cadência (com status_cadencia_geral não nulo)
      const { count: totalEmCadencia } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .not('status_cadencia_geral', 'is', null);
      
      // Buscar interações de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const amanha = new Date(hoje);
      amanha.setDate(amanha.getDate() + 1);
      
      const { count: interacoesHoje } = await supabase
        .from('interacoes')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp_criacao', hoje.toISOString())
        .lt('timestamp_criacao', amanha.toISOString());
      
      // Buscar agendamentos ativos
      const { count: agendamentos } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status_agendamento', 'confirmado')
        .gte('timestamp_agendamento', new Date().toISOString());
      
      // Calcular taxa de sucesso
      const { count: sucessos } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('status_cadencia_geral', 'sucesso_contato_realizado');
      
      const taxaSucesso = totalEmCadencia && totalEmCadencia > 0 
        ? Math.round((sucessos || 0) / totalEmCadencia * 100) 
        : 0;
      
      console.log('Estatísticas de cadências calculadas:', {
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
