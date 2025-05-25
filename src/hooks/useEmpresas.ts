
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Empresa = Tables<'empresas'>;
type EmpresaInsert = TablesInsert<'empresas'>;

export const useEmpresas = (searchTerm?: string, statusFilter?: string) => {
  return useQuery({
    queryKey: ['empresas', searchTerm, statusFilter],
    queryFn: async () => {
      console.log('Buscando empresas...');
      
      let query = supabase
        .from('empresas')
        .select('*')
        .order('data_criacao', { ascending: false });
      
      if (searchTerm) {
        query = query.or(`dominio.ilike.%${searchTerm}%,nome_empresa_pagina.ilike.%${searchTerm}%,nome_empresa_gmn.ilike.%${searchTerm}%`);
      }
      
      if (statusFilter && statusFilter !== 'todos') {
        query = query.eq('status_cadencia_geral', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar empresas:', error);
        throw error;
      }
      
      console.log('Empresas encontradas:', data?.length);
      return data as Empresa[];
    },
  });
};

export const useCreateEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (empresa: EmpresaInsert) => {
      console.log('Criando empresa:', empresa);
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresa)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar empresa:', error);
        throw error;
      }
      
      return data as Empresa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};

export const useUpdateEmpresa = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Empresa> }) => {
      console.log('Atualizando empresa:', id, updates);
      const { data, error } = await supabase
        .from('empresas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar empresa:', error);
        throw error;
      }
      
      return data as Empresa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};
