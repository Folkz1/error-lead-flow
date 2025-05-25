
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GitBranch, 
  Play, 
  Pause, 
  Edit, 
  Plus,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Mail,
  MessageSquare,
  Phone
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const cadencesData = [
  {
    id: 1,
    name: "Cadência Principal - Erros de Site",
    status: "ativa",
    companies: 145,
    completionRate: 23,
    avgResponseTime: "2.3 dias",
    totalSteps: 7,
    currentStep: 3,
    lastModified: "2024-07-20",
    channels: ["email", "whatsapp", "phone"]
  },
  {
    id: 2,
    name: "Follow-up Agendamentos",
    status: "pausada",
    companies: 67,
    completionRate: 45,
    avgResponseTime: "1.8 dias",
    totalSteps: 5,
    currentStep: 2,
    lastModified: "2024-07-18",
    channels: ["email", "phone"]
  },
  {
    id: 3,
    name: "Reengajamento - Leads Frios",
    status: "ativa",
    companies: 89,
    completionRate: 15,
    avgResponseTime: "4.1 dias",
    totalSteps: 6,
    currentStep: 1,
    lastModified: "2024-07-22",
    channels: ["whatsapp", "email"]
  }
];

const performanceData = [
  { day: 'Seg', opens: 45, clicks: 23, responses: 12 },
  { day: 'Ter', opens: 52, clicks: 28, responses: 15 },
  { day: 'Qua', opens: 48, clicks: 25, responses: 18 },
  { day: 'Qui', opens: 61, clicks: 35, responses: 22 },
  { day: 'Sex', opens: 55, clicks: 30, responses: 19 },
  { day: 'Sáb', opens: 35, clicks: 18, responses: 8 },
  { day: 'Dom', opens: 28, clicks: 12, responses: 5 }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ativa":
      return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
    case "pausada":
      return <Badge className="bg-yellow-100 text-yellow-800">Pausada</Badge>;
    case "rascunho":
      return <Badge className="bg-gray-100 text-gray-800">Rascunho</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "email":
      return <Mail className="h-3 w-3" />;
    case "whatsapp":
      return <MessageSquare className="h-3 w-3" />;
    case "phone":
      return <Phone className="h-3 w-3" />;
    default:
      return null;
  }
};

const Cadences = () => {
  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Cadências</h2>
          <p className="text-gray-600 mt-1">Crie e gerencie sequências automatizadas de contato para suas empresas.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Cadência
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Performance Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="opens" stroke="#3b82f6" strokeWidth={2} name="Aberturas" />
                <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} name="Cliques" />
                <Line type="monotone" dataKey="responses" stroke="#f59e0b" strokeWidth={2} name="Respostas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Métricas Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">301</div>
                  <div className="text-sm text-blue-600">Empresas Ativas</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">28%</div>
                  <div className="text-sm text-green-600">Taxa de Resposta</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Abertura de E-mail</span>
                  <span className="text-sm font-medium">67%</span>
                </div>
                <Progress value={67} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Clique</span>
                  <span className="text-sm font-medium">34%</span>
                </div>
                <Progress value={34} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Conversão</span>
                  <span className="text-sm font-medium">12%</span>
                </div>
                <Progress value={12} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Cadences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cadências Ativas</span>
            <span className="text-sm font-normal text-gray-600">
              {cadencesData.length} cadências configuradas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cadencesData.map((cadence) => (
              <Card key={cadence.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <GitBranch className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cadence.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          {getStatusBadge(cadence.status)}
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{cadence.companies} empresas</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">{cadence.completionRate}% conclusão</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">Resp. média: {cadence.avgResponseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md">
                        {cadence.channels.map((channel, index) => (
                          <div key={index} className="text-gray-600">
                            {getChannelIcon(channel)}
                          </div>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        {cadence.status === "ativa" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progresso da cadência</span>
                      <span className="text-sm text-gray-600">Passo {cadence.currentStep} de {cadence.totalSteps}</span>
                    </div>
                    <Progress value={(cadence.currentStep / cadence.totalSteps) * 100} className="h-2" />
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <span>Última modificação: {cadence.lastModified}</span>
                    <Button variant="link" className="text-xs p-0 h-auto">
                      Ver detalhes →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadences;
