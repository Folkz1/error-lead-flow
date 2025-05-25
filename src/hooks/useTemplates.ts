
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
