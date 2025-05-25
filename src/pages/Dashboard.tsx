
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

const metricsData = [
  { name: 'Jan', contacts: 65, conversions: 15 },
  { name: 'Fev', contacts: 78, conversions: 18 },
  { name: 'Mar', contacts: 90, conversions: 22 },
  { name: 'Abr', contacts: 81, conversions: 19 },
  { name: 'Mai', contacts: 95, conversions: 25 },
  { name: 'Jun', contacts: 88, conversions: 21 },
];

const cadenceData = [
  { name: 'Cadence A', stage: 'Inicial Contact', contacts: 300, rate: 25 },
  { name: 'Cadence A', stage: 'Follow-up 1', contacts: 225, rate: 15 },
  { name: 'Cadence A', stage: 'Follow-up 2', contacts: 190, rate: 10 },
  { name: 'Cadence A', stage: 'Fechado', contacts: 171, rate: 5 },
];

const Dashboard = () => {
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
            <div className="text-2xl font-bold text-gray-900">1,250</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cadências Ativas</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">32</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -5% em relação à semana passada
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tarefas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">450</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">23%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2% em relação ao mês passado
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
            <CardDescription>Últimos 30 Dias <span className="text-green-600">+15%</span></CardDescription>
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
            <CardDescription>Último Trimestre <span className="text-red-600">-5%</span></CardDescription>
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
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">E-mail enviado</p>
                  <p className="text-xs text-gray-600">25 de julho de 2024</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Chamada telefônica</p>
                  <p className="text-xs text-gray-600">20 de julho de 2024</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Nota adicionada</p>
                  <p className="text-xs text-gray-600">15 de julho de 2024</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Erro detectado</p>
                  <p className="text-xs text-gray-600">10 de julho de 2024</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Tarefa concluída</p>
                  <p className="text-xs text-gray-600">5 de julho de 2024</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Próximas Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tech Solutions Inc.</p>
                    <p className="text-xs text-gray-600">Reforço programado para hoje às 14:00</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Ver</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">EduTech Innovations</p>
                    <p className="text-xs text-gray-600">E-mail de follow-up agendado</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Ver</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">HealthFirst Group</p>
                    <p className="text-xs text-gray-600">Reunião agendada para amanhã</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Ver</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
