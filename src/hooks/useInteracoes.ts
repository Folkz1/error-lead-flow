
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Interacao = Tables<'interacoes'> & {
  empresas?: Tables<'empresas'>;
};
type InteracaoInsert = TablesInsert<'interacoes'>;

export const useInteracoes = (empresaId?: number) => {
  return useQuery({
    queryKey: ['interacoes', empresaId],
    queryFn: async () => {
      console.log('Buscando interações...');
      let query = supabase
        .from('interacoes')
        .select(`
          *,
          empresas (
            id,
            dominio,
            nome_empresa_pagina,
            nome_empresa_gmn
          )
        `)
        .order('timestamp_criacao', { ascending: false });
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar interações:', error);
        throw error;
      }
      
      console.log('Interações encontradas:', data?.length);
      return data as Interacao[];
    },
  });
};

export const useCreateInteracao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interacao: InteracaoInsert) => {
      console.log('Criando interação:', interacao);
      const { data, error } = await supabase
        .from('interacoes')
        .insert(interacao)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar interação:', error);
        throw error;
      }
      
      return data as Interacao;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interacoes'] });
    },
  });
};
