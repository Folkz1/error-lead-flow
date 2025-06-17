
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const RecentActivity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<number | null>(null);

  const { data: recentActivity, isLoading } = useQuery({
    queryKey: ['recent-activity', searchTerm],
    queryFn: async () => {
      console.log('Buscando atividade recente');
      
      let query = supabase
        .from('empresas')
        .select(`
          id,
          nome_empresa_gmn,
          nome_empresa_pagina,
          dominio,
          status_cadencia_geral,
          data_ultima_atualizacao,
          tipo_ultimo_erro_site
        `)
        .not('status_cadencia_geral', 'is', null)
        .order('data_ultima_atualizacao', { ascending: false })
        .limit(50);

      if (searchTerm && searchTerm.trim() !== '') {
        query = query.or(`nome_empresa_gmn.ilike.%${searchTerm}%,nome_empresa_pagina.ilike.%${searchTerm}%,dominio.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    },
  });

  const getEmpresaName = (empresa: any) => {
    return empresa.nome_empresa_gmn || empresa.nome_empresa_pagina || empresa.dominio;
  };

  const getStatusBadgeColor = (status: string) => {
    if (status.includes('ativa')) return 'bg-blue-100 text-blue-800';
    if (status.includes('sucesso')) return 'bg-green-100 text-green-800';
    if (status.includes('interagindo')) return 'bg-yellow-100 text-yellow-800';
    if (status.includes('nao_perturbe') || status.includes('falha')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getUltimaAcao = (status: string) => {
    const acaoMap: { [key: string]: string } = {
      'cadencia_dia1_ativa': 'WhatsApp Dia 1 enviado',
      'cadencia_dia2_ativa': 'WhatsApp Dia 2 enviado',
      'cadencia_dia3_ativa': 'WhatsApp Dia 3 enviado',
      'interagindo_wa': 'Resposta recebida',
      'atendimento_humano_solicitado_wa': 'Solicitou atendimento humano',
      'sucesso_contato_realizado': 'Convertido em lead',
      'apta_para_nova_cadencia': 'Pronta para nova cadência',
      'aguardando_reforco1_dia1': 'Aguardando reforço 1 - Dia 1',
      'aguardando_reforco2_dia1': 'Aguardando reforço 2 - Dia 1',
      'dia1_concluido_aguardando_dia2': 'Dia 1 concluído',
      'nao_perturbe': 'Solicitou não perturbe',
      'fluxo_concluido_sem_resposta': 'Fluxo finalizado'
    };
    
    return acaoMap[status] || status;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log de Operações - Atividade Recente</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome da empresa ou domínio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>Status Atual</TableHead>
                <TableHead>Última Ação</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity?.map((empresa) => (
                <TableRow key={empresa.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{getEmpresaName(empresa)}</div>
                      <div className="text-sm text-blue-600 hover:underline">
                        <a 
                          href={`https://${empresa.dominio}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1"
                        >
                          <span>{empresa.dominio}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(empresa.status_cadencia_geral)}>
                      {empresa.status_cadencia_geral}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{getUltimaAcao(empresa.status_cadencia_geral)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {empresa.data_ultima_atualizacao && 
                        format(new Date(empresa.data_ultima_atualizacao), 'dd/MM HH:mm', { locale: ptBR })
                      }
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedEmpresa(empresa.id)}
                    >
                      Ver Histórico
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {(!recentActivity || recentActivity.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma atividade encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
