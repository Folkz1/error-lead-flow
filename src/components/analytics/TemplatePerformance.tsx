
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TemplateData {
  id: number;
  nome: string;
  canal: string;
  envios: number;
  respostas: number;
  agendamentos: number;
  taxaConversao: number;
}

interface TemplatePerformanceProps {
  data?: TemplateData[];
}

export const TemplatePerformance = ({ data = [] }: TemplatePerformanceProps) => {
  const sortedData = data.sort((a, b) => b.taxaConversao - a.taxaConversao);

  const getPerformanceIcon = (taxa: number) => {
    if (taxa >= 20) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (taxa >= 10) return <Minus className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getPerformanceBadge = (taxa: number) => {
    if (taxa >= 20) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (taxa >= 10) return <Badge className="bg-yellow-100 text-yellow-800">Bom</Badge>;
    return <Badge className="bg-red-100 text-red-800">Precisa Melhorar</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance dos Templates</CardTitle>
        <p className="text-sm text-gray-600">
          Análise detalhada do desempenho de cada template de mensagem
        </p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum template encontrado com os filtros aplicados
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{data.length}</div>
                <div className="text-sm text-gray-600">Templates Ativos</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {data.reduce((acc, t) => acc + t.envios, 0)}
                </div>
                <div className="text-sm text-gray-600">Total de Envios</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {data.length > 0 ? Math.round(data.reduce((acc, t) => acc + t.taxaConversao, 0) / data.length) : 0}%
                </div>
                <div className="text-sm text-gray-600">Taxa Média</div>
              </div>
            </div>

            {/* Tabela */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead className="text-center">Envios</TableHead>
                  <TableHead className="text-center">Respostas</TableHead>
                  <TableHead className="text-center">Agendamentos</TableHead>
                  <TableHead className="text-center">Taxa de Conversão</TableHead>
                  <TableHead className="text-center">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {template.canal.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{template.envios}</TableCell>
                    <TableCell className="text-center">{template.respostas}</TableCell>
                    <TableCell className="text-center">{template.agendamentos}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getPerformanceIcon(template.taxaConversao)}
                        <span className="font-semibold">{template.taxaConversao}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getPerformanceBadge(template.taxaConversao)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Top 3 */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h5 className="font-semibold text-green-900 mb-3">🏆 Top 3 Templates</h5>
              <div className="space-y-2">
                {sortedData.slice(0, 3).map((template, index) => (
                  <div key={template.id} className="flex items-center justify-between text-sm">
                    <span className="text-green-800">
                      #{index + 1} {template.nome} ({template.canal})
                    </span>
                    <span className="font-semibold text-green-900">{template.taxaConversao}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
