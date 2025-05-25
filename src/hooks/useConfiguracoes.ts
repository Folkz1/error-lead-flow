
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type ConfiguracaoCadencia = Tables<'configuracoes_cadencia'>;
type ConfiguracaoCadenciaInsert = TablesInsert<'configuracoes_cadencia'>;

export const useConfiguracoes = () => {
  return useQuery({
    queryKey: ['configuracoes'],
    queryFn: async () => {
      console.log('Buscando configurações...');
      
      const { data, error } = await supabase
        .from('configuracoes_cadencia')
        .select('*')
        .eq('ativo', true)
        .order('data_criacao', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar configurações:', error);
        throw error;
      }
      
      console.log('Configurações encontradas:', data?.length);
      return data as ConfiguracaoCadencia[];
    },
  });
};

export const useCreateConfiguracao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (configuracao: ConfiguracaoCadenciaInsert) => {
      console.log('Criando configuração:', configuracao);
      const { data, error } = await supabase
        .from('configuracoes_cadencia')
        .insert(configuracao)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar configuração:', error);
        throw error;
      }
      
      return data as ConfiguracaoCadencia;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] });
    },
  });
};
