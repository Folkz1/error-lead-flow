
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type FollowUp = Tables<'tarefas_follow_up'>;
type FollowUpInsert = TablesInsert<'tarefas_follow_up'>;

export const useFollowUps = (status?: string) => {
  return useQuery({
    queryKey: ['follow-ups', status],
    queryFn: async () => {
      console.log('Buscando follow-ups...');
      
      let query = supabase
        .from('tarefas_follow_up')
        .select(`
          *,
          empresas!tarefas_follow_up_empresa_id_fkey (
            dominio,
            nome_empresa_pagina,
            nome_empresa_gmn
          ),
          interacoes!tarefas_follow_up_interacao_id_fkey (
            canal,
            status_interacao
          )
        `)
        .order('data_prevista_follow_up', { ascending: true });
      
      if (status && status !== 'todos') {
        query = query.eq('status_follow_up', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar follow-ups:', error);
        throw error;
      }
      
      console.log('Follow-ups encontrados:', data?.length);
      return data;
    },
  });
};

export const useUpdateFollowUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<FollowUp> }) => {
      console.log('Atualizando follow-up:', id, updates);
      const { data, error } = await supabase
        .from('tarefas_follow_up')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar follow-up:', error);
        throw error;
      }
      
      return data as FollowUp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
};

export const useCreateFollowUp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (followUp: FollowUpInsert) => {
      console.log('Criando follow-up:', followUp);
      const { data, error } = await supabase
        .from('tarefas_follow_up')
        .insert(followUp)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar follow-up:', error);
        throw error;
      }
      
      return data as FollowUp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] });
    },
  });
};
