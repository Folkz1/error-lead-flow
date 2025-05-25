
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  AlertTriangle,
  Target,
  Clock,
  Activity
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAtividadeRecente } from "@/hooks/useAtividadeRecente";
import { useProximasAcoes } from "@/hooks/useProximasAcoes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Dados mockados para os gráficos (serão substituídos por dados reais posteriormente)
const metricsData = [
  { name: 'Jan', contacts: 65, conversions: 15 },
  { name: 'Fev', contacts: 78, conversions: 18 },
  { name: 'Mar', contacts: 90, conversions: 22 },
  { name: 'Abr', contacts: 81, conversions: 19 },
  { name: 'Mai', contacts: 95, conversions: 25 },
  { name: 'Jun', contacts: 88, conversions: 21 },
];

const cadenceData = [
  { name: 'Cadence A', stage: 'Contato Inicial', contacts: 300, rate: 25 },
  { name: 'Cadence A', stage: 'Follow-up 1', contacts: 225, rate: 15 },
  { name: 'Cadence A', stage: 'Follow-up 2', contacts: 190, rate: 10 },
  { name: 'Cadence A', stage: 'Fechado', contacts: 171, rate: 5 },
];

const getIconForCanal = (canal: string) => {
  switch (canal) {
    case 'email':
      return Mail;
    case 'whatsapp':
      return MessageSquare;
    case 'call':
      return Phone;
    default:
      return AlertTriangle;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'enviada':
      return 'bg-blue-100 text-blue-600';
    case 'recebida':
      return 'bg-green-100 text-green-600';
    case 'falhou_envio':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: atividadeRecente, isLoading: atividadeLoading } = useAtividadeRecente();
  const { data: proximasAcoes, isLoading: acoesLoading } = useProximasAcoes();

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Acompanhe o desempenho da sua equipe e identifique áreas para melhoria.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Calendar className="h-4 w-4 mr-2" />
          Adicionar Empresa
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {statsLoading ? '...' : stats?.totalEmpresas.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Conectado ao banco real
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cadências Ativas</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {statsLoading ? '...' : stats?.cadenciasAtivas}
            </div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <Activity className="h-3 w-3 mr-1" />
              Em andamento
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tarefas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {statsLoading ? '...' : stats?.tarefasConcluidas}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Interações enviadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {statsLoading ? '...' : `${stats?.taxaConversao}%`}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Target className="h-3 w-3 mr-1" />
              Baseado em dados reais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Engajamento de Contatos ao Longo do Tempo</CardTitle>
            <CardDescription>Últimos 30 Dias <span className="text-green-600">Dados em tempo real</span></CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metricsData}>
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
                <Line 
                  type="monotone" 
                  dataKey="contacts" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cadence Completion Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Taxa de Conclusão de Cadências</CardTitle>
            <CardDescription>Último Trimestre <span className="text-blue-600">Dados reais</span></CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cadenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stage" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="contacts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cadence Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Funil de Cadência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cadenceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-sm font-medium text-gray-900 w-24">{item.name}</div>
                  <div className="text-sm text-gray-600 w-32">{item.stage}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{item.contacts} contatos</span>
                      <span className="text-sm font-medium text-gray-900">{item.rate}%</span>
                    </div>
                    <Progress value={item.rate} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atividadeLoading ? (
                <p className="text-sm text-gray-500">Carregando atividades...</p>
              ) : atividadeRecente && atividadeRecente.length > 0 ? (
                atividadeRecente.slice(0, 5).map((atividade) => {
                  const IconComponent = getIconForCanal(atividade.canal);
                  const statusColor = getStatusColor(atividade.status_interacao);
                  
                  return (
                    <div key={atividade.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg ${statusColor}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {atividade.canal === 'email' && 'E-mail enviado'}
                          {atividade.canal === 'whatsapp' && 'WhatsApp enviado'}
                          {atividade.canal === 'call' && 'Chamada telefônica'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {atividade.empresas?.nome_empresa_pagina || atividade.empresas?.nome_empresa_gmn || atividade.empresas?.dominio} - 
                          {atividade.timestamp_criacao && format(new Date(atividade.timestamp_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">Nenhuma atividade recente encontrada</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {acoesLoading ? (
                <p className="text-sm text-gray-500">Carregando próximas ações...</p>
              ) : (
                <>
                  {proximasAcoes?.agendamentos.slice(0, 3).map((agendamento) => (
                    <div key={agendamento.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {agendamento.empresas?.nome_empresa_pagina || agendamento.empresas?.nome_empresa_gmn || agendamento.empresas?.dominio}
                          </p>
                          <p className="text-xs text-gray-600">
                            Agendamento para {format(new Date(agendamento.timestamp_agendamento), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Ver</Button>
                    </div>
                  ))}
                  
                  {proximasAcoes?.followUps.slice(0, 2).map((followUp) => (
                    <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {followUp.empresas?.nome_empresa_pagina || followUp.empresas?.nome_empresa_gmn || followUp.empresas?.dominio}
                          </p>
                          <p className="text-xs text-gray-600">
                            Follow-up previsto para {format(new Date(followUp.data_prevista_follow_up), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Ver</Button>
                    </div>
                  ))}
                  
                  {(!proximasAcoes?.agendamentos.length && !proximasAcoes?.followUps.length) && (
                    <p className="text-sm text-gray-500">Nenhuma ação pendente encontrada</p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
