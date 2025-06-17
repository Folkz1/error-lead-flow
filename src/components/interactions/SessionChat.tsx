
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  ArrowLeft,
  MessageSquare,
  Bot,
  User
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useChatHistoriesDetail } from "@/hooks/useChatHistoriesDetail";

interface SessionChatProps {
  sessionId: string;
  empresaId: number;
  empresaNome: string;
  onVoltar: () => void;
}

interface MensagemChat {
  id: number;
  timestamp: string;
  conteudo: string;
  autor: 'cliente' | 'agente';
}

export const SessionChat = ({ sessionId, empresaId, empresaNome, onVoltar }: SessionChatProps) => {
  const [novaMensagem, setNovaMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Buscar mensagens da sessão
  const { data: chatMessages = [], refetch } = useChatHistoriesDetail(sessionId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Processar mensagens do chat
  const mensagensProcessadas: MensagemChat[] = chatMessages.map((msg) => {
    let conteudo = '';
    let autor: 'cliente' | 'agente' = 'cliente';

    try {
      const messageData = msg.message as any;
      
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
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      conteudo = 'Erro ao processar mensagem';
    }

    return {
      id: msg.id,
      timestamp: msg.timestamp_criacao!,
      conteudo,
      autor
    };
  });

  const enviarMensagemMutation = useMutation({
    mutationFn: async ({ mensagem }: { mensagem: string }) => {
      console.log(`Enviando mensagem para sessão ${sessionId}`);
      
      // Inserir nova mensagem no histórico do chat
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .insert({
          session_id: sessionId,
          message: {
            role: 'assistant',
            content: mensagem,
            type: 'ai'
          },
          timestamp_criacao: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Também criar uma interação para registro
      await supabase
        .from('interacoes')
        .insert({
          empresa_id: empresaId,
          canal: 'chat',
          status_interacao: 'enviada',
          direcao: 'saida',
          resposta_ia: mensagem,
          log_resumido_ia: `Mensagem enviada via chat para sessão ${sessionId}`,
          contato_utilizado: sessionId,
          timestamp_criacao: new Date().toISOString()
        });
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: "Mensagem enviada com sucesso",
      });
      setNovaMensagem("");
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleEnviarMensagem = () => {
    if (!novaMensagem.trim()) return;
    
    setIsLoading(true);
    enviarMensagemMutation.mutate({ mensagem: novaMensagem });
    setIsLoading(false);
  };

  const renderMensagem = (mensagem: MensagemChat) => {
    const isCliente = mensagem.autor === 'cliente';
    
    return (
      <div key={mensagem.id} className={`flex mb-4 ${isCliente ? 'justify-start' : 'justify-end'}`}>
        <div className={`flex space-x-3 max-w-[70%] ${isCliente ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>
              {isCliente ? <User className="h-4 w-4 text-blue-600" /> : <Bot className="h-4 w-4 text-green-600" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1 min-w-0">
            <div className={`flex items-center space-x-2 ${isCliente ? 'justify-start' : 'justify-end'}`}>
              <span className="text-xs font-medium text-gray-600">
                {isCliente ? 'Cliente' : 'Agente'}
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(mensagem.timestamp), 'dd/MM HH:mm', { locale: ptBR })}
              </span>
            </div>
            
            <div className={`p-3 rounded-2xl break-words shadow-sm ${
              isCliente 
                ? 'bg-gray-100 text-gray-900 rounded-tl-sm' 
                : 'bg-blue-500 text-white rounded-tr-sm'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{mensagem.conteudo}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={onVoltar}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Chat - {empresaNome}</span>
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                Sessão: {sessionId.substring(0, 12)}...
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {mensagensProcessadas.length} mensagens
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area */}
        <div className="flex-1 min-h-0 bg-gray-50">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {mensagensProcessadas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>Nenhuma mensagem nesta conversa ainda</p>
                </div>
              ) : (
                mensagensProcessadas.map(renderMensagem)
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <Separator className="flex-shrink-0" />

        {/* Message Input Area */}
        <div className="p-4 space-y-3 flex-shrink-0 bg-white">
          <div className="flex space-x-2">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              className="flex-1 min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEnviarMensagem();
                }
              }}
            />
            <Button
              onClick={handleEnviarMensagem}
              disabled={!novaMensagem.trim() || isLoading || enviarMensagemMutation.isPending}
              className="bg-green-600 hover:bg-green-700 self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
