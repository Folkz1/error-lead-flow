
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bot, Clock, MessageSquare, Target } from "lucide-react";

interface IAStats {
  totalInteracoes: number;
  interacoesComResposta: number;
  agendamentosGerados: number;
  optOuts: number;
  tempoMedioResposta: string;
  mensagensPorInteracao: number;
}

interface IAEfficiencyProps {
  data?: IAStats;
}

const OUTCOME_COLORS = {
  agendamentos: '#10b981',
  respostas: '#3b82f6',
  optouts: '#ef4444',
  semresposta: '#6b7280'
};

export const IAEfficiency = ({ data }: IAEfficiencyProps) => {
  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">Carregando dados da IA...</div>
        </CardContent>
      </Card>
    );
  }

  const outcomeData = [
    {
      name: 'Agendamentos',
      value: data.agendamentosGerados,
      color: OUTCOME_COLORS.agendamentos
    },
    {
      name: 'Respostas',
      value: data.interacoesComResposta - data.agendamentosGerados,
      color: OUTCOME_COLORS.respostas
    },
    {
      name: 'Opt-outs',
      value: data.optOuts,
      color: OUTCOME_COLORS.optouts
    },
    {
      name: 'Sem Resposta',
      value: data.totalInteracoes - data.interacoesComResposta,
      color: OUTCOME_COLORS.semresposta
    }
  ];

  const taxaResposta = data.totalInteracoes > 0 ? Math.round((data.interacoesComResposta / data.totalInteracoes) * 100) : 0;
  const taxaAgendamento = data.totalInteracoes > 0 ? Math.round((data.agendamentosGerados / data.totalInteracoes) * 100) : 0;
  const taxaOptOut = data.totalInteracoes > 0 ? Math.round((data.optOuts / data.totalInteracoes) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Eficiência da IA de Atendimento
        </CardTitle>
        <p className="text-sm text-gray-600">
          Análise completa do desempenho da inteligência artificial nas conversas
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* KPIs da IA */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{data.totalInteracoes}</div>
              <div className="text-sm text-gray-600">Interações Totais</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">{taxaResposta}%</div>
              <div className="text-sm text-gray-600">Taxa de Resposta</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">{data.tempoMedioResposta}</div>
              <div className="text-sm text-gray-600">Tempo Médio</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Bot className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">{data.mensagensPorInteracao}</div>
              <div className="text-sm text-gray-600">Msgs/Conversa</div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição de Resultados */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Distribuição de Resultados</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={outcomeData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Métricas de Performance */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-4">Métricas de Performance</h5>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Taxa de Agendamento</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(taxaAgendamento * 2, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{taxaAgendamento}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Taxa de Opt-out</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(taxaOptOut * 4, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{taxaOptOut}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium">Eficiência Geral</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${taxaResposta}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{taxaResposta}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-2">🤖 Insights da IA</h5>
            <div className="space-y-1 text-sm text-blue-800">
              <p>• A IA está gerenciando {data.totalInteracoes} interações com {taxaResposta}% de taxa de resposta</p>
              <p>• {taxaAgendamento}% das conversas resultaram em agendamento - {taxaAgendamento >= 15 ? 'Excelente!' : taxaAgendamento >= 10 ? 'Bom resultado' : 'Há espaço para melhoria'}</p>
              <p>• Taxa de opt-out em {taxaOptOut}% - {taxaOptOut <= 5 ? 'Dentro do esperado' : 'Considere ajustar abordagem'}</p>
              <p>• Média de {data.mensagensPorInteracao} mensagens por conversa indica diálogos {data.mensagensPorInteracao <= 5 ? 'eficientes' : 'que podem ser otimizados'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
