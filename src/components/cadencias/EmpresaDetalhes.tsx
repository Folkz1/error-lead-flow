
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, X, Mail, Phone, MessageSquare, Calendar, AlertTriangle, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmpresaDetalhesProps {
  empresaId: number;
  onClose: () => void;
}

export const EmpresaDetalhes = ({ empresaId, onClose }: EmpresaDetalhesProps) => {
  const { data: empresa, isLoading } = useQuery({
    queryKey: ['empresa-detalhes', empresaId],
    queryFn: async () => {
      console.log('Buscando detalhes da empresa:', empresaId);
      
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });

  const { data: contatos } = useQuery({
    queryKey: ['empresa-contatos', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contatos_empresa')
        .select('*')
        .eq('empresa_id', empresaId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaId,
  });

  const { data: interacoes } = useQuery({
    queryKey: ['empresa-interacoes', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interacoes')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('timestamp_criacao', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
    enabled: !!empresaId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso_contato_realizado':
        return 'bg-green-100 text-green-800';
      case 'apta_para_nova_cadencia':
        return 'bg-blue-100 text-blue-800';
      case 'nao_perturbe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getContactIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return Mail;
      case 'telefone': return Phone;
      case 'whatsapp': return MessageSquare;
      default: return Phone;
    }
  };

  if (isLoading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!empresa) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>{empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Domínio</p>
                  <p className="text-sm text-gray-900">{empresa.dominio}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">Status da Cadência</p>
                  <Badge className={getStatusColor(empresa.status_cadencia_geral || '')}>
                    {empresa.status_cadencia_geral || 'N/A'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Categoria GMB</p>
                  <p className="text-sm text-gray-900">{empresa.gmn_categoria || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Tentativas de Cadência</p>
                  <p className="text-sm text-gray-900">{empresa.contador_total_tentativas_cadencia || 0}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Data de Criação</p>
                  <p className="text-sm text-gray-900">
                    {empresa.data_criacao && format(new Date(empresa.data_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600">Última Atualização</p>
                  <p className="text-sm text-gray-900">
                    {empresa.data_ultima_atualizacao && format(new Date(empresa.data_ultima_atualizacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>

              {empresa.notas_internas && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">Notas Internas</p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{empresa.notas_internas}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contatos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Contatos ({contatos?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contatos && contatos.length > 0 ? (
                <div className="space-y-3">
                  {contatos.map((contato) => {
                    const ContactIcon = getContactIcon(contato.tipo_contato);
                    return (
                      <div key={contato.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ContactIcon className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">{contato.valor_contato}</p>
                            <p className="text-xs text-gray-600">{contato.tipo_contato}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{contato.status_contato || 'N/A'}</Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum contato cadastrado</p>
              )}
            </CardContent>
          </Card>

          {/* Interações Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Interações Recentes ({interacoes?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interacoes && interacoes.length > 0 ? (
                <div className="space-y-3">
                  {interacoes.map((interacao) => (
                    <div key={interacao.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium">{interacao.canal} - {interacao.status_interacao}</p>
                          <p className="text-xs text-gray-600">
                            {interacao.timestamp_criacao && format(new Date(interacao.timestamp_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Ver Detalhes</Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma interação registrada</p>
              )}
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex space-x-2">
            <Button className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Nova Cadência
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Nova Interação
            </Button>
            <Button variant="outline" className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pausar Cadência
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
