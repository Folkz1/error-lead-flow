
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FunnelData {
  name: string;
  value: number;
  percentage: number;
}

interface FunnelChartProps {
  data?: FunnelData[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const FunnelChart = ({ data = [] }: FunnelChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <p className="text-sm text-gray-600">
          Acompanhe o fluxo completo desde empresas cadastradas até agendamentos confirmados
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de barras */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" width={120} stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela com detalhes */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Detalhes do Funil</h4>
            <div className="space-y-3">
              {data.map((item, index) => (
                <div 
                  key={item.name} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-900 mb-2">💡 Insights</h5>
          <div className="space-y-1 text-sm text-blue-800">
            <p>• Taxa de conversão geral: {data.length > 0 && data[0].value > 0 ? Math.round((data[data.length - 1]?.value || 0) / data[0].value * 100) : 0}%</p>
            <p>• Maior perda no funil: {data.length > 1 ? `${data[0]?.name} → ${data[1]?.name}` : '-'}</p>
            <p>• Potencial de melhoria identificado nas etapas intermediárias</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
