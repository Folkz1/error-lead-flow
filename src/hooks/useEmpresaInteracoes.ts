
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Interacao = Tables<'interacoes'>;
type ContatoEmpresa = Tables<'contatos_empresa'>;

export const useEmpresaInteracoes = (empresaId: number) => {
  return useQuery({
    queryKey: ['empresa-interacoes', empresaId],
    queryFn: async () => {
      console.log('Buscando interações da empresa:', empresaId);
      
      // Buscar interações da empresa
      const { data: interacoes, error: interacoesError } = await supabase
        .from('interacoes')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('timestamp_criacao', { ascending: false });
      
      if (interacoesError) {
        console.error('Erro ao buscar interações:', interacoesError);
        throw interacoesError;
      }

      // Buscar contatos da empresa
      const { data: contatos, error: contatosError } = await supabase
        .from('contatos_empresa')
        .select('*')
        .eq('empresa_id', empresaId);
      
      if (contatosError) {
        console.error('Erro ao buscar contatos:', contatosError);
        throw contatosError;
      }

      // Para cada interação, tentar encontrar histórico de chat relacionado
      const interacoesComChat = await Promise.all(
        (interacoes || []).map(async (interacao) => {
          let chatHistories = [];
          
          // Tentar buscar por referencia_externa_id ou contato_utilizado
          if (interacao.referencia_externa_id) {
            const { data: chatData } = await supabase
              .from('n8n_chat_histories')
              .select('*')
              .eq('session_id', interacao.referencia_externa_id)
              .order('timestamp_criacao', { ascending: false });
            
            if (chatData) {
              chatHistories = chatData;
            }
          }
          
          return {
            ...interacao,
            chatHistories
          };
        })
      );
      
      console.log('Interações com chat encontradas:', interacoesComChat.length);
      return {
        interacoes: interacoesComChat,
        contatos: contatos || []
      };
    },
    enabled: !!empresaId,
  });
};
