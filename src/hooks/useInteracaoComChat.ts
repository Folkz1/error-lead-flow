
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Interacao = Tables<'interacoes'>;
type ChatHistory = Tables<'n8n_chat_histories'>;

export interface MensagemUnificada {
  id: string;
  tipo: 'interacao' | 'chat';
  timestamp: string;
  conteudo: string;
  autor: 'cliente' | 'agente' | 'sistema';
  canal?: string;
  status?: string;
  dados_originais: Interacao | ChatHistory;
}

export const useInteracaoComChat = (empresaId: number) => {
  return useQuery({
    queryKey: ['interacao-com-chat', empresaId],
    queryFn: async () => {
      console.log('Buscando interações e chat histories para empresa:', empresaId);
      
      // Buscar interações da empresa
      const { data: interacoes, error: interacoesError } = await supabase
        .from('interacoes')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('timestamp_criacao', { ascending: true });
      
      if (interacoesError) {
        console.error('Erro ao buscar interações:', interacoesError);
        throw interacoesError;
      }

      const mensagensUnificadas: MensagemUnificada[] = [];

      // Para cada interação, buscar mensagens do chat correspondentes
      for (const interacao of interacoes || []) {
        // Adicionar a interação como mensagem
        mensagensUnificadas.push({
          id: `interacao-${interacao.id}`,
          tipo: 'interacao',
          timestamp: interacao.timestamp_criacao!,
          conteudo: interacao.resposta_ia || interacao.log_resumido_ia || 'Mensagem do sistema',
          autor: interacao.direcao === 'entrada' ? 'cliente' : 'agente',
          canal: interacao.canal,
          status: interacao.status_interacao,
          dados_originais: interacao
        });

        // Se tem contato_utilizado, buscar mensagens do chat
        if (interacao.contato_utilizado) {
          const { data: chatMessages, error: chatError } = await supabase
            .from('n8n_chat_histories')
            .select('*')
            .eq('session_id', interacao.contato_utilizado)
            .order('timestamp_criacao', { ascending: true });
          
          if (chatError) {
            console.error('Erro ao buscar chat histories:', chatError);
            continue;
          }

          // Adicionar mensagens do chat
          for (const chatMsg of chatMessages || []) {
            try {
              const messageData = chatMsg.message as any;
              let conteudo = '';
              let autor: 'cliente' | 'agente' = 'cliente';

              // Extrair conteúdo da mensagem baseado na estrutura do N8N
              if (typeof messageData === 'string') {
                conteudo = messageData;
              } else if (messageData?.text) {
                conteudo = messageData.text;
              } else if (messageData?.content) {
                conteudo = messageData.content;
              } else if (messageData?.message) {
                conteudo = messageData.message;
              } else {
                conteudo = JSON.stringify(messageData);
              }

              // Determinar autor baseado na estrutura da mensagem
              if (messageData?.role === 'assistant' || messageData?.type === 'ai') {
                autor = 'agente';
              } else if (messageData?.role === 'user' || messageData?.type === 'human') {
                autor = 'cliente';
              }

              mensagensUnificadas.push({
                id: `chat-${chatMsg.id}`,
                tipo: 'chat',
                timestamp: chatMsg.timestamp_criacao!,
                conteudo,
                autor,
                dados_originais: chatMsg
              });
            } catch (error) {
              console.error('Erro ao processar mensagem do chat:', error);
            }
          }
        }
      }

      // Ordenar todas as mensagens por timestamp
      mensagensUnificadas.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      console.log('Mensagens unificadas encontradas:', mensagensUnificadas.length);
      return mensagensUnificadas;
    },
    enabled: !!empresaId,
  });
};
