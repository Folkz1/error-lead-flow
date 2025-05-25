
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useProximasAcoes = () => {
  return useQuery({
    queryKey: ['proximas-acoes'],
    queryFn: async () => {
      console.log('Buscando próximas ações...');
      
      // Buscar agendamentos futuros
      const { data: agendamentos, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select(`
          *,
          empresas!fk_agendamentos_empresa_id (
            dominio,
            nome_empresa_pagina,
            nome_empresa_gmn
          )
        `)
        .gte('timestamp_agendamento', new Date().toISOString())
        .order('timestamp_agendamento', { ascending: true })
        .limit(5);
      
      if (agendamentosError) {
        console.error('Erro ao buscar agendamentos:', agendamentosError);
        throw agendamentosError;
      }
      
      // Buscar tarefas de follow-up pendentes
      const { data: followUps, error: followUpsError } = await supabase
        .from('tarefas_follow_up')
        .select(`
          *,
          empresas!tarefas_follow_up_empresa_id_fkey (
            dominio,
            nome_empresa_pagina,
            nome_empresa_gmn
          )
        `)
        .eq('status_follow_up', 'pendente')
        .gte('data_prevista_follow_up', new Date().toISOString())
        .order('data_prevista_follow_up', { ascending: true })
        .limit(5);
      
      if (followUpsError) {
        console.error('Erro ao buscar follow-ups:', followUpsError);
        throw followUpsError;
      }
      
      console.log('Próximas ações encontradas:', {
        agendamentos: agendamentos?.length,
        followUps: followUps?.length
      });
      
      return {
        agendamentos: agendamentos || [],
        followUps: followUps || [],
      };
    },
  });
};
