
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Building2, Clock, User, Bot, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InteractionEvents } from "./InteractionEvents";
import { useInteractionEvents } from "@/hooks/useInteractionEvents";

interface InteractionDetailProps {
  interactionId: number;
  onBack: () => void;
}

export const InteractionDetail = ({ interactionId, onBack }: InteractionDetailProps) => {
  const { data: interacao, isLoading } = useQuery({
    queryKey: ['interacao-detalhes', interactionId],
    queryFn: async () => {
      console.log('Buscando detalhes da interação:', interactionId);
      
      const { data, error } = await supabase
        .from('interacoes')
        .select(`
          *,
          empresas:empresa_id (
            id,
            nome_empresa_pagina,
            nome_empresa_gmn,
            dominio
          )
        `)
        .eq('id', interactionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!interactionId,
  });

  const { data: chatHistory } = useQuery({
    queryKey: ['chat-history', interactionId],
    queryFn: async () => {
      if (!interacao?.contato_utilizado) return [];
      
      console.log('Buscando histórico de chat para session_id:', interacao.contato_utilizado);
      
      const { data, error } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', interacao.contato_utilizado)
        .order('timestamp_criacao', { ascending: true });

      if (error) throw error;

      console.log('Mensagens encontradas:', data?.length || 0);
      return data || [];
    },
    enabled: !!interacao?.contato_utilizado,
  });

  const { data: eventos } = useInteractionEvents(interactionId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalizada_com_sucesso_agendamento':
        return 'bg-green-100 text-green-800';
      case 'enviada_sem_resposta':
        return 'bg-yellow-100 text-yellow-800';
      case 'opt_out':
        return 'bg-red-100 text-red-800';
      case 'falhou_envio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!interacao) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Interação não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Detalhes da Interação</h2>
          <p className="text-gray-600">
            {interacao.empresas?.nome_empresa_pagina || 
             interacao.empresas?.nome_empresa_gmn || 
             interacao.empresas?.dominio}
          </p>
        </div>
      </div>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Informações da Interação</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Canal</p>
              <Badge variant="outline">{interacao.canal}</Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <Badge className={getStatusColor(interacao.status_interacao)}>
                {interacao.status_interacao}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Direção</p>
              <Badge variant="outline">{interacao.direcao}</Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600">Data de Criação</p>
              <p className="text-sm text-gray-900">
                {format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
              </p>
            </div>

            {interacao.timestamp_fim && (
              <div>
                <p className="text-sm font-medium text-gray-600">Data de Finalização</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(interacao.timestamp_fim), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-600">Contato Utilizado</p>
              <p className="text-sm text-gray-900">{interacao.contato_utilizado || 'N/A'}</p>
            </div>
          </div>

          {interacao.log_resumido_ia && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Resumo da IA</p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                {interacao.log_resumido_ia}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs para diferentes seções */}
      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Histórico de Chat</TabsTrigger>
          <TabsTrigger value="eventos">Eventos Analytics</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes Técnicos</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Conversação</CardTitle>
            </CardHeader>
            <CardContent>
              {chatHistory && chatHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className="space-y-2">
                      {msg.message && typeof msg.message === 'object' && (
                        <div className="space-y-2">
                          {/* Mensagem do usuário */}
                          {(msg.message as any).message && (
                            <div className="flex space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-900">{(msg.message as any).message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {msg.timestamp_criacao && format(new Date(msg.timestamp_criacao), 'HH:mm:ss', { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {/* Resposta da IA */}
                          {(msg.message as any).response && (
                            <div className="flex space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Bot className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1 bg-green-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-900">{(msg.message as any).response}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {msg.timestamp_criacao && format(new Date(msg.timestamp_criacao), 'HH:mm:ss', { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>Nenhuma mensagem encontrada no histórico</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eventos">
          <InteractionEvents eventos={eventos || []} />
        </TabsContent>

        <TabsContent value="detalhes">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes Técnicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interacao.agente_ia_usado && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agente IA Usado</p>
                    <p className="text-sm text-gray-900">{interacao.agente_ia_usado}</p>
                  </div>
                )}

                {interacao.custo_estimado && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Custo Estimado</p>
                    <p className="text-sm text-gray-900">R$ {Number(interacao.custo_estimado).toFixed(4)}</p>
                  </div>
                )}

                {interacao.referencia_externa_id && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Referência Externa</p>
                    <p className="text-sm text-gray-900">{interacao.referencia_externa_id}</p>
                  </div>
                )}

                {interacao.log_completo_ia && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Log Completo da IA</p>
                    <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto max-h-64">
                      {JSON.stringify(interacao.log_completo_ia, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
