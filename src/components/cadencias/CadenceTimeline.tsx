
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  User
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CadenceTimelineProps {
  empresaId: number;
}

export const CadenceTimeline = ({ empresaId }: CadenceTimelineProps) => {
  const { data: timeline, isLoading } = useQuery({
    queryKey: ['cadence-timeline', empresaId],
    queryFn: async () => {
      console.log('Buscando timeline da empresa:', empresaId);
      
      // Buscar interações
      const { data: interacoes } = await supabase
        .from('interacoes')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('timestamp_criacao', { ascending: false });
      
      // Buscar agendamentos
      const { data: agendamentos } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('timestamp_criacao', { ascending: false });
      
      // Buscar eventos de erro
      const { data: eventos } = await supabase
        .from('eventos_erro')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('data_criacao', { ascending: false });
      
      // Buscar follow-ups
      const { data: followUps } = await supabase
        .from('tarefas_follow_up')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('data_criacao', { ascending: false });
      
      // Combinar todos os eventos em uma timeline
      const allEvents = [
        ...(interacoes?.map(i => ({
          id: `interacao-${i.id}`,
          type: 'interacao',
          timestamp: i.timestamp_criacao,
          data: i,
          icon: getInteractionIcon(i.canal),
          title: `${i.canal.toUpperCase()} - ${i.status_interacao}`,
          description: i.log_resumido_ia || 'Interação realizada'
        })) || []),
        ...(agendamentos?.map(a => ({
          id: `agendamento-${a.id}`,
          type: 'agendamento',
          timestamp: a.timestamp_criacao,
          data: a,
          icon: Calendar,
          title: `Agendamento - ${a.status_agendamento}`,
          description: a.notas_agendamento || `Reunião agendada para ${format(new Date(a.timestamp_agendamento), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`
        })) || []),
        ...(eventos?.map(e => ({
          id: `evento-${e.id}`,
          type: 'evento',
          timestamp: e.data_criacao,
          data: e,
          icon: AlertTriangle,
          title: `Evento de Erro - ${e.status_processamento_evento}`,
          description: e.nome_erro || 'Evento detectado no site'
        })) || []),
        ...(followUps?.map(f => ({
          id: `followup-${f.id}`,
          type: 'followup',
          timestamp: f.data_criacao,
          data: f,
          icon: Clock,
          title: `Follow-up - ${f.status_follow_up}`,
          description: f.detalhes_solicitacao_follow_up || 'Tarefa de follow-up criada'
        })) || [])
      ];
      
      // Ordenar por timestamp
      allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return allEvents;
    }
  });

  const getInteractionIcon = (canal: string) => {
    const icons: Record<string, any> = {
      'email': Mail,
      'whatsapp': MessageSquare,
      'telefone': Phone,
      'sms': MessageSquare
    };
    return icons[canal] || MessageSquare;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'interacao': 'bg-blue-100 text-blue-800',
      'agendamento': 'bg-green-100 text-green-800',
      'evento': 'bg-orange-100 text-orange-800',
      'followup': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Timeline da Empresa</CardTitle>
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
          <Clock className="h-5 w-5" />
          <span>Timeline da Empresa</span>
          <Badge variant="outline">{timeline?.length || 0} eventos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          {timeline && timeline.length > 0 ? (
            <div className="space-y-4">
              {timeline.map((event, index) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-px h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {event.title}
                        </h4>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>Nenhum evento registrado ainda</p>
              <p className="text-sm">Os eventos aparecerão aqui conforme as cadências forem executadas</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
