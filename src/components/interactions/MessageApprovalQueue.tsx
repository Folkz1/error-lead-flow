
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  CheckCircle, 
  XCircle, 
  Edit, 
  Send, 
  Clock, 
  MessageSquare,
  Mail,
  Phone,
  User,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MessageApprovalQueueProps {
  mensagensPendentes: any[];
  onRefresh: () => void;
}

export const MessageApprovalQueue = ({ mensagensPendentes, onRefresh }: MessageApprovalQueueProps) => {
  const [editandoMensagem, setEditandoMensagem] = useState<number | null>(null);
  const [mensagemEditada, setMensagemEditada] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const aprovarMensagemMutation = useMutation({
    mutationFn: async ({ id, novaResposta }: { id: number; novaResposta?: string }) => {
      console.log(`Aprovando mensagem ${id}`);
      
      const updates: any = {
        status_interacao: 'aprovada',
        timestamp_ultima_atualizacao: new Date().toISOString()
      };
      
      if (novaResposta) {
        updates.resposta_ia = novaResposta;
      }
      
      const { data, error } = await supabase
        .from('interacoes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mensagem aprovada!",
        description: "A mensagem foi aprovada e será enviada automaticamente.",
      });
      setEditandoMensagem(null);
      setMensagemEditada("");
      onRefresh();
    },
    onError: (error) => {
      toast({
        title: "Erro ao aprovar mensagem",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const rejeitarMensagemMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log(`Rejeitando mensagem ${id}`);
      
      const { data, error } = await supabase
        .from('interacoes')
        .update({
          status_interacao: 'rejeitada',
          timestamp_ultima_atualizacao: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mensagem rejeitada",
        description: "A mensagem foi rejeitada e não será enviada.",
        variant: "destructive"
      });
      onRefresh();
    },
    onError: (error) => {
      toast({
        title: "Erro ao rejeitar mensagem",
        description: error.message,
        variant: "destructive"
      });
    }
  });

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

  const handleEditar = (mensagem: any) => {
    setEditandoMensagem(mensagem.id);
    setMensagemEditada(mensagem.resposta_ia || "");
  };

  const handleSalvarEdicao = (id: number) => {
    aprovarMensagemMutation.mutate({ id, novaResposta: mensagemEditada });
  };

  const handleCancelarEdicao = () => {
    setEditandoMensagem(null);
    setMensagemEditada("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Fila de Aprovação</span>
          </div>
          <Badge variant="outline">
            {mensagensPendentes.length} pendentes
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {mensagensPendentes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>Nenhuma mensagem pendente de aprovação</p>
            <p className="text-sm">Todas as mensagens foram processadas</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {mensagensPendentes.map((mensagem, index) => (
                <div key={mensagem.id}>
                  <Card className="border border-orange-200 bg-orange-50">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header da Mensagem */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(mensagem.canal)}
                            <span className="font-medium">
                              Empresa #{mensagem.empresa_id}
                            </span>
                            <Badge variant="outline" className="bg-orange-100">
                              {mensagem.canal.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(mensagem.timestamp_criacao), 'dd/MM HH:mm', { locale: ptBR })}
                          </span>
                        </div>

                        {/* Conteúdo da Mensagem */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Mensagem proposta:</h4>
                          {editandoMensagem === mensagem.id ? (
                            <Textarea
                              value={mensagemEditada}
                              onChange={(e) => setMensagemEditada(e.target.value)}
                              className="min-h-[100px]"
                              placeholder="Edite a mensagem..."
                            />
                          ) : (
                            <div className="p-3 bg-white rounded border">
                              <p className="text-sm whitespace-pre-wrap">
                                {mensagem.resposta_ia || "Sem conteúdo"}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Resumo da IA */}
                        {mensagem.log_resumido_ia && (
                          <div className="space-y-1">
                            <h4 className="text-xs font-medium text-gray-600">Contexto:</h4>
                            <p className="text-xs text-gray-500 italic">
                              {mensagem.log_resumido_ia}
                            </p>
                          </div>
                        )}

                        {/* Ações */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex space-x-2">
                            {editandoMensagem === mensagem.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSalvarEdicao(mensagem.id)}
                                  disabled={aprovarMensagemMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Salvar e Aprovar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelarEdicao}
                                >
                                  Cancelar
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => aprovarMensagemMutation.mutate({ id: mensagem.id })}
                                  disabled={aprovarMensagemMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Aprovar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditar(mensagem)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejeitarMensagemMutation.mutate(mensagem.id)}
                                  disabled={rejeitarMensagemMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rejeitar
                                </Button>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Aguardando aprovação</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < mensagensPendentes.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
