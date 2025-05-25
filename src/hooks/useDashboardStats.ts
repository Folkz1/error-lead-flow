
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('Buscando estatísticas do dashboard...');
      
      // Buscar total de empresas
      const { count: totalEmpresas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true });
      
      // Buscar cadências ativas (eventos de erro em processamento)
      const { count: cadenciasAtivas } = await supabase
        .from('eventos_erro')
        .select('*', { count: 'exact', head: true })
        .in('status_processamento_evento', ['processando_dia_1', 'processando_dia_2', 'processando_dia_3']);
      
      // Buscar tarefas concluídas (interações com sucesso)
      const { count: tarefasConcluidas } = await supabase
        .from('interacoes')
        .select('*', { count: 'exact', head: true })
        .eq('status_interacao', 'enviada');
      
      // Calcular taxa de conversão aproximada
      const { count: sucessos } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('status_cadencia_geral', 'sucesso_contato_realizado');
      
      const taxaConversao = totalEmpresas && totalEmpresas > 0 
        ? Math.round((sucessos || 0) / totalEmpresas * 100) 
        : 0;
      
      console.log('Estatísticas calculadas:', {
        totalEmpresas,
        cadenciasAtivas,
        tarefasConcluidas,
        taxaConversao
      });
      
      return {
        totalEmpresas: totalEmpresas || 0,
        cadenciasAtivas: cadenciasAtivas || 0,
        tarefasConcluidas: tarefasConcluidas || 0,
        taxaConversao,
      };
    },
  });
};
