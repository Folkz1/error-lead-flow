
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Building2,
  Mail,
  MessageSquare,
  Phone,
  Eye,
  Clock,
  DollarSign,
  Bot,
  User,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useInteracoes } from "@/hooks/useInteracoes";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Interactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [canalFilter, setCanalFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { data: interacoes, isLoading, error } = useInteracoes();

  const filteredInteracoes = interacoes?.filter(interacao => {
    const matchesSearch = interacao.empresas?.nome_empresa_pagina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interacao.empresas?.nome_empresa_gmn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interacao.empresas?.dominio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interacao.contato_utilizado?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCanal = canalFilter === "todos" || interacao.canal === canalFilter;
    const matchesStatus = statusFilter === "todos" || interacao.status_interacao === statusFilter;
    
    return matchesSearch && matchesCanal && matchesStatus;
  });

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'email':
        return Mail;
      case 'whatsapp':
        return MessageSquare;
      case 'call':
        return Phone;
      default:
        return MessageCircle;
    }
  };

  const getCanalColor = (canal: string) => {
    switch (canal) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'whatsapp':
        return 'bg-green-100 text-green-800';
      case 'call':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'enviada':
        return 'Enviada';
      case 'recebida':
        return 'Recebida';
      case 'falhou_envio':
        return 'Falhou';
      case 'em_andamento':
        return 'Em Andamento';
      default:
        return status || 'N/A';
    }
  };

  const getDirecaoIcon = (direcao: string) => {
    return direcao === 'entrada' ? ArrowLeft : ArrowRight;
  };

  const getDirecaoColor = (direcao: string) => {
    return direcao === 'entrada' ? 'text-blue-600' : 'text-green-600';
  };

  // Agrupar interações por empresa
  const groupedInteracoes = filteredInteracoes?.reduce((groups, interacao) => {
    const empresaKey = interacao.empresas?.dominio || `empresa-${interacao.empresa_id}`;
    if (!groups[empresaKey]) {
      groups[empresaKey] = {
        empresa: interacao.empresas,
        interacoes: []
      };
    }
    groups[empresaKey].interacoes.push(interacao);
    return groups;
  }, {} as Record<string, { empresa: any; interacoes: typeof filteredInteracoes }>) || {};

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center py-12">
          <p className="text-red-600">Erro ao carregar interações: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Histórico de Interações</h2>
          <p className="text-gray-600 mt-1">Visualize todas as interações com leads por empresa.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar Interações</CardTitle>
          <CardDescription>Encontre interações por empresa, canal ou status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por empresa ou contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={canalFilter} onValueChange={setCanalFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Canais</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="call">Ligação</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="recebida">Recebida</SelectItem>
                <SelectItem value="falhou_envio">Falhou</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interactions List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Interações por Empresa ({Object.keys(groupedInteracoes).length} empresa{Object.keys(groupedInteracoes).length !== 1 ? 's' : ''})
          </h3>
        </div>

        {Object.keys(groupedInteracoes).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedInteracoes).map(([empresaKey, { empresa, interacoes: empresaInteracoes }]) => (
              <Card key={empresaKey} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {empresa?.nome_empresa_pagina || empresa?.nome_empresa_gmn || empresa?.dominio || empresaKey}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{empresa?.dominio || empresaKey}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {empresaInteracoes.length} interaç{empresaInteracoes.length === 1 ? 'ão' : 'ões'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {empresaInteracoes
                      .sort((a, b) => new Date(b.timestamp_criacao || '').getTime() - new Date(a.timestamp_criacao || '').getTime())
                      .map((interacao) => {
                        const CanalIcon = getCanalIcon(interacao.canal);
                        const DirecaoIcon = getDirecaoIcon(interacao.direcao || 'saida');
                        
                        return (
                          <div key={interacao.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${getCanalColor(interacao.canal)}`}>
                                  <CanalIcon className="h-4 w-4" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getCanalColor(interacao.canal)} variant="secondary">
                                      {interacao.canal.toUpperCase()}
                                    </Badge>
                                    <Badge className={getStatusColor(interacao.status_interacao)}>
                                      {getStatusLabel(interacao.status_interacao)}
                                    </Badge>
                                    {interacao.direcao && (
                                      <div className={`flex items-center space-x-1 ${getDirecaoColor(interacao.direcao)}`}>
                                        <DirecaoIcon className="h-3 w-3" />
                                        <span className="text-xs font-medium">
                                          {interacao.direcao === 'entrada' ? 'Recebida' : 'Enviada'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                      {interacao.timestamp_criacao && 
                                        format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {interacao.custo_estimado && (
                                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                                    <DollarSign className="h-3 w-3" />
                                    <span>R$ {Number(interacao.custo_estimado).toFixed(4)}</span>
                                  </div>
                                )}
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver Detalhes
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              {interacao.contato_utilizado && (
                                <div>
                                  <p className="font-medium text-gray-600">Contato:</p>
                                  <p className="text-gray-900">{interacao.contato_utilizado}</p>
                                </div>
                              )}

                              {interacao.agente_ia_usado && (
                                <div className="flex items-center space-x-1">
                                  <Bot className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="font-medium text-gray-600">Agente IA:</p>
                                    <p className="text-gray-900">{interacao.agente_ia_usado}</p>
                                  </div>
                                </div>
                              )}

                              {interacao.ultimo_agente_processado && (
                                <div className="flex items-center space-x-1">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="font-medium text-gray-600">Último Agente:</p>
                                    <p className="text-gray-900">{interacao.ultimo_agente_processado}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {interacao.log_resumido_ia && (
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-600 text-sm mb-1">Resumo da IA:</p>
                                <p className="text-sm text-gray-900">{interacao.log_resumido_ia}</p>
                              </div>
                            )}

                            {interacao.resposta_ia && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="font-medium text-gray-600 text-sm mb-1">Resposta da IA:</p>
                                <p className="text-sm text-gray-900">{interacao.resposta_ia}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma interação encontrada</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || canalFilter !== "todos" || statusFilter !== "todos"
                    ? "Nenhuma interação corresponde aos filtros aplicados." 
                    : "As interações aparecerão aqui conforme forem processadas."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interactions;
