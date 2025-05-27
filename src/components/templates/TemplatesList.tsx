
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTemplates } from "@/hooks/useTemplates";
import { Edit, Eye, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface TemplatesListProps {
  canalFilter?: string;
  onEditTemplate: (template: any) => void;
  onCreateTemplate: () => void;
}

export const TemplatesList = ({ canalFilter, onEditTemplate, onCreateTemplate }: TemplatesListProps) => {
  const { data: templates, isLoading, error } = useTemplates(canalFilter);

  const agruparTemplates = () => {
    if (!templates) return {};
    
    const grupos: Record<string, typeof templates> = {};
    
    templates.forEach(template => {
      const etapa = template.etapa_cadencia.toString();
      if (!grupos[etapa]) {
        grupos[etapa] = [];
      }
      grupos[etapa].push(template);
    });
    
    return grupos;
  };

  const extrairVariaveis = (texto: string) => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variaveis = [];
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      variaveis.push(match[1]);
    }
    
    return [...new Set(variaveis)]; // Remove duplicatas
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Erro ao carregar templates: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">Nenhum template encontrado.</p>
          <Button onClick={onCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Template
          </Button>
        </CardContent>
      </Card>
    );
  }

  const gruposEtapa = agruparTemplates();

  return (
    <div className="space-y-6">
      {Object.entries(gruposEtapa)
        .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
        .map(([etapa, templatesEtapa]) => (
          <div key={etapa}>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
                Etapa {etapa}
              </span>
              <span className="text-gray-600">({templatesEtapa.length} templates)</span>
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templatesEtapa.map((template) => {
                const variaveis = extrairVariaveis(template.corpo_template + (template.assunto_template || ''));
                
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium truncate">
                          {template.nome_template}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={template.ativo} 
                            size="sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={template.canal === 'whatsapp' ? 'default' : 'secondary'}>
                          {template.canal}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Etapa {template.etapa_cadencia}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Preview do conteúdo */}
                      <div className="space-y-2">
                        {template.assunto_template && (
                          <div>
                            <p className="text-xs text-gray-600 font-medium">Assunto:</p>
                            <p className="text-sm text-gray-800 truncate">
                              {template.assunto_template}
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Corpo:</p>
                          <p className="text-sm text-gray-800 line-clamp-3">
                            {template.corpo_template.length > 100 
                              ? `${template.corpo_template.substring(0, 100)}...`
                              : template.corpo_template
                            }
                          </p>
                        </div>
                        
                        {/* Variáveis necessárias */}
                        {variaveis.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-600 font-medium mb-1">Variáveis:</p>
                            <div className="flex flex-wrap gap-1">
                              {variaveis.slice(0, 3).map((variavel, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {variavel}
                                </Badge>
                              ))}
                              {variaveis.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{variaveis.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Ações */}
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onEditTemplate(template)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-3 w-3 mr-1" />
                        </Button>
                      </div>
                      
                      {template.descricao_interna && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          {template.descricao_interna}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};
