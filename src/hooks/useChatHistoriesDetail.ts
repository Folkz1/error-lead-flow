
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ChatHistoryDetail = Tables<'n8n_chat_histories'>;

export const useChatHistoriesDetail = (sessionId: string) => {
  return useQuery({
    queryKey: ['chat-histories-detail', sessionId],
    queryFn: async () => {
      console.log('Buscando histórico detalhado do chat para sessão:', sessionId);
      
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp_criacao', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar histórico detalhado do chat:', error);
        throw error;
      }
      
      console.log('Histórico detalhado encontrado:', data?.length);
      return data as ChatHistoryDetail[];
    },
    enabled: !!sessionId,
  });
};
