
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus,
  Filter,
  MoreHorizontal,
  GitBranch,
  Clock,
  Users,
  MessageSquare,
  Mail,
  Phone
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTemplates } from "@/hooks/useTemplates";
import { useConfiguracoes } from "@/hooks/useConfiguracoes";
import { useState } from "react";

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const getChannelIcon = (canal: string) => {
  switch (canal) {
    case 'email':
      return <Mail className="h-4 w-4 text-blue-600" />;
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4 text-green-600" />;
    case 'telefone':
      return <Phone className="h-4 w-4 text-orange-600" />;
    default:
      return <MessageSquare className="h-4 w-4 text-gray-600" />;
  }
};

const Cadences = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: templates, isLoading: templatesLoading, error: templatesError } = useTemplates();
  const { data: configuracoes, isLoading: configLoading, error: configError } = useConfiguracoes();

  const filteredTemplates = templates?.filter(template => 
    template.nome_template.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.canal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.corpo_template.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (templatesLoading || configLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center">Carregando cadências...</div>
      </div>
    );
  }

  if (templatesError || configError) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center text-red-600">
          Erro ao carregar dados: {templatesError?.message || configError?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Cadências</h2>
          <p className="text-gray-600 mt-1">Configure e gerencie sequências de comunicação automatizadas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cadência
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Templates Ativos</CardTitle>
            <GitBranch className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{templates?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Templates de mensagem</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Configurações</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{configuracoes?.length || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Configurações ativas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Canais</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(templates?.map(t => t.canal)).size || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Canais diferentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Etapas</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {Math.max(...(templates?.map(t => t.etapa_cadencia) || [0]))}
            </div>
            <p className="text-xs text-gray-600 mt-1">Máximo de etapas</p>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Ativas */}
      {configuracoes && configuracoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Cadência Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {configuracoes.map((config) => (
                <div key={config.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{config.nome_configuracao}</h3>
                    <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Horário:</span><br />
                      {config.horario_inicio_funcionamento} - {config.horario_fim_funcionamento}
                    </div>
                    <div>
                      <span className="font-medium">Max mensagens/dia:</span><br />
                      D1: {config.max_mensagens_dia1} | D2: {config.max_mensagens_dia2} | D3: {config.max_mensagens_dia3}
                    </div>
                    <div>
                      <span className="font-medium">Cooldown:</span><br />
                      {config.cooldown_entre_cadencias_dias} dias
                    </div>
                    <div>
                      <span className="font-medium">Max abordagens/dia:</span><br />
                      {config.limite_max_novas_abordagens_dia}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar templates..."
                  className="pl-9 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates de Mensagem ({filteredTemplates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{template.nome_template}</div>
                        {template.assunto_template && (
                          <div className="text-sm text-gray-600">Assunto: {template.assunto_template}</div>
                        )}
                        <div className="text-sm text-gray-500 mt-1 max-w-md truncate">
                          {template.corpo_template}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getChannelIcon(template.canal)}
                        <span className="capitalize">{template.canal}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Etapa {template.etapa_cadencia}</Badge>
                    </TableCell>
                    <TableCell>
                      {template.ativo ? (
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(template.data_criacao)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum template encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cadences;
