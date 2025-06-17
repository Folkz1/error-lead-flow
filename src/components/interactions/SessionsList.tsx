
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSessionsPorEmpresa, type SessionInfo } from "@/hooks/useSessionsPorEmpresa";

interface SessionsListProps {
  empresaId: number;
  empresaNome: string;
  onSessionSelect: (sessionId: string) => void;
  onVoltar: () => void;
}

export const SessionsList = ({ empresaId, empresaNome, onSessionSelect, onVoltar }: SessionsListProps) => {
  const { data: sessions = [], isLoading } = useSessionsPorEmpresa(empresaId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onVoltar}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Empresas
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Conversas - {empresaNome}</h2>
          <p className="text-muted-foreground">
            {sessions.length} {sessions.length === 1 ? 'conversa encontrada' : 'conversas encontradas'}
          </p>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Nenhuma conversa encontrada para esta empresa</p>
              <p className="text-sm text-gray-500">As conversas aparecerão quando houver interações via chat</p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.session_id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSessionSelect(session.session_id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm text-gray-600">
                        Sessão: {session.session_id.substring(0, 8)}...
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {session.total_mensagens} mensagens
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-800 mb-2 line-clamp-2">
                      {session.ultima_mensagem}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          Última: {format(new Date(session.timestamp_ultima_mensagem), 'dd/MM HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      <span>
                        Iniciada: {format(new Date(session.primeiro_contato), 'dd/MM HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <Button variant="outline" size="sm">
                      Ver Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
