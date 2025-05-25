
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useRelatorios } from '@/hooks/useRelatorios';

const Reports = () => {
  const { data: relatoriosData, isLoading, error } = useRelatorios();

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center">Carregando relatórios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center text-red-600">Erro ao carregar relatórios: {error.message}</div>
      </div>
    );
  }

  const { monthlyData, channelData, sectorData, stats } = relatoriosData || {};

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Relatórios</h2>
          <p className="text-gray-600 mt-1">Análise detalhada do desempenho das suas cadências e resultados.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Contatos Total</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalContatos || 0}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              Total de interações registradas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.taxaConversao || 0}%</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              Agendamentos / Total de contatos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tempo Médio Resposta</CardTitle>
            <MessageSquare className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.tempoMedioResposta || '-'}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              Tempo médio para obter resposta
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.agendamentos || 0}</div>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              Total de reuniões agendadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="contacts" fill="#3b82f6" name="Contatos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill="#10b981" name="Conversões" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {channelData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex flex-col justify-center">
                {channelData?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectorData?.map((sector, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{sector.sector}</Badge>
                  <span className="text-sm text-gray-600">{sector.companies} empresas</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">{sector.conversions} conversões</span>
                  <span className="text-sm text-gray-600">
                    {sector.companies > 0 ? Math.round((sector.conversions / sector.companies) * 100) : 0}% taxa
                  </span>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                Nenhum dado de setor encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho Detalhado por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="emails" fill="#3b82f6" name="E-mails" />
              <Bar dataKey="calls" fill="#f59e0b" name="Ligações" />
              <Bar dataKey="whatsapp" fill="#10b981" name="WhatsApp" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
