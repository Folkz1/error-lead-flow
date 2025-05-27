
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
  Phone
} from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [canalFilter, setCanalFilter] = useState("todos");
  const { data: templates, isLoading, error } = useTemplates(canalFilter === "todos" ? undefined : canalFilter);

  const filteredTemplates = templates?.filter(template => 
    template.nome_template.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.corpo_template.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button className="bg-primary hover:bg-primary/90">
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <MessageSquare className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Templates Disponíveis ({filteredTemplates?.length || 0})
          </h3>
        </div>

        {filteredTemplates && filteredTemplates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => {
              const IconComponent = getCanalIcon(template.canal);
              
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getCanalColor(template.canal)}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {template.nome_template}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getCanalColor(template.canal)} variant="secondary">
                              {template.canal.toUpperCase()}
                            </Badge>
                            <Badge className={getEtapaColor(Number(template.etapa_cadencia))} variant="secondary">
                              Etapa {template.etapa_cadencia}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${template.ativo ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-gray-500">
                          {template.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {template.assunto_template && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-600">Assunto:</p>
                        <p className="text-sm text-gray-900 truncate">{template.assunto_template}</p>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-600 mb-1">Conteúdo:</p>
                      <p className="text-sm text-gray-900 line-clamp-3">
                        {template.corpo_template.substring(0, 150)}
                        {template.corpo_template.length > 150 ? '...' : ''}
                      </p>
                    </div>

                    {template.descricao_interna && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-600 mb-1">Descrição:</p>
                        <p className="text-xs text-gray-500">{template.descricao_interna}</p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`flex-1 ${template.ativo ? 'text-red-600' : 'text-green-600'}`}
                      >
                        <Power className="h-3 w-3 mr-1" />
                        {template.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template encontrado</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || canalFilter !== "todos" 
                    ? "Nenhum template corresponde aos filtros aplicados." 
                    : "Comece criando seu primeiro template de mensagem."
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Template
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Templates;
