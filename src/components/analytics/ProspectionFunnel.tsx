
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FunnelChart, Funnel, LabelList, ResponsiveContainer } from "recharts";

interface ProspectionFunnelProps {
  periodFilter: string;
}

export const ProspectionFunnel = ({ periodFilter }: ProspectionFunnelProps) => {
  const { data: funnelData, isLoading } = useQuery({
    queryKey: ['prospection-funnel', periodFilter],
    queryFn: async () => {
      console.log('Buscando dados do funil de prospecção');
      
      // Estágio 1: Aptas para Cadência
      const { count: aptasParaCadencia } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('status_cadencia_geral', 'apta_para_nova_cadencia');

      // Estágio 2: Cadência Dia 1 (empresas que passaram por este estágio)
      const { count: cadenciaDia1 } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .in('status_cadencia_geral', [
          'cadencia_dia1_ativa',
          'aguardando_reforco1_dia1',
          'aguardando_reforco2_dia1',
          'dia1_concluido_aguardando_dia2',
          'cadencia_dia2_ativa',
          'aguardando_reforco1_dia2',
          'aguardando_reforco2_dia2',
          'dia2_concluido_aguardando_dia3',
          'cadencia_dia3_ativa',
          'dia3_concluido_aguardando_finalizacao',
          'interagindo_wa',
          'atendimento_humano_solicitado_wa',
          'followup_manual_agendado_wa',
          'sucesso_contato_realizado',
          'fluxo_concluido_sem_resposta',
          'falha_max_cadencias_atingida'
        ]);

      // Estágio 3: Interagindo
      const { count: interagindo } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .in('status_cadencia_geral', [
          'interagindo_wa',
          'atendimento_humano_solicitado_wa',
          'followup_manual_agendado_wa',
          'sucesso_contato_realizado'
        ]);

      // Estágio 4: Atendimento Humano / Sucesso
      const { count: sucessoAtendimento } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .in('status_cadencia_geral', [
          'atendimento_humano_solicitado_wa',
          'sucesso_contato_realizado'
        ]);

      // Calcular taxas de passagem
      const taxaAptasParaDia1 = aptasParaCadencia && aptasParaCadencia > 0 
        ? Math.round((cadenciaDia1 || 0) / (aptasParaCadencia + cadenciaDia1) * 100)
        : 0;

      const taxaDia1ParaInteracao = cadenciaDia1 && cadenciaDia1 > 0 
        ? Math.round((interagindo || 0) / cadenciaDia1 * 100)
        : 0;

      const taxaInteracaoParaSucesso = interagindo && interagindo > 0 
        ? Math.round((sucessoAtendimento || 0) / interagindo * 100)
        : 0;

      const funnelData = [
        {
          name: "Aptas para Cadência",
          value: aptasParaCadencia || 0,
          fill: "#8884d8"
        },
        {
          name: "Cadência Dia 1",
          value: cadenciaDia1 || 0,
          fill: "#82ca9d"
        },
        {
          name: "Interagindo",
          value: interagindo || 0,
          fill: "#ffc658"
        },
        {
          name: "Sucesso/Atendimento",
          value: sucessoAtendimento || 0,
          fill: "#ff7300"
        }
      ];

      return {
        funnelData,
        taxas: {
          taxaAptasParaDia1,
          taxaDia1ParaInteracao,
          taxaInteracaoParaSucesso
        }
      };
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funil de Prospecção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    value: {
      label: "Empresas",
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Funil de Prospecção - Análise de Estágios</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Funnel
                  dataKey="value"
                  data={funnelData?.funnelData}
                  isAnimationActive
                >
                  <LabelList position="center" fill="#fff" stroke="none" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Taxas de Passagem */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa: Aptas → Dia 1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnelData?.taxas.taxaAptasParaDia1}%</div>
            <p className="text-xs text-gray-600">conversão para cadência</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa: Dia 1 → Interação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnelData?.taxas.taxaDia1ParaInteracao}%</div>
            <p className="text-xs text-gray-600">geram resposta</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa: Interação → Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{funnelData?.taxas.taxaInteracaoParaSucesso}%</div>
            <p className="text-xs text-gray-600">viram leads</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
