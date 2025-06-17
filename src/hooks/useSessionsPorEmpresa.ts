
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SessionInfo {
  session_id: string;
  empresa_id: number;
  total_mensagens: number;
  ultima_mensagem: string;
  timestamp_ultima_mensagem: string;
  primeiro_contato: string;
}

export const useSessionsPorEmpresa = (empresaId: number) => {
  return useQuery({
    queryKey: ['sessions-por-empresa', empresaId],
    queryFn: async () => {
      console.log('Buscando sessões de chat para empresa:', empresaId);
      
      // Primeiro, buscar todas as interações da empresa para obter os session_ids
      const { data: interacoes, error: interacoesError } = await supabase
        .from('interacoes')
        .select(`
          contato_utilizado,
          timestamp_criacao
        `)
        .eq('empresa_id', empresaId)
        .not('contato_utilizado', 'is', null)
        .order('timestamp_criacao', { ascending: false });
      
      if (interacoesError) {
        console.error('Erro ao buscar interações:', interacoesError);
        throw interacoesError;
      }

      // Obter session_ids únicos
      const sessionIds = Array.from(new Set(
        interacoes?.map(i => i.contato_utilizado).filter(Boolean) || []
      ));

      if (sessionIds.length === 0) {
        return [];
      }

      // Para cada session_id, buscar informações do chat
      const sessionsInfo: SessionInfo[] = [];
      
      for (const sessionId of sessionIds) {
        const { data: chatMessages, error: chatError } = await supabase
          .from('n8n_chat_histories')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp_criacao', { ascending: true });
        
        if (chatError) {
          console.error(`Erro ao buscar chat para sessão ${sessionId}:`, chatError);
          continue;
        }

        if (chatMessages && chatMessages.length > 0) {
          const ultimaMensagem = chatMessages[chatMessages.length - 1];
          const primeiraMensagem = chatMessages[0];
          
          // Extrair conteúdo da última mensagem
          let conteudoUltimaMensagem = '';
          try {
            const messageData = ultimaMensagem.message as any;
            if (typeof messageData === 'string') {
              conteudoUltimaMensagem = messageData;
            } else if (messageData?.text) {
              conteudoUltimaMensagem = messageData.text;
            } else if (messageData?.content) {
              conteudoUltimaMensagem = messageData.content;
            } else if (messageData?.message) {
              conteudoUltimaMensagem = messageData.message;
            } else {
              conteudoUltimaMensagem = 'Mensagem sem conteúdo legível';
            }
          } catch (error) {
            conteudoUltimaMensagem = 'Erro ao processar mensagem';
          }
          
          // Truncar mensagem se for muito longa
          if (conteudoUltimaMensagem.length > 100) {
            conteudoUltimaMensagem = conteudoUltimaMensagem.substring(0, 100) + '...';
          }

          sessionsInfo.push({
            session_id: sessionId,
            empresa_id: empresaId,
            total_mensagens: chatMessages.length,
            ultima_mensagem: conteudoUltimaMensagem,
            timestamp_ultima_mensagem: ultimaMensagem.timestamp_criacao!,
            primeiro_contato: primeiraMensagem.timestamp_criacao!
          });
        }
      }

      // Ordenar por timestamp da última mensagem (mais recente primeiro)
      sessionsInfo.sort((a, b) => 
        new Date(b.timestamp_ultima_mensagem).getTime() - new Date(a.timestamp_ultima_mensagem).getTime()
      );

      console.log(`Encontradas ${sessionsInfo.length} sessões para empresa ${empresaId}`);
      return sessionsInfo;
    },
    enabled: !!empresaId,
  });
};
