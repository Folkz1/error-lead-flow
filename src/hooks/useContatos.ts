
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type ContatoEmpresa = Tables<'contatos_empresa'>;
type ContatoEmpresaInsert = TablesInsert<'contatos_empresa'>;

export const useContatos = (empresaId?: number) => {
  return useQuery({
    queryKey: ['contatos', empresaId],
    queryFn: async () => {
      console.log('Buscando contatos...');
      
      let query = supabase
        .from('contatos_empresa')
        .select(`
          *,
          empresas!fk_contatos_empresa_empresa_id (
            dominio,
            nome_empresa_pagina,
            nome_empresa_gmn
          )
        `)
        .order('data_adicao', { ascending: false });
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar contatos:', error);
        throw error;
      }
      
      console.log('Contatos encontrados:', data?.length);
      return data;
    },
  });
};

export const useCreateContato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contato: ContatoEmpresaInsert) => {
      console.log('Criando contato:', contato);
      const { data, error } = await supabase
        .from('contatos_empresa')
        .insert(contato)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar contato:', error);
        throw error;
      }
      
      return data as ContatoEmpresa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contatos'] });
    },
  });
};
