
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Power,
  Mail,
  Phone,
  Trash2
} from "lucide-react";
import { useTemplates, useUpdateTemplate, useDeleteTemplate } from "@/hooks/useTemplates";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TemplateEditor } from "@/components/templates/TemplateEditor";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from '@/integrations/supabase/types';

type TemplateMensagem = Tables<'templates_mensagens'>;

const Templates = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [canalFilter, setCanalFilter] = useState("todos");
  const [etapaFilter, setEtapaFilter] = useState("todos");
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateMensagem | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');

  const { data: templates, isLoading, error } = useTemplates(canalFilter === "todos" ? undefined : canalFilter);
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = template.nome_template.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.corpo_template.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEtapa = etapaFilter === "todos" || 
      template.etapa_cadencia.toString() === etapaFilter;
    
    return matchesSearch && matchesEtapa;
  });

  // Group templates by etapa_cadencia
  const groupedTemplates = filteredTemplates?.reduce((acc, template) => {
    const etapa = template.etapa_cadencia.toString();
    if (!acc[etapa]) {
      acc[etapa] = [];
    }
    acc[etapa].push(template);
    return acc;
  }, {} as Record<string, TemplateMensagem[]>);

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'email':
        return Mail;
      case 'whatsapp':
        return MessageSquare;
      case 'call':
        return Phone;
      default:
        return MessageSquare;
    }
  };

  const getCanalColor = (canal: string) => {
    switch (canal) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'whatsapp':
        return 'bg-green-100 text-green-800';
      case 'call':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEtapaLabel = (etapa: number) => {
    switch (etapa) {
      case 1:
        return 'Dia 1 - Primeira abordagem';
      case 2:
        return 'Dia 2 - Reforço';
      case 3:
        return 'Dia 3 - Última tentativa';
      default:
        return `Etapa ${etapa}`;
    }
  };

  const getEtapaColor = (etapa: number) => {
    switch (etapa) {
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-orange-100 text-orange-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setEditorMode('create');
    setEditorOpen(true);
  };

  const handleEditTemplate = (template: TemplateMensagem) => {
    setSelectedTemplate(template);
    setEditorMode('edit');
    setEditorOpen(true);
  };

  const handleToggleActive = async (template: TemplateMensagem) => {
    try {
      await updateTemplate.mutateAsync({
        id: template.id,
        template: { ativo: !template.ativo }
      });
      
      toast({
        title: "Sucesso!",
        description: `Template ${template.ativo ? 'desativado' : 'ativado'} com sucesso.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao alterar status do template."
      });
    }
  };

  const handleDeleteTemplate = async (template: TemplateMensagem) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    try {
      await deleteTemplate.mutateAsync(template.id);
      toast({
        title: "Sucesso!",
        description: "Template excluído com sucesso."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir template."
      });
    }
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{\{[^}]+\}\}/g);
    return matches ? [...new Set(matches)] : [];
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center py-12">
          <p className="text-red-600">Erro ao carregar templates: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Templates de Mensagem</h2>
          <p className="text-gray-600 mt-1">Gerencie templates para cadências de WhatsApp, E-mail e Ligações.</p>
        </div>
        <Button onClick={handleCreateTemplate} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar Templates</CardTitle>
          <CardDescription>Encontre templates por nome, conteúdo ou características</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou conteúdo do template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={canalFilter} onValueChange={setCanalFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Canais</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="call">Ligação</SelectItem>
              </SelectContent>
            </Select>
            <Select value={etapaFilter} onValueChange={setEtapaFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Etapas</SelectItem>
                <SelectItem value="1">Dia 1</SelectItem>
                <SelectItem value="2">Dia 2</SelectItem>
                <SelectItem value="3">Dia 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates by Stage */}
      {groupedTemplates && Object.keys(groupedTemplates).length > 0 ? (
        Object.entries(groupedTemplates)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([etapa, etapaTemplates]) => (
            <Card key={etapa}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getEtapaColor(parseInt(etapa))} variant="secondary">
                      {getEtapaLabel(parseInt(etapa))}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {etapaTemplates.length} template{etapaTemplates.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Variáveis</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {etapaTemplates.map((template) => {
                      const IconComponent = getCanalIcon(template.canal);
                      const variables = extractVariables(template.corpo_template);
                      
                      return (
                        <TableRow key={template.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{template.nome_template}</p>
                              {template.descricao_interna && (
                                <p className="text-sm text-gray-500">{template.descricao_interna}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded ${getCanalColor(template.canal)}`}>
                                <IconComponent className="h-3 w-3" />
                              </div>
                              <span className="text-sm capitalize">{template.canal}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {variables.slice(0, 3).map((variable, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {variable}
                                </Badge>
                              ))}
                              {variables.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{variables.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="text-sm text-gray-600 truncate max-w-xs">
                              {template.canal === 'email' && template.assunto_template ? 
                                template.assunto_template : 
                                template.corpo_template.substring(0, 50)
                              }...
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${template.ativo ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                              <span className="text-xs">
                                {template.ativo ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleToggleActive(template)}
                                className={template.ativo ? 'text-red-600' : 'text-green-600'}
                              >
                                <Power className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteTemplate(template)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || canalFilter !== "todos" || etapaFilter !== "todos"
                  ? "Nenhum template corresponde aos filtros aplicados." 
                  : "Comece criando seu primeiro template de mensagem."
                }
              </p>
              <Button onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Editor Modal */}
      <TemplateEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        template={selectedTemplate}
        mode={editorMode}
      />
    </div>
  );
};

export default Templates;
