
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Globe, MapPin, Phone, Star } from "lucide-react";
import { useEmpresas } from "@/hooks/useEmpresas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const EmpresasList = () => {
  const { data: empresas, isLoading, error } = useEmpresas();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
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
          <p className="text-red-600">Erro ao carregar empresas: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!empresas || empresas.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-600">Nenhuma empresa encontrada.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso_contato_realizado':
        return 'bg-green-100 text-green-800';
      case 'apta_para_nova_cadencia':
        return 'bg-blue-100 text-blue-800';
      case 'nao_perturbe':
        return 'bg-red-100 text-red-800';
      case 'fluxo_concluido_sem_resposta':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        return status?.replace(/_/g, ' ') || 'N/A';
    }
  };

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
                    <Globe className="h-4 w-4" />
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {empresa.gmn_endereco && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{empresa.gmn_endereco}</span>
                </div>
              )}
              
              {empresa.gmn_telefone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{empresa.gmn_telefone}</span>
                </div>
              )}
              
              {empresa.gmn_rating && (
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{empresa.gmn_rating} ({empresa.gmn_ratings_total} avaliações)</span>
                </div>
              )}
              
              <div className="text-gray-500">
                Tentativas: {empresa.contador_total_tentativas_cadencia || 0}
              </div>
            </div>
            
            {empresa.data_criacao && (
              <div className="mt-3 text-xs text-gray-500">
                Criado em {format(new Date(empresa.data_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
            )}
            
            <div className="mt-4 flex space-x-2">
              <Button size="sm" variant="outline">
                Ver Detalhes
              </Button>
              <Button size="sm" variant="outline">
                Contatos
              </Button>
              <Button size="sm" variant="outline">
                Histórico
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
