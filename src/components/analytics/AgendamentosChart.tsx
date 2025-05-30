
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

interface AgendamentosChartProps {
  data?: Record<string, number>;
}

const STATUS_CONFIG = {
  confirmado: { label: 'Confirmado', color: '#10b981', icon: CheckCircle },
  solicitado: { label: 'Solicitado', color: '#3b82f6', icon: Clock },
  agendado: { label: 'Agendado', color: '#8b5cf6', icon: Calendar },
  realizado: { label: 'Realizado', color: '#059669', icon: CheckCircle },
  cancelado: { label: 'Cancelado', color: '#ef4444', icon: XCircle },
  pendente_lembrete_24h: { label: 'Pendente Lembrete', color: '#f59e0b', icon: Clock }
};

export const AgendamentosChart = ({ data = {} }: AgendamentosChartProps) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status,
    value: count,
    color: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color || '#6b7280'
  })).filter(item => item.value > 0);

  const total = Object.values(data).reduce((acc, val) => acc + val, 0);
  const realizados = data.realizado || 0;
  const cancelados = data.cancelado || 0;
  const taxaRealizacao = total > 0 ? Math.round((realizados / total) * 100) : 0;
  const taxaCancelamento = total > 0 ? Math.round((cancelados / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Análise de Agendamentos
        </CardTitle>
        <p className="text-sm text-gray-600">
          Acompanhe o status e performance dos agendamentos realizados
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total Agendamentos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{realizados}</div>
              <div className="text-sm text-gray-600">Realizados</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">{taxaRealizacao}%</div>
              <div className="text-sm text-gray-600">Taxa de Realização</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <XCircle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-gray-900">{taxaCancelamento}%</div>
              <div className="text-sm text-gray-600">Taxa de Cancelamento</div>
            </div>
          </div>

          {total === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum agendamento encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4">Distribuição por Status</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Lista Detalhada */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4">Detalhes por Status</h5>
                <div className="space-y-3">
                  {Object.entries(data).map(([status, count]) => {
                    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                    const Icon = config?.icon || Clock;
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    
                    return (
                      <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" style={{ color: config?.color || '#6b7280' }} />
                          <span className="text-sm font-medium">{config?.label || status}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{count}</div>
                          <div className="text-xs text-gray-600">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h5 className="font-semibold text-purple-900 mb-2">📊 Insights dos Agendamentos</h5>
            <div className="space-y-1 text-sm text-purple-800">
              <p>• {total} agendamentos processados no período selecionado</p>
              <p>• Taxa de realização de {taxaRealizacao}% - {taxaRealizacao >= 80 ? 'Excelente performance!' : taxaRealizacao >= 60 ? 'Boa taxa de conversão' : 'Há oportunidades de melhoria'}</p>
              <p>• Taxa de cancelamento em {taxaCancelamento}% - {taxaCancelamento <= 15 ? 'Dentro do esperado' : 'Considere estratégias de retenção'}</p>
              {data.pendente_lembrete_24h > 0 && <p>• {data.pendente_lembrete_24h} agendamentos precisam de lembrete</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
