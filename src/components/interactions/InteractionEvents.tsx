
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  MessageSquare, 
  Calendar, 
  AlertTriangle,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InteractionEventsProps {
  empresaId: number;
}

export const InteractionEvents = ({ empresaId }: InteractionEventsProps) => {
  const { data: eventos, isLoading } = useQuery({
    queryKey: ['interaction-events', empresaId],
    queryFn: async () => {
      console.log('Buscando eventos de interação da empresa:', empresaId);
      
      // Buscar todos os tipos de eventos relacionados às interações
      const [interacoes, agendamentos, followUps, eventosErro] = await Promise.all([
        supabase
          .from('interacoes')
          .select('*')
          .eq('empresa_id', empresaId)
          .order('timestamp_criacao', { ascending: false }),
        
        supabase
          .from('agendamentos')
          .select('*')
          .eq('empresa_id', empresaId)
          .order('timestamp_criacao', { ascending: false }),
        
        supabase
          .from('tarefas_follow_up')
          .select('*')
          .eq('empresa_id', empresaId)
          .order('data_criacao', { ascending: false }),
        
        supabase
          .from('eventos_erro')
          .select('*')
          .eq('empresa_id', empresaId)
          .order('data_criacao', { ascending: false })
      ]);
      
      // Combinar todos os eventos em uma timeline
      const todosEventos = [
        ...(interacoes.data?.map(i => ({
          id: `interacao-${i.id}`,
          type: 'interacao',
          timestamp: i.timestamp_criacao,
          data: i,
          icon: MessageSquare,
          title: `Interação ${i.canal.toUpperCase()}`,
          description: i.log_resumido_ia || 'Mensagem enviada',
          status: i.status_interacao
        })) || []),
        
        ...(agendamentos.data?.map(a => ({
          id: `agendamento-${a.id}`,
          type: 'agendamento',
          timestamp: a.timestamp_criacao,
          data: a,
          icon: Calendar,
          title: `Agendamento`,
          description: a.notas_agendamento || 'Reunião agendada',
          status: a.status_agendamento
        })) || []),
        
        ...(followUps.data?.map(f => ({
          id: `followup-${f.id}`,
          type: 'followup',
          timestamp: f.data_criacao,
          data: f,
          icon: Clock,
          title: `Follow-up`,
          description: f.detalhes_solicitacao_follow_up || 'Tarefa criada',
          status: f.status_follow_up
        })) || []),
        
        ...(eventosErro.data?.map(e => ({
          id: `evento-${e.id}`,
          type: 'evento',
          timestamp: e.data_criacao,
          data: e,
          icon: AlertTriangle,
          title: `Evento de Erro`,
          description: e.nome_erro || 'Erro detectado',
          status: e.status_processamento_evento
        })) || [])
      ];
      
      // Ordenar por timestamp
      todosEventos.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return todosEventos;
    }
  });

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'interacao': 'bg-blue-100 text-blue-800',
      'agendamento': 'bg-green-100 text-green-800',
      'evento': 'bg-red-100 text-red-800',
      'followup': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'enviada':
      case 'confirmado':
      case 'concluido':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'erro':
      case 'cancelado':
      case 'rejeitada':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-orange-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Eventos de Interação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Eventos de Interação</span>
          <Badge variant="outline">{eventos?.length || 0} eventos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {eventos && eventos.length > 0 ? (
            <div className="space-y-4">
              {eventos.map((evento, index) => {
                const Icon = evento.icon;
                return (
                  <div key={evento.id} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      {index < eventos.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {evento.title}
                          </h4>
                          <Badge className={getEventTypeColor(evento.type)}>
                            {evento.type}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(evento.status)}
                          <span className="text-xs text-gray-500">
                            {evento.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {evento.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(evento.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>Nenhum evento de interação registrado</p>
              <p className="text-sm">Os eventos aparecerão aqui conforme as interações acontecerem</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
