
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Edit, 
  Eye, 
  MessageSquare, 
  Mail, 
  Clock,
  Plus,
  Trash2
} from "lucide-react";
import { useTemplates, useDeleteTemplate, useUpdateTemplate } from "@/hooks/useTemplates";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TemplatesListProps {
  canalFilter?: string;
  onEditTemplate: (template: any) => void;
  onCreateTemplate: () => void;
}

export const TemplatesList = ({ 
  canalFilter, 
  onEditTemplate, 
  onCreateTemplate 
}: TemplatesListProps) => {
  const { data: templates, isLoading, error } = useTemplates();
  const deleteTemplate = useDeleteTemplate();
  const updateTemplate = useUpdateTemplate();
  const { toast } = useToast();

  const filteredTemplates = templates?.filter(template => {
    if (canalFilter && canalFilter !== 'todos' && template.canal !== canalFilter) {
      return false;
    }
    return true;
  });

  // Organizar templates por grupos de etapas
  const groupedTemplates = filteredTemplates?.reduce((groups, template) => {
    const etapa = Number(template.etapa_cadencia);
    let grupoKey = '';
    
    if (etapa >= 101 && etapa <= 103) {
      grupoKey = 'dia1';
    } else if (etapa >= 201 && etapa <= 203) {
      grupoKey = 'dia2';
    } else if (etapa >= 301 && etapa <= 303) {
      grupoKey = 'dia3';
    } else {
      grupoKey = 'outros';
    }

    if (!groups[grupoKey]) {
      groups[grupoKey] = [];
    }
    groups[grupoKey].push(template);
    return groups;
  }, {} as Record<string, typeof filteredTemplates>) || {};

  const grupasInfo = {
    dia1: { title: 'Dia 1 da Cadência', subtitle: 'Primeira abordagem e reforços iniciais', color: 'bg-blue-50 border-blue-200' },
    dia2: { title: 'Dia 2 da Cadência', subtitle: 'Segundo contato e reforços', color: 'bg-yellow-50 border-yellow-200' },
    dia3: { title: 'Dia 3 da Cadência', subtitle: 'Última tentativa e encerramento', color: 'bg-red-50 border-red-200' },
    outros: { title: 'Outras Etapas', subtitle: 'Templates com etapas não padrão', color: 'bg-gray-50 border-gray-200' }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'email':
        return Mail;
      case 'whatsapp':
        return MessageSquare;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEtapaLabel = (etapa: number) => {
    const etapaLabels: { [key: number]: string } = {
      101: 'Primeira abordagem',
      102: 'Reforço 1',
      103: 'Reforço 2',
      201: 'Segunda abordagem',
      202: 'Reforço 1',
      203: 'Reforço 2',
      301: 'Última tentativa',
      302: 'Reforço final',
      303: 'Encerramento'
    };
    
    return etapaLabels[etapa] || `Etapa ${etapa}`;
  };

  const handleToggleAtivo = async (template: any, ativo: boolean) => {
    try {
      await updateTemplate.mutateAsync({
        id: template.id,
        template: { ativo }
      });
      toast({
        title: "Sucesso!",
        description: `Template ${ativo ? 'ativado' : 'desativado'} com sucesso.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar template."
      });
    }
  };

  const handleDelete = async (templateId: number) => {
    try {
      await deleteTemplate.mutateAsync(templateId);
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <p className="text-red-600">Erro ao carregar templates: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
            <p className="text-gray-600 mb-4">
              Comece criando seu primeiro template de mensagem.
            </p>
            <Button onClick={onCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Template
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTemplates)
        .filter(([_, templates]) => templates && templates.length > 0)
        .map(([grupoKey, grupoTemplates]) => {
          const grupoInfo = grupasInfo[grupoKey as keyof typeof grupasInfo];
          
          return (
            <Card key={grupoKey} className={`border-2 ${grupoInfo.color}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{grupoInfo.title}</h3>
                    <p className="text-sm text-gray-600 font-normal">{grupoInfo.subtitle}</p>
                  </div>
                  <Badge variant="secondary">
                    {grupoTemplates?.length || 0} template{(grupoTemplates?.length || 0) !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grupoTemplates?.map((template) => {
                    const CanalIcon = getCanalIcon(template.canal);
                    
                    return (
                      <Card key={template.id} className="border hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg ${getCanalColor(template.canal)}`}>
                              <CanalIcon className="h-4 w-4" />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={template.ativo || false}
                                onCheckedChange={(checked) => handleToggleAtivo(template, checked)}
                                className="scale-75"
                              />
                            </div>
                          </div>
                          <CardTitle className="text-base line-clamp-2">
                            {template.nome_template}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <Badge className={getCanalColor(template.canal)} variant="secondary">
                                  {template.canal.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">
                                  {getEtapaLabel(Number(template.etapa_cadencia))}
                                </Badge>
                              </div>
                              <div className="text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {template.data_criacao && 
                                  format(new Date(template.data_criacao), 'dd/MM', { locale: ptBR })
                                }
                              </div>
                            </div>

                            {template.assunto_template && (
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Assunto:</p>
                                <p className="text-sm font-medium line-clamp-1">
                                  {template.assunto_template}
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="text-xs text-gray-600 mb-1">Preview:</p>
                              <p className="text-sm text-gray-900 line-clamp-3">
                                {template.corpo_template.length > 100
                                  ? `${template.corpo_template.substring(0, 100)}...`
                                  : template.corpo_template
                                }
                              </p>
                            </div>

                            {template.descricao_interna && (
                              <div>
                                <p className="text-xs text-gray-600 mb-1">Descrição:</p>
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {template.descricao_interna}
                                </p>
                              </div>
                            )}

                            <div className="flex space-x-2 pt-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => onEditTemplate(template)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir Template</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o template "{template.nome_template}"? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(template.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};
