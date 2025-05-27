
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Building2,
  MessageSquare,
  CheckCircle,
  Play,
  Calendar,
  AlertTriangle,
  FileText
} from "lucide-react";
import { useFollowUps } from "@/hooks/useFollowUps";
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

const FollowUps = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { data: followUps, isLoading, error } = useFollowUps(statusFilter);

  const filteredFollowUps = followUps?.filter(followUp => 
    followUp.empresas?.nome_empresa_pagina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    followUp.empresas?.nome_empresa_gmn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    followUp.empresas?.dominio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    followUp.detalhes_solicitacao_follow_up?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_progresso':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'reagendado':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return AlertTriangle;
      case 'em_progresso':
        return Play;
      case 'concluido':
        return CheckCircle;
      case 'reagendado':
        return Calendar;
      default:
        return Clock;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_progresso':
        return 'Em Progresso';
      case 'concluido':
        return 'Concluído';
      case 'reagendado':
        return 'Reagendado';
      default:
        return status || 'N/A';
    }
  };

  const getPriorityColor = (dataPrevista: string) => {
    const today = new Date();
    const dataFollow = new Date(dataPrevista);
    const diffDays = Math.ceil((dataFollow.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'bg-red-100 text-red-800'; // Atrasado
    if (diffDays === 0) return 'bg-orange-100 text-orange-800'; // Hoje
    if (diffDays <= 2) return 'bg-yellow-100 text-yellow-800'; // Próximos 2 dias
    return 'bg-green-100 text-green-800'; // Futuro
  };

  const getPriorityLabel = (dataPrevista: string) => {
    const today = new Date();
    const dataFollow = new Date(dataPrevista);
    const diffDays = Math.ceil((dataFollow.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Atrasado';
    if (diffDays === 0) return 'Hoje';
    if (diffDays <= 2) return 'Urgente';
    return 'Normal';
  };

  // Agrupar follow-ups por data
  const groupedFollowUps = filteredFollowUps?.reduce((groups, followUp) => {
    const date = format(new Date(followUp.data_prevista_follow_up), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(followUp);
    return groups;
  }, {} as Record<string, typeof filteredFollowUps>) || {};

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
          <p className="text-red-600">Erro ao carregar follow-ups: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Follow-ups</h2>
          <p className="text-gray-600 mt-1">Gerencie tarefas de acompanhamento com leads e clientes.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa Follow-up
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar Follow-ups</CardTitle>
          <CardDescription>Encontre tarefas por empresa, status ou conteúdo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por empresa ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_progresso">Em Progresso</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="reagendado">Reagendado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Follow-ups List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Tarefas de Follow-up ({filteredFollowUps?.length || 0})
          </h3>
        </div>

        {Object.keys(groupedFollowUps).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedFollowUps)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([date, followUpsForDate]) => (
                <div key={date}>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{format(new Date(date), 'dd/MM/yyyy - EEEE', { locale: ptBR })}</span>
                    <Badge variant="secondary">
                      {followUpsForDate.length} tarefa{followUpsForDate.length !== 1 ? 's' : ''}
                    </Badge>
                  </h4>
                  
                  <div className="space-y-4">
                    {followUpsForDate.map((followUp) => {
                      const StatusIcon = getStatusIcon(followUp.status_follow_up);
                      
                      return (
                        <Card key={followUp.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Building2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">
                                    {followUp.empresas?.nome_empresa_pagina || 
                                     followUp.empresas?.nome_empresa_gmn || 
                                     followUp.empresas?.dominio}
                                  </CardTitle>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Building2 className="h-4 w-4" />
                                    <span>{followUp.empresas?.dominio}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getPriorityColor(followUp.data_prevista_follow_up)}>
                                  {getPriorityLabel(followUp.data_prevista_follow_up)}
                                </Badge>
                                <Badge className={getStatusColor(followUp.status_follow_up)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {getStatusLabel(followUp.status_follow_up)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs font-medium text-gray-600">Contato Utilizado</p>
                                  <p className="text-sm text-gray-900">{followUp.contato_utilizado}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs font-medium text-gray-600">Data Prevista</p>
                                  <p className="text-sm text-gray-900">
                                    {format(new Date(followUp.data_prevista_follow_up), 'dd/MM/yyyy', { locale: ptBR })}
                                  </p>
                                </div>
                              </div>

                              {followUp.tentativas_follow_up && followUp.tentativas_follow_up > 0 && (
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-xs font-medium text-gray-600">Tentativas</p>
                                    <p className="text-sm text-gray-900">{followUp.tentativas_follow_up}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {followUp.detalhes_solicitacao_follow_up && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-gray-600 mb-1">Detalhes da Solicitação:</p>
                                <p className="text-sm text-gray-900">{followUp.detalhes_solicitacao_follow_up}</p>
                              </div>
                            )}

                            {followUp.observacao_interna_follow_up && (
                              <div className="mb-4">
                                <p className="text-xs font-medium text-gray-600 mb-1">Observação Interna:</p>
                                <p className="text-sm text-gray-500 italic">{followUp.observacao_interna_follow_up}</p>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              {followUp.status_follow_up === 'pendente' && (
                                <Button size="sm" variant="outline" className="text-blue-600">
                                  <Play className="h-4 w-4 mr-1" />
                                  Iniciar
                                </Button>
                              )}
                              {followUp.status_follow_up === 'em_progresso' && (
                                <Button size="sm" variant="outline" className="text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Concluir
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Calendar className="h-4 w-4 mr-1" />
                                Reagendar
                              </Button>
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4 mr-1" />
                                Adicionar Nota
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum follow-up encontrado</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "todos" 
                    ? "Nenhum follow-up corresponde aos filtros aplicados." 
                    : "Comece criando sua primeira tarefa de follow-up."
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Tarefa
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FollowUps;
