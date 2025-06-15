
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Clock, 
  AlertTriangle,
  CheckCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CadenceActionsProps {
  empresaId: number;
  statusCadencia: string;
  onActionComplete?: () => void;
}

export const CadenceActions = ({ 
  empresaId, 
  statusCadencia, 
  onActionComplete 
}: CadenceActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateCadenceMutation = useMutation({
    mutationFn: async ({ newStatus, action }: { newStatus: string; action: string }) => {
      console.log(`${action} cadência para empresa ${empresaId}`);
      
      const updates: any = {
        status_cadencia_geral: newStatus,
        data_ultima_atualizacao: new Date().toISOString()
      };
      
      // Se iniciar cadência, definir próxima tentativa
      if (action === 'iniciar') {
        updates.timestamp_proxima_tentativa_permitida = new Date().toISOString();
        updates.contador_total_tentativas_cadencia = 0;
      }
      
      const { data, error } = await supabase
        .from('empresas')
        .update(updates)
        .eq('id', empresaId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Cadência atualizada!",
        description: `Status alterado para: ${getStatusLabel(variables.newStatus)}`,
      });
      queryClient.invalidateQueries({ queryKey: ['kanban-empresas'] });
      queryClient.invalidateQueries({ queryKey: ['cadence-stats'] });
      onActionComplete?.();
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar cadência",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAction = (action: string, newStatus: string) => {
    setIsLoading(true);
    updateCadenceMutation.mutate({ newStatus, action });
    setIsLoading(false);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'apta_para_contato': 'Apta para Contato',
      'em_cadencia': 'Em Cadência',
      'aguardando_resposta': 'Aguardando Resposta',
      'sucesso_contato_realizado': 'Sucesso',
      'nao_perturbe': 'Não Perturbe'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'apta_para_contato': 'bg-blue-100 text-blue-800',
      'em_cadencia': 'bg-yellow-100 text-yellow-800',
      'aguardando_resposta': 'bg-orange-100 text-orange-800',
      'sucesso_contato_realizado': 'bg-green-100 text-green-800',
      'nao_perturbe': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const canStart = statusCadencia === 'apta_para_contato';
  const canPause = statusCadencia === 'em_cadencia';
  const canStop = ['em_cadencia', 'aguardando_resposta'].includes(statusCadencia);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Controle de Cadência</span>
          <Badge className={getStatusColor(statusCadencia)}>
            {getStatusLabel(statusCadencia)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {canStart && (
            <Button
              onClick={() => handleAction('iniciar', 'em_cadencia')}
              disabled={isLoading || updateCadenceMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Cadência
            </Button>
          )}
          
          {canPause && (
            <Button
              onClick={() => handleAction('pausar', 'apta_para_contato')}
              disabled={isLoading || updateCadenceMutation.isPending}
              variant="outline"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </Button>
          )}
          
          {canStop && (
            <Button
              onClick={() => handleAction('parar', 'nao_perturbe')}
              disabled={isLoading || updateCadenceMutation.isPending}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              Parar Cadência
            </Button>
          )}
          
          <Button
            onClick={() => handleAction('marcar_sucesso', 'sucesso_contato_realizado')}
            disabled={isLoading || updateCadenceMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Sucesso
          </Button>
          
          <Button
            onClick={() => handleAction('aguardar', 'aguardando_resposta')}
            disabled={isLoading || updateCadenceMutation.isPending}
            variant="outline"
          >
            <Clock className="h-4 w-4 mr-2" />
            Aguardar Resposta
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
        
        {statusCadencia === 'nao_perturbe' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                Esta empresa está marcada como "Não Perturbe"
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
