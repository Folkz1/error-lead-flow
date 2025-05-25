
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type TemplateMensagem = Tables<'templates_mensagens'>;
type TemplateMensagemInsert = TablesInsert<'templates_mensagens'>;

export const useTemplates = (canal?: string) => {
  return useQuery({
    queryKey: ['templates', canal],
    queryFn: async () => {
      console.log('Buscando templates...');
      
      let query = supabase
        .from('templates_mensagens')
        .select('*')
        .eq('ativo', true)
        .order('etapa_cadencia', { ascending: true });
      
      if (canal) {
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

export const useUpdateTemplateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<TemplateMensagemInsert> }) => {
      console.log(`Atualizando template ID: ${id}`, updates);
      const { data, error } = await supabase
        .from('templates_mensagens')
        .update(updates)
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

export const useDeleteTemplateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      console.log(`Deletando template ID: ${id}`);
      const { error } = await supabase
        .from('templates_mensagens')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar template:', error);
        throw error;
      }
      
      // No data is returned on a successful delete operation by default
      return null; 
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
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
