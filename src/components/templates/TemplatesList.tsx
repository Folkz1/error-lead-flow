
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
  Plus
} from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  const filteredTemplates = templates?.filter(template => {
    if (canalFilter && canalFilter !== 'todos' && template.canal !== canalFilter) {
      return false;
    }
    return true;
  });

  const groupedTemplates = filteredTemplates?.reduce((groups, template) => {
    const etapa = template.etapa_cadencia.toString();
    if (!groups[etapa]) {
      groups[etapa] = [];
    }
    groups[etapa].push(template);
    return groups;
  }, {} as Record<string, typeof filteredTemplates>) || {};

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
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([etapa, etapaTemplates]) => (
          <Card key={etapa}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Etapa {etapa} da Cadência</span>
                <Badge variant="secondary">
                  {etapaTemplates.length} template{etapaTemplates.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {etapaTemplates.map((template) => {
                  const CanalIcon = getCanalIcon(template.canal);
                  
                  return (
                    <Card key={template.id} className="border-2 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-lg ${getCanalColor(template.canal)}`}>
                            <CanalIcon className="h-4 w-4" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={template.ativo || false}
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
                            <Badge className={getCanalColor(template.canal)} variant="secondary">
                              {template.canal.toUpperCase()}
                            </Badge>
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
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
