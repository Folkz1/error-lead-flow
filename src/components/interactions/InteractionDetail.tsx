
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  User, 
  MessageSquare, 
  Phone, 
  Mail, 
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type Interacao = Tables<'interacoes'>;

interface InteractionDetailProps {
  interacao: Interacao;
  onVoltar: () => void;
  onResponder: () => void;
}

export const InteractionDetail = ({ interacao, onVoltar, onResponder }: InteractionDetailProps) => {
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
      case 'respondida':
        return 'bg-emerald-100 text-emerald-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCusto = (custo: number | null) => {
    if (!custo) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(custo));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              {getChannelIcon(interacao.canal)}
              <span>Interação #{interacao.id}</span>
            </h2>
            <p className="text-gray-600">
              {format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onResponder} className="bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Responder
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Status da Interação
            <Badge className={getStatusColor(interacao.status_interacao)}>
              {interacao.status_interacao}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Canal</p>
              <div className="flex items-center space-x-2">
                {getChannelIcon(interacao.canal)}
                <span className="font-medium capitalize">{interacao.canal}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Direção</p>
              <p className="font-medium capitalize">{interacao.direcao}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Agente IA</p>
              <p className="font-medium">{interacao.agente_ia_usado || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Custo Estimado</p>
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">{formatCusto(interacao.custo_estimado)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Conteúdo da Mensagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interacao.resposta_ia && (
              <div>
                <h4 className="font-medium mb-2">Resposta da IA:</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap">{interacao.resposta_ia}</p>
                </div>
              </div>
            )}
            
            {interacao.log_resumido_ia && (
              <div>
                <h4 className="font-medium mb-2">Resumo:</h4>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p>{interacao.log_resumido_ia}</p>
                </div>
              </div>
            )}

            {interacao.prompt_usado && (
              <div>
                <h4 className="font-medium mb-2">Prompt Utilizado:</h4>
                <ScrollArea className="h-32">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">{interacao.prompt_usado}</pre>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes Técnicos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes Técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">ID Referência Externa</p>
                <p className="font-medium">{interacao.referencia_externa_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Contato Utilizado</p>
                <p className="font-medium">{interacao.contato_utilizado || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Atualização</p>
                <p className="font-medium">
                  {interacao.timestamp_ultima_atualizacao 
                    ? format(new Date(interacao.timestamp_ultima_atualizacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Finalização</p>
                <p className="font-medium">
                  {interacao.timestamp_fim 
                    ? format(new Date(interacao.timestamp_fim), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                    : 'Em andamento'
                  }
                </p>
              </div>
            </div>

            {interacao.log_completo_ia && (
              <div>
                <h4 className="font-medium mb-2">Log Completo da IA:</h4>
                <ScrollArea className="h-40">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap">
                      {JSON.stringify(interacao.log_completo_ia, null, 2)}
                    </pre>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Mensagens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Timeline de Mensagens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Mensagem do Agente</span>
                  <span className="text-xs text-gray-500">
                    {interacao.ultima_mensagem_agente_timestamp
                      ? format(new Date(interacao.ultima_mensagem_agente_timestamp), 'dd/MM HH:mm', { locale: ptBR })
                      : 'N/A'
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-600">Última atividade do sistema</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Mensagem do Usuário</span>
                  <span className="text-xs text-gray-500">
                    {interacao.ultima_mensagem_usuario_timestamp
                      ? format(new Date(interacao.ultima_mensagem_usuario_timestamp), 'dd/MM HH:mm', { locale: ptBR })
                      : 'Sem resposta'
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-600">Última resposta recebida</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
