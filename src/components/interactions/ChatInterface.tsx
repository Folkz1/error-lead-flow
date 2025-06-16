
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail, 
  MessageSquare,
  Image,
  Paperclip,
  Bot,
  User
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useInteracaoComChat, type MensagemUnificada } from "@/hooks/useInteracaoComChat";

interface ChatInterfaceProps {
  empresaId: number;
  onRefresh: () => void;
}

export const ChatInterface = ({ empresaId, onRefresh }: ChatInterfaceProps) => {
  const [novaMensagem, setNovaMensagem] = useState("");
  const [canalSelecionado, setCanalSelecionado] = useState("whatsapp");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Usar o novo hook para buscar mensagens unificadas
  const { data: mensagensUnificadas = [], refetch } = useInteracaoComChat(empresaId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagensUnificadas]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const enviarMensagemMutation = useMutation({
    mutationFn: async ({ mensagem, canal }: { mensagem: string; canal: string }) => {
      console.log(`Enviando mensagem para empresa ${empresaId} via ${canal}`);
      
      const { data, error } = await supabase
        .from('interacoes')
        .insert({
          empresa_id: empresaId,
          canal: canal,
          status_interacao: 'enviada',
          direcao: 'saida',
          resposta_ia: mensagem,
          log_resumido_ia: `Mensagem enviada via ${canal}`,
          timestamp_criacao: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mensagem enviada!",
        description: `Mensagem enviada via ${canalSelecionado.toUpperCase()}`,
      });
      setNovaMensagem("");
      refetch();
      onRefresh();
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
    enviarMensagemMutation.mutate({ mensagem: novaMensagem, canal: canalSelecionado });
    setIsLoading(false);
  };

  const getChannelIcon = (canal: string) => {
    switch (canal.toLowerCase()) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'telefone':
        return <Phone className="h-4 w-4 text-purple-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAutorIcon = (autor: string) => {
    switch (autor) {
      case 'cliente':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'agente':
      case 'sistema':
        return <Bot className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'enviada':
        return 'bg-green-100 text-green-800';
      case 'entregue':
        return 'bg-blue-100 text-blue-800';
      case 'lida':
        return 'bg-purple-100 text-purple-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderMensagem = (mensagem: MensagemUnificada) => {
    const isCliente = mensagem.autor === 'cliente';
    
    return (
      <div key={mensagem.id} className="flex space-x-3 mb-4">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback>
            {getAutorIcon(mensagem.autor)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-medium">
              {isCliente ? 'Cliente' : 'Agente'}
            </span>
            
            {mensagem.tipo === 'interacao' && (
              <>
                {mensagem.canal && getChannelIcon(mensagem.canal)}
                <Badge className={getStatusColor(mensagem.status)}>
                  {mensagem.status || 'N/A'}
                </Badge>
              </>
            )}
            
            <Badge variant="outline" className="text-xs">
              {mensagem.tipo === 'chat' ? 'Chat' : 'Sistema'}
            </Badge>
            
            <span className="text-xs text-gray-500">
              {format(new Date(mensagem.timestamp), 'dd/MM HH:mm', { locale: ptBR })}
            </span>
          </div>
          
          <div className={`p-3 rounded-lg max-w-sm break-words ${
            isCliente 
              ? 'bg-gray-100 text-gray-900' 
              : 'bg-blue-500 text-white'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Chat Unificado</span>
          </span>
          <Badge variant="outline">{mensagensUnificadas.length} mensagens</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area with proper ScrollArea configuration */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {mensagensUnificadas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>Nenhuma conversa iniciada ainda</p>
                  <p className="text-sm">Envie a primeira mensagem para começar</p>
                </div>
              ) : (
                mensagensUnificadas.map(renderMensagem)
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <Separator className="flex-shrink-0" />

        {/* Message Input Area */}
        <div className="p-4 space-y-3 flex-shrink-0">
          {/* Channel Selection */}
          <div className="flex space-x-2">
            {['whatsapp', 'email', 'telefone'].map((canal) => (
              <Button
                key={canal}
                variant={canalSelecionado === canal ? "default" : "outline"}
                size="sm"
                onClick={() => setCanalSelecionado(canal)}
                className="flex items-center space-x-1"
              >
                {getChannelIcon(canal)}
                <span className="capitalize">{canal}</span>
              </Button>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Textarea
              placeholder={`Digite sua mensagem via ${canalSelecionado}...`}
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
            <div className="flex flex-col space-y-2">
              <Button
                size="sm"
                variant="outline"
                disabled
                title="Em breve: Anexar arquivo"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled
                title="Em breve: Anexar imagem"
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleEnviarMensagem}
                disabled={!novaMensagem.trim() || isLoading || enviarMensagemMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
