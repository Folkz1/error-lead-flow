
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  Star, 
  Calendar,
  ArrowLeft,
  Edit,
  MessageSquare,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type Empresa = Tables<'empresas'>;

interface EmpresaDetalhesProps {
  empresa: Empresa;
  onVoltar: () => void;
  onEditarEmpresa: () => void;
  onVerContatos: () => void;
  onVerHistorico: () => void;
}

export const EmpresaDetalhes = ({ 
  empresa, 
  onVoltar, 
  onEditarEmpresa, 
  onVerContatos, 
  onVerHistorico 
}: EmpresaDetalhesProps) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onVoltar}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold">
              {empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio}
            </h2>
            <p className="text-gray-600">{empresa.dominio}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onEditarEmpresa}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={onVerContatos}>
            <Users className="h-4 w-4 mr-2" />
            Contatos
          </Button>
          <Button variant="outline" onClick={onVerHistorico}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Status da Empresa
            <Badge className={getStatusColor(empresa.status_cadencia_geral || '')}>
              {getStatusLabel(empresa.status_cadencia_geral || '')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status Geral</p>
              <p className="font-medium">{empresa.status_geral || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tentativas de Cadência</p>
              <p className="font-medium">{empresa.contador_total_tentativas_cadencia || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status Scraping T1</p>
              <p className="font-medium">{empresa.status_scraping_t1 || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status Scraping T2</p>
              <p className="font-medium">{empresa.status_scraping_t2 || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Nome da Empresa</p>
                <p className="font-medium">{empresa.nome_empresa_pagina || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nome GMN</p>
                <p className="font-medium">{empresa.nome_empresa_gmn || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Domínio</p>
                <p className="font-medium">{empresa.dominio}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">URL Inicial</p>
                <p className="font-medium">{empresa.url_inicial || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Bitrix Lead ID</p>
                <p className="font-medium">{empresa.bitrix_lead_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Criação</p>
                <p className="font-medium">
                  {empresa.data_criacao ? format(new Date(empresa.data_criacao), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Atualização</p>
                <p className="font-medium">
                  {empresa.data_ultima_atualizacao ? format(new Date(empresa.data_ultima_atualizacao), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Google My Business */}
      {empresa.gmn_encontrado && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Informações do Google My Business
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium">{empresa.gmn_endereco || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{empresa.gmn_telefone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <p className="font-medium">{empresa.gmn_website || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Categoria</p>
                  <p className="font-medium">{empresa.gmn_categoria || 'N/A'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium">{empresa.gmn_rating || 0}</span>
                  <span className="text-gray-600">({empresa.gmn_ratings_total || 0} avaliações)</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Place ID</p>
                  <p className="font-medium text-xs">{empresa.gmn_place_id || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados de Scraping */}
      <Card>
        <CardHeader>
          <CardTitle>Dados de Scraping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Telefones Encontrados</p>
                <p className="font-medium">{empresa.telefones_scraping || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">E-mails Encontrados</p>
                <p className="font-medium">{empresa.emails_scraping || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Links Sociais</p>
                <p className="font-medium">{empresa.links_sociais_scraping || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas Internas */}
      {empresa.notas_internas && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Internas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{empresa.notas_internas}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
