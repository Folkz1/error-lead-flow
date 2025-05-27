
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type TemplateMensagem = Tables<'templates_mensagens'>;
type TemplateMensagemInsert = TablesInsert<'templates_mensagens'>;
type TemplateMensagemUpdate = TablesUpdate<'templates_mensagens'>;

export const useTemplates = (canal?: string) => {
  return useQuery({
    queryKey: ['templates', canal],
    queryFn: async () => {
      console.log('Buscando templates...');
      
      let query = supabase
        .from('templates_mensagens')
        .select('*')
        .order('etapa_cadencia', { ascending: true })
        .order('canal');
      
      if (canal && canal !== 'todos') {
        query = query.eq('canal', canal);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar templates:', error);
        throw error;
      }
      
      console.log('Templates encontrados:', data?.length);
      return data as TemplateMensagem[];
    },
  });
};

export const useTemplate = (id: number) => {
  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates_mensagens')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Erro ao buscar template:', error);
        throw error;
      }
      
      return data as TemplateMensagem;
    },
    enabled: !!id,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (template: TemplateMensagemInsert) => {
      console.log('Criando template:', template);
      const { data, error } = await supabase
        .from('templates_mensagens')
        .insert(template)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar template:', error);
        throw error;
      }
      
      return data as TemplateMensagem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, template }: { id: number; template: TemplateMensagemUpdate }) => {
      console.log('Atualizando template:', id, template);
      const { data, error } = await supabase
        .from('templates_mensagens')
        .update(template)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar template:', error);
        throw error;
      }
      
      return data as TemplateMensagem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      console.log('Deletando template:', id);
      const { error } = await supabase
        .from('templates_mensagens')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar template:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
};
