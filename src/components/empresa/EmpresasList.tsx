
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Eye, Edit, AlertTriangle, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmpresasListProps {
  searchTerm: string;
  statusFilter: string;
}

export const EmpresasList = ({ searchTerm, statusFilter }: EmpresasListProps) => {
  const [selectedEmpresa, setSelectedEmpresa] = useState<number | null>(null);

  const { data: empresas, isLoading, error } = useQuery({
    queryKey: ['empresas', searchTerm, statusFilter],
    queryFn: async () => {
      console.log('Buscando empresas com filtros:', { searchTerm, statusFilter });
      
      let query = supabase
        .from('empresas')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (searchTerm) {
        query = query.or(`nome_empresa_pagina.ilike.%${searchTerm}%,nome_empresa_gmn.ilike.%${searchTerm}%,dominio.ilike.%${searchTerm}%`);
      }

      if (statusFilter !== 'todos') {
        query = query.eq('status_cadencia_geral', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      console.log('Empresas encontradas:', data?.length || 0);
      return data || [];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso_contato_realizado':
        return 'bg-green-100 text-green-800';
      case 'apta_para_nova_cadencia':
        return 'bg-blue-100 text-blue-800';
      case 'nao_perturbe':
        return 'bg-red-100 text-red-800';
      case 'fluxo_concluido_sem_resposta':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sucesso_contato_realizado':
        return 'Sucesso';
      case 'apta_para_nova_cadencia':
        return 'Apta';
      case 'nao_perturbe':
        return 'Não Perturbe';
      case 'fluxo_concluido_sem_resposta':
        return 'Sem Resposta';
      default:
        return status || 'N/A';
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
            <p className="text-red-600">Erro ao carregar empresas: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!empresas || empresas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "todos" 
                ? "Nenhuma empresa corresponde aos filtros aplicados." 
                : "Comece adicionando sua primeira empresa."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {empresas.map((empresa) => (
        <Card key={empresa.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>{empresa.dominio}</span>
                  </div>
                </div>
              </div>
              <Badge className={getStatusColor(empresa.status_cadencia_geral || '')}>
                {getStatusLabel(empresa.status_cadencia_geral || '')}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Data de Criação</p>
                  <p className="text-sm text-gray-900">
                    {empresa.data_criacao && format(new Date(empresa.data_criacao), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>

              {empresa.gmn_categoria && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-600">Categoria</p>
                    <p className="text-sm text-gray-900">{empresa.gmn_categoria}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs font-medium text-gray-600">Tentativas</p>
                  <p className="text-sm text-gray-900">{empresa.contador_total_tentativas_cadencia || 0}</p>
                </div>
              </div>
            </div>

            {empresa.notas_internas && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600 mb-1">Notas Internas:</p>
                <p className="text-sm text-gray-700">{empresa.notas_internas}</p>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-1" />
                Ver Detalhes
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4 mr-1" />
                Nova Cadência
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
