
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KanbanBoardProps {
  onEmpresaClick: (empresaId: number) => void;
  searchTerm?: string;
  viewMode?: 'principal' | 'atividade';
}

export const KanbanBoard = ({ onEmpresaClick, searchTerm, viewMode = 'principal' }: KanbanBoardProps) => {
  const { data: empresas, isLoading, refetch } = useQuery({
    queryKey: ['kanban-empresas', searchTerm, viewMode],
    queryFn: async () => {
      console.log('Buscando empresas para kanban com filtro:', searchTerm, 'modo:', viewMode);
      
      let query = supabase
        .from('empresas')
        .select('*')
        .not('status_cadencia_geral', 'is', null)
        .order('data_ultima_atualizacao', { ascending: false });

      // Aplicar filtro específico para "Atividade do Dia"
      if (viewMode === 'atividade') {
        query = query.in('status_cadencia_geral', [
          'cadencia_dia1_ativa',
          'cadencia_dia2_ativa', 
          'cadencia_dia3_ativa',
          'interagindo_wa'
        ]);
      }

      // Aplicar filtro de busca se fornecido
      if (searchTerm && searchTerm.trim() !== '') {
        query = query.or(`dominio.ilike.%${searchTerm}%,nome_empresa_pagina.ilike.%${searchTerm}%,nome_empresa_gmn.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log('Empresas kanban encontradas:', data?.length || 0);
      return data || [];
    },
  });

  // Configuração das colunas para Visão Principal
  const principalColumns = [
    { 
      key: 'na_fila', 
      title: 'Na Fila', 
      color: 'bg-gray-50 border-gray-200',
      badgeColor: 'bg-gray-100 text-gray-800',
      statuses: ['apta_para_nova_cadencia']
    },
    { 
      key: 'dia_1', 
      title: 'Dia 1', 
      color: 'bg-blue-50 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800',
      statuses: [
        'cadencia_dia1_ativa',
        'aguardando_reforco1_dia1',
        'aguardando_reforco2_dia1'
      ]
    },
    { 
      key: 'dia_2', 
      title: 'Dia 2', 
      color: 'bg-indigo-50 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      statuses: [
        'dia1_concluido_aguardando_dia2',
        'cadencia_dia2_ativa',
        'aguardando_reforco1_dia2',
        'aguardando_reforco2_dia2'
      ]
    },
    { 
      key: 'dia_3', 
      title: 'Dia 3', 
      color: 'bg-purple-50 border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-800',
      statuses: [
        'dia2_concluido_aguardando_dia3',
        'cadencia_dia3_ativa',
        'dia3_concluido_aguardando_finalizacao'
      ]
    },
    { 
      key: 'em_atendimento_sucesso', 
      title: 'Em Atendimento / Sucesso', 
      color: 'bg-green-50 border-green-200',
      badgeColor: 'bg-green-100 text-green-800',
      statuses: [
        'interagindo_wa',
        'atendimento_humano_solicitado_wa',
        'followup_manual_agendado_wa',
        'sucesso_contato_realizado'
      ]
    },
    { 
      key: 'finalizado_falha', 
      title: 'Finalizado / Falha', 
      color: 'bg-red-50 border-red-200',
      badgeColor: 'bg-red-100 text-red-800',
      statuses: [
        'fluxo_concluido_sem_resposta',
        'nao_perturbe',
        'erro_resolvido_parar_cadencia',
        'falha_max_cadencias_atingida'
      ]
    }
  ];

  // Configuração das colunas para Atividade do Dia
  const atividadeColumns = [
    { 
      key: 'cadencia_dia1_ativa', 
      title: 'Dia 1 - Ativo ⚡', 
      color: 'bg-blue-50 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-800',
      statuses: ['cadencia_dia1_ativa']
    },
    { 
      key: 'cadencia_dia2_ativa', 
      title: 'Dia 2 - Ativo ⚡', 
      color: 'bg-indigo-50 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      statuses: ['cadencia_dia2_ativa']
    },
    { 
      key: 'cadencia_dia3_ativa', 
      title: 'Dia 3 - Ativo ⚡', 
      color: 'bg-purple-50 border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-800',
      statuses: ['cadencia_dia3_ativa']
    },
    { 
      key: 'interagindo_wa', 
      title: 'Interagindo WhatsApp ⚡', 
      color: 'bg-green-50 border-green-200',
      badgeColor: 'bg-green-100 text-green-800',
      statuses: ['interagindo_wa']
    }
  ];

  const currentColumns = viewMode === 'principal' ? principalColumns : atividadeColumns;

  const groupEmpresasByStatus = (empresas: any[]) => {
    return currentColumns.reduce((acc, column) => {
      acc[column.key] = empresas.filter(empresa => 
        column.statuses.includes(empresa.status_cadencia_geral)
      );
      return acc;
    }, {} as Record<string, any[]>);
  };

  const getEmpresaTitle = (empresa: any) => {
    return empresa.nome_empresa_gmn || empresa.nome_empresa_pagina || empresa.dominio;
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${currentColumns.length} gap-4`}>
        {currentColumns.map((column) => (
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

  // Expor refetch para uso externo
  (window as any).refetchKanban = refetch;

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${currentColumns.length} gap-4`}>
      {currentColumns.map((column) => (
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
                      {getEmpresaTitle(empresa)}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-xs text-blue-600">
                      <Building2 className="h-3 w-3" />
                      <a 
                        href={`https://${empresa.dominio}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {empresa.dominio}
                      </a>
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

                    {/* Mostrar status atual detalhado */}
                    <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      {empresa.status_cadencia_geral}
                    </div>
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
