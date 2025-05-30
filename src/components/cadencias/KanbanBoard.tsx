
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KanbanBoardProps {
  onEmpresaClick: (empresaId: number) => void;
}

export const KanbanBoard = ({ onEmpresaClick }: KanbanBoardProps) => {
  const { data: empresas, isLoading } = useQuery({
    queryKey: ['kanban-empresas'],
    queryFn: async () => {
      console.log('Buscando empresas para kanban...');
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .not('status_cadencia_geral', 'is', null)
        .order('data_ultima_atualizacao', { ascending: false });

      if (error) throw error;

      console.log('Empresas kanban encontradas:', data?.length || 0);
      return data || [];
    },
  });

  const statusColumns = [
    { 
      key: 'apta_para_contato', 
      title: 'Apta para Contato', 
      color: 'bg-blue-50 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      key: 'em_cadencia', 
      title: 'Em Cadência', 
      color: 'bg-yellow-50 border-yellow-200',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    { 
      key: 'aguardando_resposta', 
      title: 'Aguardando Resposta', 
      color: 'bg-orange-50 border-orange-200',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    { 
      key: 'sucesso_contato_realizado', 
      title: 'Sucesso', 
      color: 'bg-green-50 border-green-200',
      badgeColor: 'bg-green-100 text-green-800'
    },
    { 
      key: 'nao_perturbe', 
      title: 'Não Perturbe', 
      color: 'bg-red-50 border-red-200',
      badgeColor: 'bg-red-100 text-red-800'
    }
  ];

  const groupEmpresasByStatus = (empresas: any[]) => {
    return statusColumns.reduce((acc, column) => {
      acc[column.key] = empresas.filter(empresa => 
        empresa.status_cadencia_geral === column.key
      );
      return acc;
    }, {} as Record<string, any[]>);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusColumns.map((column) => (
          <div key={column.key} className={`p-4 rounded-lg border-2 ${column.color}`}>
            <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mb-3">
                <div className="h-20 bg-white rounded shadow animate-pulse"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!empresas) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Nenhuma empresa encontrada</p>
      </div>
    );
  }

  const groupedEmpresas = groupEmpresasByStatus(empresas);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statusColumns.map((column) => (
        <div key={column.key} className={`p-4 rounded-lg border-2 ${column.color}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <Badge variant="secondary">
              {groupedEmpresas[column.key]?.length || 0}
            </Badge>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {groupedEmpresas[column.key]?.map((empresa) => (
              <Card 
                key={empresa.id} 
                className="cursor-pointer hover:shadow-md transition-shadow bg-white"
                onClick={() => onEmpresaClick(empresa.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-600" />
                    <CardTitle className="text-sm truncate">
                      {empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Building2 className="h-3 w-3" />
                      <span className="truncate">{empresa.dominio}</span>
                    </div>
                    
                    {empresa.tipo_ultimo_erro_site && (
                      <div className="flex items-center space-x-1 text-xs text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="truncate">{empresa.tipo_ultimo_erro_site}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {empresa.data_ultima_atualizacao && 
                          format(new Date(empresa.data_ultima_atualizacao), 'dd/MM HH:mm', { locale: ptBR })
                        }
                      </span>
                    </div>
                    
                    {empresa.contador_total_tentativas_cadencia > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {empresa.contador_total_tentativas_cadencia} tentativas
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {(!groupedEmpresas[column.key] || groupedEmpresas[column.key].length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm">Nenhuma empresa</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
