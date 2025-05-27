
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Layers3, 
  Search, 
  Filter, 
  Building2,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Eye,
  MoreVertical
} from "lucide-react";
import { useEmpresas } from "@/hooks/useEmpresas";
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

const Cadences = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { data: empresas, isLoading, error } = useEmpresas(searchTerm, statusFilter);

  // Agrupar empresas por status de cadência
  const groupedEmpresas = empresas?.reduce((groups, empresa) => {
    const status = empresa.status_cadencia_geral || 'sem_status';
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(empresa);
    return groups;
  }, {} as Record<string, typeof empresas>) || {};

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'apta_para_contato':
        return {
          label: 'Apta para Contato',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: Play,
          description: 'Prontas para iniciar cadência'
        };
      case 'processando_dia_1':
        return {
          label: 'Processando Dia 1',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: RefreshCw,
          description: 'Em primeira tentativa'
        };
      case 'processando_dia_2':
        return {
          label: 'Processando Dia 2',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: RefreshCw,
          description: 'Em segunda tentativa'
        };
      case 'processando_dia_3':
        return {
          label: 'Processando Dia 3',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: RefreshCw,
          description: 'Em terceira tentativa'
        };
      case 'sucesso_contato_realizado':
        return {
          label: 'Sucesso - Contato Realizado',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: Play,
          description: 'Contato bem-sucedido'
        };
      case 'nao_perturbe':
        return {
          label: 'Não Perturbe',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: Pause,
          description: 'Pausadas permanentemente'
        };
      case 'fluxo_concluido_sem_resposta':
        return {
          label: 'Fluxo Concluído Sem Resposta',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          description: 'Cadência finalizada'
        };
      default:
        return {
          label: 'Sem Status',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock,
          description: 'Status não definido'
        };
    }
  };

  const statusOrder = [
    'apta_para_contato',
    'processando_dia_1', 
    'processando_dia_2',
    'processando_dia_3',
    'sucesso_contato_realizado',
    'fluxo_concluido_sem_resposta',
    'nao_perturbe',
    'sem_status'
  ];

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
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
          <p className="text-red-600">Erro ao carregar cadências: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Visualização de Cadências</h2>
          <p className="text-gray-600 mt-1">Kanban das empresas organizadas por status de cadência.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar empresas..."
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
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="apta_para_contato">Apta para Contato</SelectItem>
                <SelectItem value="processando_dia_1">Processando Dia 1</SelectItem>
                <SelectItem value="processando_dia_2">Processando Dia 2</SelectItem>
                <SelectItem value="processando_dia_3">Processando Dia 3</SelectItem>
                <SelectItem value="sucesso_contato_realizado">Sucesso</SelectItem>
                <SelectItem value="nao_perturbe">Não Perturbe</SelectItem>
                <SelectItem value="fluxo_concluido_sem_resposta">Sem Resposta</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {statusOrder.map(status => {
          const empresasStatus = groupedEmpresas[status] || [];
          const config = getStatusConfig(status);
          const IconComponent = config.icon;
          
          return (
            <div key={status} className="flex-none w-80">
              <Card className={`border-2 ${config.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {config.label}
                        </CardTitle>
                        <p className="text-xs opacity-80 mt-1">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/50">
                      {empresasStatus.length}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {empresasStatus.map((empresa) => (
                      <Card key={empresa.id} className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <h4 className="font-medium text-sm text-gray-900 truncate">
                                {empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}
                              </h4>
                            </div>
                            <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-2">
                            {empresa.dominio}
                          </p>

                          <div className="space-y-1 text-xs text-gray-500">
                            {empresa.contador_total_tentativas_cadencia !== null && (
                              <div className="flex items-center justify-between">
                                <span>Tentativas:</span>
                                <span className="font-medium">{empresa.contador_total_tentativas_cadencia}</span>
                              </div>
                            )}
                            
                            {empresa.timestamp_ultima_tentativa_cadencia && (
                              <div className="flex items-center justify-between">
                                <span>Última tentativa:</span>
                                <span className="font-medium">
                                  {format(new Date(empresa.timestamp_ultima_tentativa_cadencia), 'dd/MM', { locale: ptBR })}
                                </span>
                              </div>
                            )}

                            {empresa.timestamp_proxima_tentativa_permitida && (
                              <div className="flex items-center justify-between">
                                <span>Próxima tentativa:</span>
                                <span className="font-medium">
                                  {format(new Date(empresa.timestamp_proxima_tentativa_permitida), 'dd/MM', { locale: ptBR })}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex space-x-1">
                            <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Button>
                            {status === 'apta_para_contato' && (
                              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-green-600">
                                <Play className="h-3 w-3 mr-1" />
                                Iniciar
                              </Button>
                            )}
                            {status.includes('processando') && (
                              <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-orange-600">
                                <Pause className="h-3 w-3 mr-1" />
                                Pausar
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {empresasStatus.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Layers3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma empresa neste status</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo das Cadências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {statusOrder.map(status => {
              const empresasStatus = groupedEmpresas[status] || [];
              const config = getStatusConfig(status);
              
              return (
                <div key={status} className={`p-3 rounded-lg ${config.color}`}>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{empresasStatus.length}</p>
                    <p className="text-xs font-medium">{config.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadences;
