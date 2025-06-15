
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEmpresaDetalhada } from "@/hooks/useCadencias";
import { CadenceActions } from "./CadenceActions";
import { CadenceTimeline } from "./CadenceTimeline";
import { Building2, Clock, MessageSquare, Calendar, Settings } from "lucide-react";

interface EmpresaDetalhesProps {
  empresaId: number;
  onClose: () => void;
}

export const EmpresaDetalhes = ({ empresaId, onClose }: EmpresaDetalhesProps) => {
  const { data: empresa, isLoading } = useEmpresaDetalhada(empresaId);

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Carregando detalhes...</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!empresa) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Empresa não encontrada</DialogTitle>
          </DialogHeader>
          <p>Não foi possível carregar os detalhes da empresa.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>
              {empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="actions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="actions" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Ações</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="interactions" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Interações</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Agendamentos</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="actions" className="space-y-4 mt-4">
              <CadenceActions 
                empresaId={empresa.id}
                statusCadencia={empresa.status_cadencia_geral || 'apta_para_contato'}
                onActionComplete={() => {
                  // Refresh data after action
                }}
              />
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-4">
              <CadenceTimeline empresaId={empresa.id} />
            </TabsContent>
            
            <TabsContent value="interactions" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p>Interface de interações será implementada na Fase 3</p>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p>Interface de agendamentos será implementada na Fase 3</p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
