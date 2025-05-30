
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageSquare, Building2, Eye, Edit, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContatosListProps {
  searchTerm: string;
}

export const ContatosList = ({ searchTerm }: ContatosListProps) => {
  const { data: contatos, isLoading, error } = useQuery({
    queryKey: ['contatos', searchTerm],
    queryFn: async () => {
      console.log('Buscando contatos com filtro:', searchTerm);
      
      let query = supabase
        .from('contatos_empresa')
        .select(`
          *,
          empresas:empresa_id (
            id,
            nome_empresa_pagina,
            nome_empresa_gmn,
            dominio
          )
        `)
        .order('data_adicao', { ascending: false });

      if (searchTerm) {
        query = query.or(`valor_contato.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      console.log('Contatos encontrados:', data?.length || 0);
      return data || [];
    },
  });

  const getContactIcon = (tipo: string) => {
    switch (tipo) {
      case 'email':
        return Mail;
      case 'telefone':
        return Phone;
      case 'whatsapp':
        return MessageSquare;
      default:
        return Phone;
    }
  };

  const getContactColor = (tipo: string) => {
    switch (tipo) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'telefone':
        return 'bg-green-100 text-green-800';
      case 'whatsapp':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'sem_resposta':
        return 'bg-yellow-100 text-yellow-800';
      case 'respondido':
        return 'bg-blue-100 text-blue-800';
      case 'nao_usar':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
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
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <p className="text-red-600">Erro ao carregar contatos: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!contatos || contatos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Phone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum contato encontrado</h3>
            <p className="text-gray-600">
              {searchTerm 
                ? "Nenhum contato corresponde aos filtros aplicados." 
                : "Comece adicionando seu primeiro contato."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {contatos.map((contato) => {
        const ContactIcon = getContactIcon(contato.tipo_contato);
        
        return (
          <Card key={contato.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getContactColor(contato.tipo_contato).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                    <ContactIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{contato.valor_contato}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>
                        {contato.empresas?.nome_empresa_pagina || 
                         contato.empresas?.nome_empresa_gmn || 
                         contato.empresas?.dominio}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getContactColor(contato.tipo_contato)}>
                    {contato.tipo_contato}
                  </Badge>
                  {contato.status_contato && (
                    <Badge className={getStatusColor(contato.status_contato)}>
                      {contato.status_contato}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-600">Fonte do Contato</p>
                  <p className="text-sm text-gray-900">{contato.fonte_contato || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-600">Data de Adição</p>
                  <p className="text-sm text-gray-900">
                    {contato.data_adicao && format(new Date(contato.data_adicao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>

              {contato.descricao && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-1">Descrição:</p>
                  <p className="text-sm text-gray-700">{contato.descricao}</p>
                </div>
              )}

              {contato.tipo_contato === 'whatsapp' && (
                <div className="mb-4 flex items-center space-x-4">
                  {contato.whatsapp_valido && (
                    <Badge variant="outline" className="text-green-600">
                      WhatsApp Válido
                    </Badge>
                  )}
                  {contato.whatsappbusiness && (
                    <Badge variant="outline" className="text-blue-600">
                      WhatsApp Business
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Histórico
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Nova Interação
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
