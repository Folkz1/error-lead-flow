
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Clock, 
  MessageSquare, 
  Bot, 
  User, 
  Calendar,
  Target,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { format, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InteractionDetailProps {
  interacao: any;
  onClose: () => void;
}

export const InteractionDetail = ({ interacao, onClose }: InteractionDetailProps) => {
  const getDuration = () => {
    if (!interacao.timestamp_criacao || !interacao.timestamp_fim) return null;
    const start = new Date(interacao.timestamp_criacao);
    const end = new Date(interacao.timestamp_fim);
    const minutes = differenceInMinutes(end, start);
    return minutes;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enviada':
        return 'bg-green-100 text-green-800';
      case 'recebida':
        return 'bg-blue-100 text-blue-800';
      case 'falhou_envio':
        return 'bg-red-100 text-red-800';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'finalizada_com_sucesso_agendamento':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return MessageSquare;
      case 'email':
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  const duration = getDuration();
  const CanalIcon = getCanalIcon(interacao.canal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Detalhes da Interação #{interacao.id}</h2>
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>

      {/* Informações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CanalIcon className="h-5 w-5" />
            Informações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Empresa</p>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    {interacao.empresas?.nome_empresa_pagina || 
                     interacao.empresas?.nome_empresa_gmn || 
                     interacao.empresas?.dominio}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Contato Utilizado</p>
                <p className="font-medium">{interacao.contato_utilizado || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Canal</p>
                <Badge className="mt-1">{interacao.canal.toUpperCase()}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <Badge className={`mt-1 ${getStatusColor(interacao.status_interacao)}`}>
                  {interacao.status_interacao}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">Direção</p>
                <div className="flex items-center gap-2 mt-1">
                  {interacao.direcao === 'entrada' ? (
                    <ArrowRight className="h-4 w-4 text-blue-600 rotate-180" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-green-600" />
                  )}
                  <span className="capitalize">{interacao.direcao || 'saida'}</span>
                </div>
              </div>

              {duration && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Duração</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{duration} minutos</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {interacao.timestamp_criacao && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Início:</span>
                <span className="font-medium">
                  {format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
              </div>
            )}
            
            {interacao.timestamp_fim && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fim:</span>
                <span className="font-medium">
                  {format(new Date(interacao.timestamp_fim), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
              </div>
            )}

            {interacao.timestamp_ultima_atualizacao && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última Atualização:</span>
                <span className="font-medium">
                  {format(new Date(interacao.timestamp_ultima_atualizacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações da IA */}
      {(interacao.agente_ia_usado || interacao.log_resumido_ia || interacao.resposta_ia) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Análise da IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {interacao.agente_ia_usado && (
              <div>
                <p className="text-sm font-medium text-gray-600">Agente IA Utilizado</p>
                <p className="font-medium">{interacao.agente_ia_usado}</p>
              </div>
            )}

            {interacao.ultimo_agente_processado && (
              <div>
                <p className="text-sm font-medium text-gray-600">Último Agente Processado</p>
                <p className="font-medium">{interacao.ultimo_agente_processado}</p>
              </div>
            )}

            {interacao.log_resumido_ia && (
              <div>
                <p className="text-sm font-medium text-gray-600">Resumo da IA</p>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{interacao.log_resumido_ia}</p>
                </div>
              </div>
            )}

            {interacao.resposta_ia && (
              <div>
                <p className="text-sm font-medium text-gray-600">Resposta da IA</p>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">{interacao.resposta_ia}</p>
                </div>
              </div>
            )}

            {interacao.custo_estimado && (
              <div>
                <p className="text-sm font-medium text-gray-600">Custo Estimado</p>
                <p className="font-medium">R$ {Number(interacao.custo_estimado).toFixed(4)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Histórico de Chat */}
      {interacao.contato_utilizado && (
        <ChatInterface 
          sessionId={interacao.contato_utilizado} 
          interacao={interacao}
        />
      )}

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Empresa
            </Button>
            
            {interacao.google_calender_event_id && (
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Ver Agendamento
              </Button>
            )}
            
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Criar Follow-up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
