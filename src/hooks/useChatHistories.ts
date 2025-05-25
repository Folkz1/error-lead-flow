
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ChatHistory = Tables<'n8n_chat_histories'>;

export const useChatHistories = (sessionId?: string) => {
  return useQuery({
    queryKey: ['chat-histories', sessionId],
    queryFn: async () => {
      console.log('Buscando histórico de chat...');
      
      let query = supabase
        .from('n8n_chat_histories')
        .select('*')
        .order('timestamp_criacao', { ascending: false });
      
      if (sessionId) {
        query = query.eq('session_id', sessionId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar histórico de chat:', error);
        throw error;
      }
      
      console.log('Histórico de chat encontrado:', data?.length);
      return data as ChatHistory[];
    },
    enabled: !!sessionId || sessionId === undefined,
  });
};
