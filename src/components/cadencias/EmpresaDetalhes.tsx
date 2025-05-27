
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Globe, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Calendar,
  CheckSquare,
  Clock,
  ExternalLink,
  Edit,
  X,
  Play,
  Pause
} from "lucide-react";
import { useEmpresaDetalhada } from "@/hooks/useCadencias";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmpresaDetalhesProps {
  empresaId: number;
  onClose: () => void;
}

export const EmpresaDetalhes = ({ empresaId, onClose }: EmpresaDetalhesProps) => {
  const { data: empresa, isLoading, error } = useEmpresaDetalhada(empresaId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-center">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (error || !empresa) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <p className="text-red-600">Erro ao carregar detalhes da empresa</p>
          <Button onClick={onClose} className="mt-4">Fechar</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso_contato_realizado':
        return 'bg-green-100 text-green-800';
      case 'apta_para_contato':
        return 'bg-blue-100 text-blue-800';
      case 'nao_perturbe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}
              </h2>
              <p className="text-gray-600">{empresa.dominio}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar Status
            </Button>
            <Button size="sm" variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pausar Cadência
            </Button>
            <Button onClick={onClose} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Informações da Empresa
                <Badge className={getStatusColor(empresa.status_cadencia_geral || '')}>
                  {empresa.status_cadencia_geral?.replace(/_/g, ' ') || 'N/A'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status Geral</p>
                  <p className="font-medium">{empresa.status_geral || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tentativas</p>
                  <p className="font-medium">{empresa.contador_total_tentativas_cadencia || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Último Contato</p>
                  <p className="font-medium">
                    {empresa.timestamp_ultima_tentativa_cadencia 
                      ? format(new Date(empresa.timestamp_ultima_tentativa_cadencia), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Próxima Tentativa</p>
                  <p className="font-medium">
                    {empresa.timestamp_proxima_tentativa_permitida 
                      ? format(new Date(empresa.timestamp_proxima_tentativa_permitida), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Erros */}
          {empresa.eventos_erro && empresa.eventos_erro.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Erros Detectados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {empresa.eventos_erro.slice(0, 3).map((erro) => (
                    <div key={erro.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{erro.tipo_erro_site}</p>
                          <p className="text-sm text-gray-600">{erro.url_site_com_erro}</p>
                        </div>
                        <Badge variant={erro.status_processamento_evento === 'processado' ? 'default' : 'secondary'}>
                          {erro.status_processamento_evento}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {erro.timestamp_erro_detectado && 
                          format(new Date(erro.timestamp_erro_detectado), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contatos */}
          {empresa.contatos_empresa && empresa.contatos_empresa.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contatos ({empresa.contatos_empresa.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {empresa.contatos_empresa.slice(0, 5).map((contato) => (
                    <div key={contato.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{contato.tipo_contato}</Badge>
                        <span>{contato.valor_contato}</span>
                        {contato.whatsappbusiness && (
                          <Badge className="bg-green-100 text-green-800">Business</Badge>
                        )}
                      </div>
                      <Badge variant={contato.status_contato === 'ativo' ? 'default' : 'secondary'}>
                        {contato.status_contato || 'N/A'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interações */}
          {empresa.interacoes && empresa.interacoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Interações Recentes ({empresa.interacoes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {empresa.interacoes.slice(0, 3).map((interacao) => (
                    <div key={interacao.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge>{interacao.canal}</Badge>
                          <Badge variant="outline">{interacao.direcao}</Badge>
                        </div>
                        <Badge variant={interacao.status_interacao === 'concluida' ? 'default' : 'secondary'}>
                          {interacao.status_interacao}
                        </Badge>
                      </div>
                      {interacao.log_resumido_ia && (
                        <p className="text-sm text-gray-600 mt-2">{interacao.log_resumido_ia}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {interacao.timestamp_criacao && 
                          format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Agendamentos */}
          {empresa.agendamentos && empresa.agendamentos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Agendamentos ({empresa.agendamentos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {empresa.agendamentos.map((agendamento) => (
                    <div key={agendamento.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{agendamento.summary_gcal || 'Agendamento'}</p>
                          <p className="text-sm text-gray-600">
                            {agendamento.timestamp_agendamento && 
                              format(new Date(agendamento.timestamp_agendamento), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                            }
                          </p>
                        </div>
                        <Badge variant={agendamento.status_agendamento === 'confirmado' ? 'default' : 'secondary'}>
                          {agendamento.status_agendamento}
                        </Badge>
                      </div>
                      {agendamento.link_evento_calendar && (
                        <Button size="sm" variant="outline" className="mt-2">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver no Calendar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Follow-ups */}
          {empresa.tarefas_follow_up && empresa.tarefas_follow_up.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  Follow-ups ({empresa.tarefas_follow_up.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {empresa.tarefas_follow_up.map((followUp) => (
                    <div key={followUp.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{followUp.detalhes_solicitacao_follow_up || 'Follow-up'}</p>
                          <p className="text-sm text-gray-600">
                            Previsto para: {followUp.data_prevista_follow_up && 
                              format(new Date(followUp.data_prevista_follow_up), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                            }
                          </p>
                        </div>
                        <Badge variant={followUp.status_follow_up === 'concluido' ? 'default' : 'secondary'}>
                          {followUp.status_follow_up}
                        </Badge>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm" variant="outline">Concluir</Button>
                        <Button size="sm" variant="outline">Reagendar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notas Internas */}
          <Card>
            <CardHeader>
              <CardTitle>Notas Internas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <textarea 
                  className="w-full p-3 border rounded-lg resize-none" 
                  rows={3}
                  placeholder="Adicionar observações sobre esta empresa..."
                  defaultValue={empresa.notas_internas || ''}
                />
                <Button size="sm">Salvar Notas</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
