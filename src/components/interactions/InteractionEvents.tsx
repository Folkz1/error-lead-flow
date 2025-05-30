
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Link as LinkIcon, 
  Clock, 
  ExternalLink,
  Eye,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface InteractionEventsProps {
  eventos: Array<{
    id: number;
    timestamp_evento: string;
    tipo_evento: string;
    identificador_link_pai?: string;
    url_destino?: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_term?: string;
    utm_content?: string;
    dados_adicionais?: any;
  }>;
}

export const InteractionEvents = ({ eventos }: InteractionEventsProps) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const getEventIcon = (tipoEvento: string) => {
    switch (tipoEvento) {
      case 'click':
        return LinkIcon;
      default:
        return Tag;
    }
  };

  const getEventColor = (tipoEvento: string) => {
    switch (tipoEvento) {
      case 'click':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (eventos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Eventos Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento registrado</h3>
            <p className="text-gray-600">
              Os eventos de analytics aparecerão aqui conforme forem registrados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Eventos Analytics ({eventos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {eventos.map((evento) => {
            const EventIcon = getEventIcon(evento.tipo_evento);
            
            return (
              <div key={evento.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EventIcon className="h-4 w-4 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Badge className={getEventColor(evento.tipo_evento)}>
                      {evento.tipo_evento}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(evento.timestamp_evento), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  {evento.identificador_link_pai && (
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Link:</strong> {evento.identificador_link_pai}
                    </p>
                  )}
                  
                  {evento.url_destino && (
                    <div className="flex items-center space-x-1 mt-1">
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600 truncate">{evento.url_destino}</span>
                    </div>
                  )}
                  
                  {/* UTM Parameters */}
                  {(evento.utm_source || evento.utm_campaign || evento.utm_medium) && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {evento.utm_source && (
                        <Badge variant="outline" className="text-xs">
                          source: {evento.utm_source}
                        </Badge>
                      )}
                      {evento.utm_campaign && (
                        <Badge variant="outline" className="text-xs">
                          campaign: {evento.utm_campaign}
                        </Badge>
                      )}
                      {evento.utm_medium && (
                        <Badge variant="outline" className="text-xs">
                          medium: {evento.utm_medium}
                        </Badge>
                      )}
                      {evento.utm_term && (
                        <Badge variant="outline" className="text-xs">
                          term: {evento.utm_term}
                        </Badge>
                      )}
                      {evento.utm_content && (
                        <Badge variant="outline" className="text-xs">
                          content: {evento.utm_content}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {evento.dados_adicionais && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedEvent(evento)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver Dados
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal para mostrar dados adicionais */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Dados Adicionais do Evento</h3>
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Fechar
                </Button>
              </div>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(selectedEvent.dados_adicionais, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
