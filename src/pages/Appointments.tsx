
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useAgendamentos } from "@/hooks/useAgendamentos";
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

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { data: agendamentos, isLoading, error } = useAgendamentos();

  const filteredAgendamentos = agendamentos?.filter(agendamento => {
    const matchesSearch = agendamento.empresas?.nome_empresa_pagina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.empresas?.nome_empresa_gmn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.empresas?.dominio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || agendamento.status_agendamento === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'realizado':
        return 'bg-blue-100 text-blue-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmado':
        return CheckCircle;
      case 'realizado':
        return CheckCircle;
      case 'cancelado':
        return XCircle;
      case 'pendente':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'realizado':
        return 'Realizado';
      case 'cancelado':
        return 'Cancelado';
      case 'pendente':
        return 'Pendente';
      default:
        return status || 'N/A';
    }
  };

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
          <p className="text-red-600">Erro ao carregar agendamentos: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Agendamentos</h2>
          <p className="text-gray-600 mt-1">Gerencie todos os agendamentos e reuniões com leads.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar Agendamentos</CardTitle>
          <CardDescription>Encontre agendamentos por empresa ou status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por empresa..."
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
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="realizado">Realizado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Agendamentos ({filteredAgendamentos?.length || 0})
          </h3>
        </div>

        {filteredAgendamentos && filteredAgendamentos.length > 0 ? (
          <div className="space-y-4">
            {filteredAgendamentos.map((agendamento) => {
              const StatusIcon = getStatusIcon(agendamento.status_agendamento || '');
              
              return (
                <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {agendamento.empresas?.nome_empresa_pagina || 
                             agendamento.empresas?.nome_empresa_gmn || 
                             agendamento.empresas?.dominio}
                          </CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Building2 className="h-4 w-4" />
                            <span>{agendamento.empresas?.dominio}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(agendamento.status_agendamento || '')}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusLabel(agendamento.status_agendamento || '')}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium text-gray-600">Data do Agendamento</p>
                          <p className="text-sm text-gray-900">
                            {format(new Date(agendamento.timestamp_agendamento), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>

                      {agendamento.start_time && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Horário</p>
                            <p className="text-sm text-gray-900">
                              {format(new Date(agendamento.start_time), 'HH:mm', { locale: ptBR })}
                              {agendamento.end_time && (
                                ` - ${format(new Date(agendamento.end_time), 'HH:mm', { locale: ptBR })}`
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {agendamento.agendado_por && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-600">Agendado por</p>
                            <p className="text-sm text-gray-900">{agendamento.agendado_por}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {agendamento.summary_gcal && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 mb-1">Resumo:</p>
                        <p className="text-sm text-gray-900">{agendamento.summary_gcal}</p>
                      </div>
                    )}

                    {agendamento.description_gcal && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 mb-1">Descrição:</p>
                        <p className="text-sm text-gray-900">{agendamento.description_gcal}</p>
                      </div>
                    )}

                    {agendamento.notas_agendamento && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 mb-1">Notas:</p>
                        <p className="text-sm text-gray-900">{agendamento.notas_agendamento}</p>
                      </div>
                    )}

                    {agendamento.link_evento_calendar && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 mb-1">Link do Evento:</p>
                        <a 
                          href={agendamento.link_evento_calendar} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Ver no Google Calendar
                        </a>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        <Clock className="h-4 w-4 mr-1" />
                        Reagendar
                      </Button>
                      {agendamento.status_agendamento === 'confirmado' && (
                        <Button size="sm" variant="outline" className="text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como Realizado
                        </Button>
                      )}
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
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "todos" 
                    ? "Nenhum agendamento corresponde aos filtros aplicados." 
                    : "Comece criando seu primeiro agendamento."
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Agendamento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Appointments;
