
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  User,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { useEmpresaInteracoes } from "@/hooks/useEmpresaInteracoes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface EmpresaHistoricoProps {
  empresaId: number;
  empresaNome: string;
  onVoltar: () => void;
}

export const EmpresaHistorico = ({ empresaId, empresaNome, onVoltar }: EmpresaHistoricoProps) => {
  const { data, isLoading, error } = useEmpresaInteracoes(empresaId);
  const [selectedInteracao, setSelectedInteracao] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida':
        return 'bg-green-100 text-green-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'falha':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'telefone':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h3 className="text-xl font-semibold">Carregando histórico...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h3 className="text-xl font-semibold text-red-600">
            Erro ao carregar histórico: {error.message}
          </h3>
        </div>
      </div>
    );
  }

  const { interacoes, contatos } = data || { interacoes: [], contatos: [] };

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
            <h3 className="text-xl font-semibold">Histórico de {empresaNome}</h3>
            <p className="text-gray-600">{interacoes.length} interações encontradas</p>
          </div>
        </div>
      </div>

      {/* Contatos da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Contatos ({contatos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contatos.map((contato) => (
              <div key={contato.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{contato.valor_contato}</div>
                  <div className="text-sm text-gray-600">
                    <Badge variant="outline">{contato.tipo_contato}</Badge>
                    {contato.status_contato && (
                      <Badge className="ml-2" variant="secondary">
                        {contato.status_contato}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {contatos.length === 0 && (
            <p className="text-gray-500 text-center py-4">Nenhum contato encontrado</p>
          )}
        </CardContent>
      </Card>

      {/* Interações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Interações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {interacoes.map((interacao) => (
              <div key={interacao.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getCanalIcon(interacao.canal)}
                    <div>
                      <div className="font-medium">
                        {interacao.canal.charAt(0).toUpperCase() + interacao.canal.slice(1)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {interacao.contato_utilizado}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(interacao.status_interacao)}>
                      {interacao.status_interacao}
                    </Badge>
                    {interacao.timestamp_criacao && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    )}
                  </div>
                </div>

                {interacao.log_resumido_ia && (
                  <div className="mb-3 p-3 bg-gray-50 rounded">
                    <div className="text-sm font-medium mb-1">Resumo:</div>
                    <div className="text-sm">{interacao.log_resumido_ia}</div>
                  </div>
                )}

                {interacao.resposta_ia && (
                  <div className="mb-3 p-3 bg-blue-50 rounded">
                    <div className="text-sm font-medium mb-1">Resposta IA:</div>
                    <div className="text-sm">{interacao.resposta_ia}</div>
                  </div>
                )}

                {/* Chat History */}
                {interacao.chatHistories && interacao.chatHistories.length > 0 && (
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedInteracao(
                        selectedInteracao === interacao.id ? null : interacao.id
                      )}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Ver Chat ({interacao.chatHistories.length} mensagens)
                    </Button>
                    
                    {selectedInteracao === interacao.id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {interacao.chatHistories.map((chat, index) => (
                            <div key={index} className="text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Mensagem {index + 1}</span>
                                {chat.timestamp_criacao && (
                                  <span className="text-xs text-gray-500">
                                    {format(new Date(chat.timestamp_criacao), 'HH:mm', { locale: ptBR })}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 p-2 bg-white rounded text-xs">
                                {JSON.stringify(chat.message, null, 2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {interacao.custo_estimado && (
                  <div className="mt-2 text-sm text-gray-600">
                    Custo estimado: R$ {interacao.custo_estimado}
                  </div>
                )}
              </div>
            ))}
          </div>
          {interacoes.length === 0 && (
            <p className="text-gray-500 text-center py-8">Nenhuma interação encontrada</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
