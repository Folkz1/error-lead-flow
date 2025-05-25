
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon, 
  Save, 
  Clock, 
  Bell, 
  MessageSquare, 
  Mail,
  Database,
  Shield
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Configurações</h2>
          <p className="text-gray-600 mt-1">Gerencie as configurações do sistema e parâmetros de cadência.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="cadences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cadences">Cadências</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* Cadence Settings */}
        <TabsContent value="cadences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Configurações de Cadência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="max-days">Máximo de Dias por Cadência</Label>
                  <Input id="max-days" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-cadences">Máximo de Cadências por Empresa</Label>
                  <Input id="max-cadences" type="number" defaultValue="7" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="day1-msgs">Mensagens Dia 1</Label>
                  <Input id="day1-msgs" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day2-msgs">Mensagens Dia 2</Label>
                  <Input id="day2-msgs" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day3-msgs">Mensagens Dia 3</Label>
                  <Input id="day3-msgs" type="number" defaultValue="1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="interval-r1">Intervalo Reforço 1 (horas)</Label>
                  <Input id="interval-r1" type="number" defaultValue="3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interval-r2">Intervalo Reforço 2 (horas)</Label>
                  <Input id="interval-r2" type="number" defaultValue="6" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cooldown">Cooldown entre Cadências (dias)</Label>
                <Input id="cooldown" type="number" defaultValue="30" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Horário de Início</Label>
                  <Input id="start-time" type="time" defaultValue="08:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">Horário de Término</Label>
                  <Input id="end-time" type="time" defaultValue="18:00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dias da Semana</Label>
                <div className="flex space-x-4">
                  {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Switch id={`day-${index}`} defaultChecked={index < 5} />
                      <Label htmlFor={`day-${index}`} className="text-sm">{day.slice(0, 3)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Configurações de Notificação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                    <p className="text-sm text-gray-600">Receba notificações sobre novas respostas e agendamentos</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="error-alerts">Alertas de Erro</Label>
                    <p className="text-sm text-gray-600">Receba alertas quando novos erros forem detectados</p>
                  </div>
                  <Switch id="error-alerts" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-summary">Resumo Diário</Label>
                    <p className="text-sm text-gray-600">Receba um resumo das atividades do dia</p>
                  </div>
                  <Switch id="daily-summary" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cadence-completion">Conclusão de Cadência</Label>
                    <p className="text-sm text-gray-600">Notificação quando uma cadência for concluída</p>
                  </div>
                  <Switch id="cadence-completion" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>WhatsApp Business</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-token">Token da API</Label>
                <Input id="whatsapp-token" type="password" placeholder="Digite seu token do WhatsApp Business" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                <Input id="whatsapp-number" placeholder="+55 11 99999-9999" />
              </div>
              <Button variant="outline">Testar Conexão</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Configuração de E-mail</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-server">Servidor SMTP</Label>
                  <Input id="smtp-server" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input id="smtp-port" type="number" placeholder="587" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-user">E-mail</Label>
                <Input id="email-user" type="email" placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-password">Senha</Label>
                <Input id="email-password" type="password" placeholder="Digite sua senha" />
              </div>
              <Button variant="outline">Testar Conexão</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Plataforma de Monitoramento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monitoring-url">URL da API</Label>
                <Input id="monitoring-url" placeholder="https://api.monitoramento.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monitoring-key">Chave da API</Label>
                <Input id="monitoring-key" type="password" placeholder="Digite sua chave da API" />
              </div>
              <Button variant="outline">Testar Conexão</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Configurações do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="max-daily-approaches">Limite de Novas Abordagens por Dia</Label>
                <Input id="max-daily-approaches" type="number" defaultValue="50" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="min-interval">Intervalo Mínimo entre Mensagens (segundos)</Label>
                  <Input id="min-interval" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-interval">Intervalo Máximo entre Mensagens (segundos)</Label>
                  <Input id="max-interval" type="number" defaultValue="300" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select defaultValue="america/sao_paulo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america/sao_paulo">América/São Paulo</SelectItem>
                    <SelectItem value="america/new_york">América/Nova York</SelectItem>
                    <SelectItem value="europe/london">Europa/Londres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="log-level">Nível de Log</Label>
                <Select defaultValue="info">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Backup Automático</Label>
                  <p className="text-sm text-gray-600">Realizar backup automático dos dados diariamente</p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Base de Conhecimento da IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="knowledge-base">Informações da Empresa</Label>
                <Textarea 
                  id="knowledge-base" 
                  placeholder="Digite informações sobre sua empresa que a IA deve conhecer..."
                  rows={6}
                />
              </div>
              <Button variant="outline">Atualizar Base de Conhecimento</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
