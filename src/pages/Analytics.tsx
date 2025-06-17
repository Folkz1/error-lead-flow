
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter, TrendingUp, Users, MessageSquare, Target, Activity } from "lucide-react";
import { MainKPIs } from "@/components/analytics/MainKPIs";
import { ProspectionFunnel } from "@/components/analytics/ProspectionFunnel";
import { EfficiencyAnalysis } from "@/components/analytics/EfficiencyAnalysis";
import { RecentActivity } from "@/components/analytics/RecentActivity";

const Analytics = () => {
  const [periodFilter, setPeriodFilter] = useState("30dias");

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Analytics - Projeto Erik</h2>
          <p className="text-gray-600 mt-1">Análise completa do desempenho das cadências e resultados de prospecção.</p>
        </div>
        <div className="flex gap-2">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              <SelectItem value="desde_inicio">Desde o início</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Tabs com diferentes seções */}
      <Tabs defaultValue="kpis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kpis" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>KPIs Principais</span>
          </TabsTrigger>
          <TabsTrigger value="funil" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Funil de Prospecção</span>
          </TabsTrigger>
          <TabsTrigger value="eficacia" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Análise de Eficácia</span>
          </TabsTrigger>
          <TabsTrigger value="atividade" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Atividade Recente</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kpis">
          <MainKPIs periodFilter={periodFilter} />
        </TabsContent>

        <TabsContent value="funil">
          <ProspectionFunnel periodFilter={periodFilter} />
        </TabsContent>

        <TabsContent value="eficacia">
          <EfficiencyAnalysis periodFilter={periodFilter} />
        </TabsContent>

        <TabsContent value="atividade">
          <RecentActivity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
