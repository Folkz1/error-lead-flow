
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter, TrendingUp, Users, MessageSquare, Target, Link as LinkIcon } from "lucide-react";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { TemplatePerformance } from "@/components/analytics/TemplatePerformance";
import { IAEfficiency } from "@/components/analytics/IAEfficiency";
import { AgendamentosChart } from "@/components/analytics/AgendamentosChart";
import { FollowUpsChart } from "@/components/analytics/FollowUpsChart";
import { ChannelPerformance } from "@/components/analytics/ChannelPerformance";
import { LinkEngagement } from "@/components/analytics/LinkEngagement";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLinkEngagement } from "@/hooks/useLinkEngagement";

const Analytics = () => {
  const [filters, setFilters] = useState({
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    canal: 'todos',
    tipoErro: 'todos',
    etapaCadencia: undefined as number | undefined,
    templateId: undefined as number | undefined,
  });

  const [linkFilters, setLinkFilters] = useState({
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    linkType: 'todos',
    empresaId: undefined as number | undefined,
  });

  const { data: analyticsData, isLoading, error } = useAnalytics(filters);
  const { data: linkData, isLoading: isLoadingLinks, error: linkError } = useLinkEngagement(linkFilters);

  if (isLoading || isLoadingLinks) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center">Carregando analytics...</div>
      </div>
    );
  }

  if (error || linkError) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center text-red-600">Erro ao carregar analytics: {(error || linkError)?.message}</div>
      </div>
    );
  }

  const {
    funnelData,
    channelPerformance,
    templatePerformance,
    iaStats,
    agendamentosStatus,
    followUpsStats,
    totalEmpresas,
    totalInteracoes,
    totalAgendamentos,
    totalFollowUps
  } = analyticsData || {};

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Analytics & Relatórios</h2>
          <p className="text-gray-600 mt-1">Análise completa do desempenho das cadências e resultados.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros Globais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Canal</label>
              <Select value={filters.canal} onValueChange={(value) => setFilters({...filters, canal: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Canais</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Erro</label>
              <Select value={filters.tipoErro} onValueChange={(value) => setFilters({...filters, tipoErro: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de erro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="404">404 - Página não encontrada</SelectItem>
                  <SelectItem value="500">500 - Erro interno</SelectItem>
                  <SelectItem value="timeout">Timeout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Etapa da Cadência</label>
              <Select value={filters.etapaCadencia?.toString()} onValueChange={(value) => setFilters({...filters, etapaCadencia: value ? parseInt(value) : undefined})}>
                <SelectTrigger>
                  <SelectValue placeholder="Etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dia 1</SelectItem>
                  <SelectItem value="2">Dia 2</SelectItem>
                  <SelectItem value="3">Dia 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setFilters({
                  startDate: undefined,
                  endDate: undefined,
                  canal: 'todos',
                  tipoErro: 'todos',
                  etapaCadencia: undefined,
                  templateId: undefined,
                })}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Empresas</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalEmpresas}</div>
            <p className="text-xs text-gray-600">empresas cadastradas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Interações Totais</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalInteracoes}</div>
            <p className="text-xs text-gray-600">conversas iniciadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Agendamentos</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalAgendamentos}</div>
            <p className="text-xs text-gray-600">reuniões marcadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalInteracoes > 0 ? Math.round((totalAgendamentos / totalInteracoes) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600">interações → agendamentos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com diferentes análises */}
      <Tabs defaultValue="funil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="funil">Funil</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ia">IA</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
          <TabsTrigger value="canais">Canais</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="funil">
          <FunnelChart data={funnelData} />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatePerformance data={templatePerformance} />
        </TabsContent>

        <TabsContent value="ia">
          <IAEfficiency data={iaStats} />
        </TabsContent>

        <TabsContent value="agendamentos">
          <AgendamentosChart data={agendamentosStatus} />
        </TabsContent>

        <TabsContent value="followups">
          <FollowUpsChart data={followUpsStats} />
        </TabsContent>

        <TabsContent value="canais">
          <ChannelPerformance data={channelPerformance} />
        </TabsContent>

        <TabsContent value="links">
          <div className="space-y-6">
            {/* Filtros específicos para links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Filtros de Engajamento com Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Link</label>
                    <Select value={linkFilters.linkType} onValueChange={(value) => setLinkFilters({...linkFilters, linkType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Links</SelectItem>
                        <SelectItem value="agendamento">Agendamento</SelectItem>
                        <SelectItem value="site">Site</SelectItem>
                        <SelectItem value="social">Redes Sociais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Período</label>
                    <Select value="30dias" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                        <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                        <SelectItem value="customizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLinkFilters({
                        startDate: undefined,
                        endDate: undefined,
                        linkType: 'todos',
                        empresaId: undefined,
                      })}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {linkData && <LinkEngagement data={linkData} />}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
