
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link as LinkIcon, 
  ExternalLink, 
  TrendingUp,
  Calendar,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LinkEngagementProps {
  data: {
    totalClicks: number;
    uniqueLinks: number;
    dailyData: Array<{ date: string; clicks: number }>;
    linkMetrics: Array<{
      id: number;
      descricao: string;
      identificador: string;
      urlDestino: string;
      totalCliques: number;
      dataUltimoClique: string;
      dataPrimeiroClique: string;
    }>;
  };
}

export const LinkEngagement = ({ data }: LinkEngagementProps) => {
  const { totalClicks, uniqueLinks, dailyData, linkMetrics } = data;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
            <LinkIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">últimos 30 dias</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Links Únicos</CardTitle>
            <ExternalLink className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueLinks}</div>
            <p className="text-xs text-muted-foreground">diferentes links clicados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyData.length > 0 ? Math.round(totalClicks / dailyData.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">cliques por dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Cliques por Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Cliques por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#888"
                tickFormatter={(value) => format(new Date(value), 'dd/MM')}
              />
              <YAxis stroke="#888" />
              <Tooltip 
                labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                formatter={(value) => [value, 'Cliques']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Links */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {linkMetrics.length > 0 ? (
              linkMetrics
                .sort((a, b) => b.totalCliques - a.totalCliques)
                .map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <LinkIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{link.descricao}</h3>
                          <p className="text-sm text-gray-600">{link.identificador}</p>
                          {link.urlDestino && (
                            <p className="text-xs text-gray-500 mt-1">{link.urlDestino}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{link.totalCliques}</div>
                        <p className="text-xs text-gray-500">cliques</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Último clique:</p>
                        <p className="text-xs text-gray-500">
                          {link.dataUltimoClique && 
                            format(new Date(link.dataUltimoClique), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                          }
                        </p>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <LinkIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum clique registrado</h3>
                <p className="text-gray-600">
                  Os cliques em links aparecerão aqui conforme forem registrados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
