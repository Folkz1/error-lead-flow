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
  Paperclip
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatInterfaceProps {
  empresaId: number;
  interacoes: any[];
  onRefresh: () => void;
}

export const ChatInterface = ({ empresaId, interacoes, onRefresh }: ChatInterfaceProps) => {
  const [novaMensagem, setNovaMensagem] = useState("");
  const [canalSelecionado, setCanalSelecionado] = useState("whatsapp");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [interacoes]);

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

  const getStatusColor = (status: string) => {
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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Chat de Interações</span>
          </span>
          <Badge variant="outline">{interacoes.length} mensagens</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {interacoes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p>Nenhuma conversa iniciada ainda</p>
                <p className="text-sm">Envie a primeira mensagem para começar</p>
              </div>
            ) : (
              interacoes.map((interacao, index) => (
                <div key={interacao.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getChannelIcon(interacao.canal)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {interacao.direcao === 'saida' ? 'Você' : 'Cliente'}
                      </span>
                      <Badge className={getStatusColor(interacao.status_interacao)}>
                        {interacao.status_interacao}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(interacao.timestamp_criacao), 'dd/MM HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                    
                    <div className={`p-3 rounded-lg max-w-xs ${
                      interacao.direcao === 'saida' 
                        ? 'bg-blue-500 text-white ml-auto' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{interacao.resposta_ia || interacao.log_resumido_ia}</p>
                    </div>
                    
                    {interacao.log_resumido_ia && interacao.resposta_ia && (
                      <p className="text-xs text-gray-500 italic">
                        {interacao.log_resumido_ia}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Message Input Area */}
        <div className="p-4 space-y-3">
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
