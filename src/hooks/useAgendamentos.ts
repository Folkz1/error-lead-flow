
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Agendamento = Tables<'agendamentos'>;
type AgendamentoInsert = TablesInsert<'agendamentos'>;

export const useAgendamentos = () => {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      console.log('Buscando agendamentos...');
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          empresas!fk_agendamentos_empresa_id (
            dominio,
            nome_empresa_pagina,
            nome_empresa_gmn
          )
        `)
        .order('timestamp_agendamento', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw error;
      }
      
      console.log('Agendamentos encontrados:', data?.length);
      return data;
    },
  });
};

export const useCreateAgendamento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (agendamento: AgendamentoInsert) => {
      console.log('Criando agendamento:', agendamento);
      const { data, error } = await supabase
        .from('agendamentos')
        .insert(agendamento)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar agendamento:', error);
        throw error;
      }
      
      return data as Agendamento;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
    },
  });
};
