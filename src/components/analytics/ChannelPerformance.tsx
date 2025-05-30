
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MessageSquare, Phone, Mail, Target } from "lucide-react";

interface ChannelData {
  total: number;
  sucesso: number;
  agendamentos: number;
}

interface ChannelPerformanceProps {
  data?: Record<string, ChannelData>;
}

const CHANNEL_CONFIG = {
  whatsapp: { label: 'WhatsApp', color: '#10b981', icon: MessageSquare },
  email: { label: 'E-mail', color: '#3b82f6', icon: Mail },
  telefone: { label: 'Telefone', color: '#f59e0b', icon: Phone }
};

export const ChannelPerformance = ({ data = {} }: ChannelPerformanceProps) => {
  const chartData = Object.entries(data).map(([channel, stats]) => ({
    name: CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG]?.label || channel,
    total: stats.total,
    sucesso: stats.sucesso,
    agendamentos: stats.agendamentos,
    taxaSucesso: stats.total > 0 ? Math.round((stats.sucesso / stats.total) * 100) : 0,
    taxaAgendamento: stats.total > 0 ? Math.round((stats.agendamentos / stats.total) * 100) : 0,
    color: CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG]?.color || '#6b7280'
  }));

  const totalGeral = Object.values(data).reduce((acc, stats) => acc + stats.total, 0);
  const sucessoGeral = Object.values(data).reduce((acc, stats) => acc + stats.sucesso, 0);
  const agendamentosGeral = Object.values(data).reduce((acc, stats) => acc + stats.agendamentos, 0);

  const pieData = chartData.map(item => ({
    name: item.name,
    value: item.total,
    color: item.color
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Performance por Canal
        </CardTitle>
        <p className="text-sm text-gray-600">
          Compare o desempenho entre diferentes canais de comunicação
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* KPIs Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{totalGeral}</div>
              <div className="text-sm text-gray-600">Total Interações</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{sucessoGeral}</div>
              <div className="text-sm text-gray-600">Com Resposta</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Phone className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">{agendamentosGeral}</div>
              <div className="text-sm text-gray-600">Agendamentos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Mail className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">
                {totalGeral > 0 ? Math.round((sucessoGeral / totalGeral) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Taxa Geral</div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum dado de canal encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Comparação */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4">Comparação de Performance</h5>
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
                    <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                    <Bar dataKey="sucesso" fill="#10b981" name="Sucesso" />
                    <Bar dataKey="agendamentos" fill="#3b82f6" name="Agendamentos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Distribuição */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-4">Distribuição de Volume</h5>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tabela Detalhada */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-4">Análise Detalhada por Canal</h5>
            <div className="space-y-3">
              {chartData.map((channel) => {
                const Icon = CHANNEL_CONFIG[channel.name.toLowerCase() as keyof typeof CHANNEL_CONFIG]?.icon || MessageSquare;
                
                return (
                  <div key={channel.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" style={{ color: channel.color }} />
                        <span className="font-semibold text-gray-900">{channel.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{channel.total}</div>
                        <div className="text-xs text-gray-600">interações</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{channel.sucesso}</div>
                        <div className="text-gray-600">Respostas</div>
                        <div className="text-xs text-gray-500">{channel.taxaSucesso}%</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{channel.agendamentos}</div>
                        <div className="text-gray-600">Agendamentos</div>
                        <div className="text-xs text-gray-500">{channel.taxaAgendamento}%</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">
                          {channel.sucesso > 0 ? Math.round((channel.agendamentos / channel.sucesso) * 100) : 0}%
                        </div>
                        <div className="text-gray-600">Conversão</div>
                        <div className="text-xs text-gray-500">resposta → agendamento</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insights */}
          <div className="p-4 bg-orange-50 rounded-lg">
            <h5 className="font-semibold text-orange-900 mb-2">📈 Insights dos Canais</h5>
            <div className="space-y-1 text-sm text-orange-800">
              {chartData.length > 0 && (
                <>
                  <p>• Canal mais efetivo: {chartData.sort((a, b) => b.taxaAgendamento - a.taxaAgendamento)[0]?.name} ({chartData.sort((a, b) => b.taxaAgendamento - a.taxaAgendamento)[0]?.taxaAgendamento}% agendamentos)</p>
                  <p>• Canal com maior volume: {chartData.sort((a, b) => b.total - a.total)[0]?.name} ({chartData.sort((a, b) => b.total - a.total)[0]?.total} interações)</p>
                  <p>• Taxa geral de resposta: {totalGeral > 0 ? Math.round((sucessoGeral / totalGeral) * 100) : 0}% - {totalGeral > 0 && Math.round((sucessoGeral / totalGeral) * 100) >= 60 ? 'Excelente engajamento' : 'Há espaço para otimização'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
