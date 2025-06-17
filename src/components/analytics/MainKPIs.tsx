
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Target, Activity } from "lucide-react";

interface MainKPIsProps {
  periodFilter: string;
}

export const MainKPIs = ({ periodFilter }: MainKPIsProps) => {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['main-kpis', periodFilter],
    queryFn: async () => {
      console.log('Buscando KPIs principais com período:', periodFilter);
      
      // Calcular filtro de data baseado no período
      let dateFilter = '';
      if (periodFilter !== 'desde_inicio') {
        const days = periodFilter === '7dias' ? 7 : periodFilter === '30dias' ? 30 : 90;
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - days);
        dateFilter = pastDate.toISOString();
      }

      // 1. Leads Gerados (Sucesso)
      let leadsQuery = supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .in('status_cadencia_geral', [
          'sucesso_contato_realizado',
          'atendimento_humano_solicitado_wa',
          'followup_manual_agendado_wa'
        ]);

      if (dateFilter) {
        leadsQuery = leadsQuery.gte('data_ultima_atualizacao', dateFilter);
      }

      const { count: leadsGerados } = await leadsQuery;

      // 2. Total de Cadências Iniciadas
      let cadenciasQuery = supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .not('status_cadencia_geral', 'in', '(null,"apta_para_nova_cadencia")');

      if (dateFilter) {
        cadenciasQuery = cadenciasQuery.gte('data_ultima_atualizacao', dateFilter);
      }

      const { count: totalCadenciasIniciadas } = await cadenciasQuery;

      // 3. Empresas em Cadência Ativa
      const { count: empresasAtivas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .in('status_cadencia_geral', [
          'cadencia_dia1_ativa',
          'cadencia_dia2_ativa',
          'cadencia_dia3_ativa',
          'aguardando_reforco1_dia1',
          'aguardando_reforco2_dia1',
          'aguardando_reforco1_dia2',
          'aguardando_reforco2_dia2'
        ]);

      // 4. Taxa de Conversão
      const taxaConversao = totalCadenciasIniciadas && totalCadenciasIniciadas > 0 
        ? Math.round((leadsGerados || 0) / totalCadenciasIniciadas * 100) 
        : 0;

      console.log('KPIs calculados:', {
        leadsGerados,
        totalCadenciasIniciadas,
        empresasAtivas,
        taxaConversao
      });

      return {
        leadsGerados: leadsGerados || 0,
        totalCadenciasIniciadas: totalCadenciasIniciadas || 0,
        empresasAtivas: empresasAtivas || 0,
        taxaConversao,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Leads Gerados (Sucesso)</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis?.leadsGerados}</div>
            <p className="text-xs text-gray-600">empresas convertidas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis?.taxaConversao}%</div>
            <p className="text-xs text-gray-600">eficiência geral do funil</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cadências Iniciadas</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis?.totalCadenciasIniciadas}</div>
            <p className="text-xs text-gray-600">empresas no fluxo</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cadências Ativas</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{kpis?.empresasAtivas}</div>
            <p className="text-xs text-gray-600">sendo contatadas agora</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
