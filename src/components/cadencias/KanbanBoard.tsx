
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  MessageSquare,
  Pause,
  Play,
  Eye
} from "lucide-react";
import { useCadencias } from "@/hooks/useCadencias";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

interface KanbanBoardProps {
  onEmpresaClick: (empresaId: number) => void;
}

export const KanbanBoard = ({ onEmpresaClick }: KanbanBoardProps) => {
  const { data: empresas, isLoading, error } = useCadencias();

  const statusColunas = {
    'apta_para_contato': { 
      label: 'Apta para Contato', 
      color: 'bg-blue-100 text-blue-800' 
    },
    'cadencia_dia1_ativa': { 
      label: 'Cadência Dia 1', 
      color: 'bg-green-100 text-green-800' 
    },
    'aguardando_reforco_webhook_erro_dia_seguinte': { 
      label: 'Aguardando Reforço', 
      color: 'bg-yellow-100 text-yellow-800' 
    },
    'interagindo_wa': { 
      label: 'Interagindo WA', 
      color: 'bg-purple-100 text-purple-800' 
    },
    'agendamento_realizado_wa': { 
      label: 'Agendamento Realizado', 
      color: 'bg-emerald-100 text-emerald-800' 
    },
    'sucesso_contato_realizado': { 
      label: 'Sucesso - Contato', 
      color: 'bg-green-100 text-green-800' 
    },
    'nao_perturbe': { 
      label: 'Não Perturbe', 
      color: 'bg-red-100 text-red-800' 
    },
    'fluxo_concluido_sem_resposta': { 
      label: 'Concluído s/ Resposta', 
      color: 'bg-gray-100 text-gray-800' 
    }
  };

  const agruparPorStatus = () => {
    if (!empresas) return {};
    
    const grupos: Record<string, typeof empresas> = {};
    
    Object.keys(statusColunas).forEach(status => {
      grupos[status] = [];
    });
    
    empresas.forEach(empresa => {
      const status = empresa.status_cadencia_geral || 'apta_para_contato';
      if (grupos[status]) {
        grupos[status].push(empresa);
      }
    });
    
    return grupos;
  };

  const calcularTempoDecorrido = (timestamp: string) => {
    const agora = new Date();
    const data = new Date(timestamp);
    const diff = agora.getTime() - data.getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    
    if (horas < 1) return 'há poucos minutos';
    if (horas === 1) return 'há 1 hora';
    if (horas < 24) return `há ${horas}h`;
    
    const dias = Math.floor(horas / 24);
    return `há ${dias}d`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Erro ao carregar cadências: {error.message}
      </div>
    );
  }

  const gruposStatus = agruparPorStatus();

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {Object.entries(statusColunas).map(([status, config]) => (
        <div key={status} className="flex-shrink-0 w-80">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{config.label}</h3>
              <Badge variant="secondary">
                {gruposStatus[status]?.length || 0}
              </Badge>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {gruposStatus[status]?.map((empresa) => (
                <Card 
                  key={empresa.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onEmpresaClick(empresa.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium truncate">
                        {empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}
                      </CardTitle>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Pause className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <Building2 className="h-3 w-3 mr-1" />
                        <span className="truncate">{empresa.dominio}</span>
                      </div>
                      
                      {empresa.eventos_erro && empresa.eventos_erro.length > 0 && (
                        <div className="flex items-center text-xs text-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          <span>{empresa.eventos_erro[0].tipo_erro_site}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {empresa.data_ultima_atualizacao && 
                            calcularTempoDecorrido(empresa.data_ultima_atualizacao)
                          }
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {empresa.contador_total_tentativas_cadencia || 0} tentativas
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {empresa.agendamentos && empresa.agendamentos.length > 0 && (
                          <div className="flex items-center text-xs text-green-600">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Agendamento</span>
                          </div>
                        )}
                        
                        {empresa.interacoes && empresa.interacoes.length > 0 && (
                          <div className="flex items-center text-xs text-blue-600">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>{empresa.interacoes.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!gruposStatus[status] || gruposStatus[status].length === 0) && (
                <div className="text-center text-gray-500 text-sm py-8">
                  Nenhuma empresa neste status
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
