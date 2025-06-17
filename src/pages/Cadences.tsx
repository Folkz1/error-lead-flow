
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/cadencias/KanbanBoard";
import { EmpresaDetalhes } from "@/components/cadencias/EmpresaDetalhes";
import { CadenceRules } from "@/components/cadencias/CadenceRules";
import { useCadenceStats } from "@/hooks/useCadenceStats";
import { Search, Filter, RefreshCw, Settings, BarChart3, Zap, Layout } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const Cadences = () => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'principal' | 'atividade'>('principal');
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useCadenceStats();
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    console.log('Atualizando dados de cadências...');
    refetchStats();
    queryClient.invalidateQueries({ queryKey: ['kanban-empresas'] });
    // Usando função global temporariamente para refetch do kanban
    if ((window as any).refetchKanban) {
      (window as any).refetchKanban();
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Cadências</h1>
          <p className="text-muted-foreground">
            Gerencie cadências, regras e acompanhe o pipeline de prospecção
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pipeline" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Regras</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Análises</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          {/* View Mode Selector */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar empresa por domínio ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant={viewMode === 'principal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('principal')}
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Visão Principal
                  </Button>
                  <Button
                    variant={viewMode === 'atividade' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('atividade')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Atividade do Dia
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas - apenas para visão principal */}
          {viewMode === 'principal' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total em Cadência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stats?.totalEmCadencia || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">empresas ativas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interações Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stats?.interacoesHoje || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">mensagens enviadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      stats?.agendamentos || 0
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">reuniões marcadas</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      `${stats?.taxaSucesso || 0}%`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">conversão geral</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Kanban Board */}
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === 'principal' ? 'Pipeline de Cadências (Funil)' : 'Atividade do Dia ⚡'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <KanbanBoard 
                onEmpresaClick={setEmpresaSelecionada} 
                searchTerm={searchTerm}
                viewMode={viewMode}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <CadenceRules />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Análises avançadas serão implementadas na Fase 4</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes da Empresa */}
      {empresaSelecionada && (
        <EmpresaDetalhes
          empresaId={empresaSelecionada}
          onClose={() => setEmpresaSelecionada(null)}
        />
      )}
    </div>
  );
};

export default Cadences;
