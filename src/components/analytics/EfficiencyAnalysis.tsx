
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EfficiencyAnalysisProps {
  periodFilter: string;
}

export const EfficiencyAnalysis = ({ periodFilter }: EfficiencyAnalysisProps) => {
  const { data: analysisData, isLoading } = useQuery({
    queryKey: ['efficiency-analysis', periodFilter],
    queryFn: async () => {
      console.log('Buscando análise de eficácia');
      
      // 1. Análise de Respostas por Intenção (simulando dados - ajustar quando tabela interacoes tiver coluna intencao)
      const intentionData = [
        { name: "Interesse Positivo", value: 25, fill: "#10B981" },
        { name: "Não Perturbe", value: 40, fill: "#EF4444" },
        { name: "Pediu Mais Info", value: 20, fill: "#3B82F6" },
        { name: "Sem Resposta", value: 15, fill: "#6B7280" }
      ];

      // 2. Performance por Tipo de Erro (usando eventos_erro)
      const { data: errorTypes } = await supabase
        .from('eventos_erro')
        .select('tipo_erro_site, empresa_id')
        .not('tipo_erro_site', 'is', null);

      // Agrupar por tipo de erro e calcular conversões
      const errorPerformance = errorTypes?.reduce((acc: any[], error) => {
        const existing = acc.find(item => item.tipo === error.tipo_erro_site);
        if (existing) {
          existing.total += 1;
        } else {
          acc.push({
            tipo: error.tipo_erro_site,
            total: 1,
            conversoes: Math.floor(Math.random() * 10), // Simular conversões
            taxaConversao: Math.floor(Math.random() * 30)
          });
        }
        return acc;
      }, []) || [];

      // 3. Performance dos Templates (simulando dados - ajustar quando houver tabela eventos_de_contato)
      const templatePerformance = [
        {
          id: 1,
          texto: "Olá! Notei que vocês têm um site interessante...",
          taxaResposta: 35,
          taxaConversao: 12
        },
        {
          id: 2,
          texto: "Oi! Sou especialista em marketing digital...",
          taxaResposta: 28,
          taxaConversao: 8
        },
        {
          id: 3,
          texto: "Bom dia! Gostaria de falar sobre automação...",
          taxaResposta: 42,
          taxaConversao: 15
        },
        {
          id: 4,
          texto: "Olá! Vi que vocês trabalham com...",
          taxaResposta: 31,
          taxaConversao: 10
        }
      ];

      return {
        intentionData,
        errorPerformance: errorPerformance.slice(0, 10), // Top 10
        templatePerformance
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const chartConfig = {
    value: { label: "Respostas" },
    taxaConversao: { label: "Taxa de Conversão %" }
  };

  return (
    <div className="space-y-6">
      {/* Análise de Respostas por Intenção */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Respostas por Intenção</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={analysisData?.intentionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analysisData?.intentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance por Tipo de Erro */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Tipo de Erro do Site</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisData?.errorPerformance}>
                <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="taxaConversao" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance dos Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Templates de Mensagem</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Texto do Template</TableHead>
                <TableHead>Taxa de Resposta (%)</TableHead>
                <TableHead>Taxa de Conversão (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisData?.templatePerformance.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{template.texto}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${template.taxaResposta > 35 ? 'text-green-600' : template.taxaResposta > 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {template.taxaResposta}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${template.taxaConversao > 12 ? 'text-green-600' : template.taxaConversao > 8 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {template.taxaConversao}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
