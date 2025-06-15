import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Building2,
  Calendar,
  User,
  ArrowRight,
  Clock
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InteractionDetail } from "@/components/interactions/InteractionDetail";

const InteractionsNew = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [canalFilter, setCanalFilter] = useState("todos");
  const [selectedInteractionId, setSelectedInteractionId] = useState<number | null>(null);

  const { data: interacoes, isLoading, error } = useQuery({
    queryKey: ['interacoes', searchTerm, statusFilter, canalFilter],
    queryFn: async () => {
      console.log('Buscando interações com filtros:', { searchTerm, statusFilter, canalFilter });
      
      let query = supabase
        .from('interacoes')
        .select(`
          *,
          empresas!interacoes_empresa_id_fkey (
            id,
            nome_empresa_pagina,
            nome_empresa_gmn,
            dominio
          )
        `)
        .order('timestamp_criacao', { ascending: false });

      if (statusFilter !== 'todos') {
        query = query.eq('status_interacao', statusFilter);
      }

      if (canalFilter !== 'todos') {
        query = query.eq('canal', canalFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];

      if (searchTerm) {
        filteredData = filteredData.filter(interacao =>
          interacao.empresas?.nome_empresa_pagina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interacao.empresas?.nome_empresa_gmn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interacao.empresas?.dominio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interacao.contato_utilizado?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      console.log('Interações encontradas:', filteredData.length);
      return filteredData;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'finalizada_com_sucesso_agendamento':
        return 'bg-green-100 text-green-800';
      case 'enviada_sem_resposta':
        return 'bg-yellow-100 text-yellow-800';
      case 'opt_out':
        return 'bg-red-100 text-red-800';
      case 'falhou_envio':
        return 'bg-red-100 text-red-800';
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
      case 'telefone':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedInteractionId) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <InteractionDetail 
          interactionId={selectedInteractionId} 
          onBack={() => setSelectedInteractionId(null)} 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Interações</h2>
          <p className="text-gray-600 mt-1">Acompanhe todas as conversas e interações com os leads.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Interação
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar Interações</CardTitle>
          <CardDescription>Encontre interações por empresa, status ou canal</CardDescription>
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="finalizada_com_sucesso_agendamento">Sucesso</SelectItem>
                <SelectItem value="enviada_sem_resposta">Sem Resposta</SelectItem>
                <SelectItem value="opt_out">Opt-out</SelectItem>
                <SelectItem value="falhou_envio">Falha no Envio</SelectItem>
              </SelectContent>
            </Select>
            <Select value={canalFilter} onValueChange={setCanalFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="telefone">Telefone</SelectItem>
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
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Interações ({interacoes?.length || 0})
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <p className="text-red-600">Erro ao carregar interações: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        ) : interacoes && interacoes.length > 0 ? (
          <div className="space-y-4">
            {interacoes.map((interacao) => (
              <Card key={interacao.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedInteractionId(interacao.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {interacao.empresas?.nome_empresa_pagina || 
                           interacao.empresas?.nome_empresa_gmn || 
                           interacao.empresas?.dominio}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>{interacao.empresas?.dominio}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCanalColor(interacao.canal)}>
                        {interacao.canal}
                      </Badge>
                      <Badge className={getStatusColor(interacao.status_interacao)}>
                        {interacao.status_interacao}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Data de Criação</p>
                        <p className="text-sm text-gray-900">
                          {format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    {interacao.timestamp_fim && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium text-gray-600">Finalizada em</p>
                          <p className="text-sm text-gray-900">
                            {format(new Date(interacao.timestamp_fim), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Contato</p>
                        <p className="text-sm text-gray-900">{interacao.contato_utilizado || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {interacao.log_resumido_ia && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-1">Resumo:</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{interacao.log_resumido_ia}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {interacao.custo_estimado && (
                        <span>Custo: R$ {Number(interacao.custo_estimado).toFixed(4)}</span>
                      )}
                      {interacao.agente_ia_usado && (
                        <span>• Agente: {interacao.agente_ia_usado}</span>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma interação encontrada</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "todos" || canalFilter !== "todos"
                    ? "Nenhuma interação corresponde aos filtros aplicados." 
                    : "Comece criando sua primeira interação."
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Interação
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InteractionsNew;
