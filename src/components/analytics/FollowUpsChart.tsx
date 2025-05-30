
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckSquare, Clock, AlertCircle, RotateCcw } from "lucide-react";

interface FollowUpsChartProps {
  data?: Record<string, number>;
}

const STATUS_CONFIG = {
  pendente: { label: 'Pendente', color: '#f59e0b', icon: Clock },
  concluido: { label: 'Concluído', color: '#10b981', icon: CheckSquare },
  cancelado: { label: 'Cancelado', color: '#ef4444', icon: AlertCircle },
  reagendado: { label: 'Reagendado', color: '#8b5cf6', icon: RotateCcw }
};

export const FollowUpsChart = ({ data = {} }: FollowUpsChartProps) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.label || status,
    value: count,
    color: STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.color || '#6b7280'
  }));

  const total = Object.values(data).reduce((acc, val) => acc + val, 0);
  const concluidos = data.concluido || 0;
  const pendentes = data.pendente || 0;
  const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Análise de Follow-ups
        </CardTitle>
        <p className="text-sm text-gray-600">
          Acompanhe o status e efetividade das tarefas de follow-up
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total Follow-ups</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckSquare className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{concluidos}</div>
              <div className="text-sm text-gray-600">Concluídos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold text-gray-900">{pendentes}</div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">{taxaConclusao}%</div>
              <div className="text-sm text-gray-600">Taxa de Conclusão</div>
            </div>
          </div>

          {total === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum follow-up encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Barras */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4">Distribuição por Status</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Bar key={`bar-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
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

                {/* Ações Recomendadas */}
                {pendentes > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h6 className="font-semibold text-yellow-900 text-sm mb-1">⚠️ Ação Necessária</h6>
                    <p className="text-yellow-800 text-xs">
                      {pendentes} follow-ups pendentes precisam de atenção
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="font-semibold text-green-900 mb-2">🎯 Insights dos Follow-ups</h5>
            <div className="space-y-1 text-sm text-green-800">
              <p>• {total} follow-ups criados no período selecionado</p>
              <p>• Taxa de conclusão de {taxaConclusao}% - {taxaConclusao >= 80 ? 'Excelente disciplina!' : taxaConclusao >= 60 ? 'Boa execução' : 'Melhore a consistência'}</p>
              <p>• {pendentes} tarefas ainda pendentes precisam de atenção</p>
              {data.reagendado > 0 && <p>• {data.reagendado} follow-ups foram reagendados - acompanhe prazos</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
