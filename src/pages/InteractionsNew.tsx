
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Building2,
  Clock,
  Bot,
  ArrowRight,
  ArrowLeft,
  Eye,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useInteracoes } from "@/hooks/useInteracoes";
import { InteractionDetail } from "@/components/interactions/InteractionDetail";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const InteractionsNew = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [canalFilter, setCanalFilter] = useState("todos");
  const [selectedInteraction, setSelectedInteraction] = useState<any>(null);
  const { data: interacoes, isLoading, error } = useInteracoes();

  const filteredInteracoes = interacoes?.filter(interacao => {
    const matchesSearch = 
      interacao.empresas?.nome_empresa_pagina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interacao.empresas?.nome_empresa_gmn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interacao.empresas?.dominio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interacao.contato_utilizado?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || interacao.status_interacao === statusFilter;
    const matchesCanal = canalFilter === "todos" || interacao.canal === canalFilter;
    
    return matchesSearch && matchesStatus && matchesCanal;
  });

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

  const getCanalColor = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return 'bg-green-100 text-green-800';
      case 'email':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirecaoIcon = (direcao: string) => {
    return direcao === 'entrada' ? ArrowLeft : ArrowRight;
  };

  const getDirecaoColor = (direcao: string) => {
    return direcao === 'entrada' ? 'text-blue-600' : 'text-green-600';
  };

  if (selectedInteraction) {
    return (
      <div className="flex-1 p-6 overflow-auto">
        <InteractionDetail 
          interacao={selectedInteraction}
          onClose={() => setSelectedInteraction(null)}
        />
      </div>
    );
  }

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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Interações + Histórico de Chat IA
          </h2>
          <p className="text-gray-600 mt-1">
            Visualize todas as conversas automatizadas e análises de desempenho da IA
          </p>
        </div>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Interações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interacoes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">conversas registradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interacoes?.filter(i => i.canal === 'whatsapp').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">via WhatsApp</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interacoes?.filter(i => i.status_interacao === 'finalizada_com_sucesso_agendamento').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">geraram reunião</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interacoes && interacoes.length > 0 
                ? Math.round((interacoes.filter(i => i.status_interacao === 'finalizada_com_sucesso_agendamento').length / interacoes.length) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">conversão geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar Interações</CardTitle>
          <CardDescription>Encontre conversas por empresa, contato, status ou canal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por empresa, domínio ou contato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="recebida">Recebida</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="finalizada_com_sucesso_agendamento">Com Agendamento</SelectItem>
                <SelectItem value="falhou_envio">Falhou</SelectItem>
              </SelectContent>
            </Select>
            <Select value={canalFilter} onValueChange={setCanalFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Canais</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Interações */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Interações ({filteredInteracoes?.length || 0})
          </h3>
        </div>

        {filteredInteracoes && filteredInteracoes.length > 0 ? (
          <div className="space-y-4">
            {filteredInteracoes
              .sort((a, b) => new Date(b.timestamp_criacao || '').getTime() - new Date(a.timestamp_criacao || '').getTime())
              .map((interacao) => {
                const DirecaoIcon = getDirecaoIcon(interacao.direcao || 'saida');
                
                return (
                  <Card key={interacao.id} className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedInteraction(interacao)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {interacao.empresas?.nome_empresa_pagina || 
                               interacao.empresas?.nome_empresa_gmn || 
                               interacao.empresas?.dominio}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ID #{interacao.id} • {interacao.empresas?.dominio}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getCanalColor(interacao.canal)}>
                            {interacao.canal.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(interacao.status_interacao)}>
                            {interacao.status_interacao}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Contato:</p>
                          <p className="text-gray-900">{interacao.contato_utilizado || 'N/A'}</p>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Direção:</p>
                          <div className={`flex items-center space-x-1 ${getDirecaoColor(interacao.direcao || 'saida')}`}>
                            <DirecaoIcon className="h-3 w-3" />
                            <span className="capitalize">{interacao.direcao || 'saida'}</span>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Data/Hora:</p>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span>
                              {interacao.timestamp_criacao && 
                                format(new Date(interacao.timestamp_criacao), 'dd/MM HH:mm', { locale: ptBR })
                              }
                            </span>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-gray-600">Agente IA:</p>
                          <div className="flex items-center space-x-1">
                            <Bot className="h-3 w-3 text-gray-400" />
                            <span>{interacao.agente_ia_usado || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {interacao.log_resumido_ia && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-600 text-sm mb-1">Resumo da Conversa:</p>
                          <p className="text-sm text-gray-900 line-clamp-2">{interacao.log_resumido_ia}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {interacao.custo_estimado && (
                            <span>Custo: R$ {Number(interacao.custo_estimado).toFixed(4)}</span>
                          )}
                          {interacao.google_calender_event_id && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <Calendar className="h-3 w-3" />
                              <span>Com Agendamento</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {interacao.status_interacao === 'finalizada_com_sucesso_agendamento' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma interação encontrada</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "todos" || canalFilter !== "todos"
                    ? "Nenhuma interação corresponde aos filtros aplicados." 
                    : "As interações aparecerão aqui conforme forem processadas pela IA."
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

export default InteractionsNew;
