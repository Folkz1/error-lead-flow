
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MessageSquare,
  Building2,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type ContatoEmpresa = Tables<'contatos_empresa'>;

interface ContatoDetalhesProps {
  contato: ContatoEmpresa & {
    empresas?: {
      id: number;
      dominio: string;
      nome_empresa_pagina?: string;
      nome_empresa_gmn?: string;
    };
  };
  onVoltar: () => void;
  onEditarContato: () => void;
  onIniciarContato: () => void;
}

export const ContatoDetalhes = ({ 
  contato, 
  onVoltar, 
  onEditarContato, 
  onIniciarContato 
}: ContatoDetalhesProps) => {
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "sem_resposta":
        return <Badge className="bg-yellow-100 text-yellow-800">Sem Resposta</Badge>;
      case "respondido":
        return <Badge className="bg-blue-100 text-blue-800">Respondido</Badge>;
      case "nao_usar":
        return <Badge className="bg-red-100 text-red-800">Não Usar</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "telefone":
      case "whatsapp":
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
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
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {contato.valor_contato.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{contato.valor_contato}</h2>
              <p className="text-gray-600 capitalize">{contato.tipo_contato}</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onEditarContato}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button onClick={onIniciarContato}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Iniciar Contato
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              {getTipoIcon(contato.tipo_contato)}
              <span className="ml-2">Status do Contato</span>
            </span>
            {getStatusBadge(contato.status_contato)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tipo</p>
              <p className="font-medium capitalize">{contato.tipo_contato}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">{contato.status_contato || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fonte</p>
              <p className="font-medium">{contato.fonte_contato || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data de Adição</p>
              <p className="font-medium">
                {contato.data_adicao ? format(new Date(contato.data_adicao), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Empresa */}
      {contato.empresas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Empresa Associada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {contato.empresas.nome_empresa_pagina || contato.empresas.nome_empresa_gmn || contato.empresas.dominio}
                </h3>
                <p className="text-gray-600">{contato.empresas.dominio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações do Contato */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Contato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Valor do Contato</p>
                <p className="font-medium text-lg">{contato.valor_contato}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo de Contato</p>
                <div className="flex items-center space-x-2">
                  {getTipoIcon(contato.tipo_contato)}
                  <span className="font-medium capitalize">{contato.tipo_contato}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Descrição</p>
                <p className="font-medium">{contato.descricao || 'Nenhuma descrição fornecida'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">WhatsApp Business</p>
                <div className="flex items-center space-x-2">
                  {contato.whatsappbusiness ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="font-medium">
                    {contato.whatsappbusiness ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">WhatsApp Válido</p>
                <div className="flex items-center space-x-2">
                  {contato.whatsapp_valido ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="font-medium">
                    {contato.whatsapp_valido ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fonte GMN</p>
                <div className="flex items-center space-x-2">
                  {contato.gmn ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="font-medium">
                    {contato.gmn ? 'Sim' : 'Não'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {contato.tipo_contato.toLowerCase() === 'email' && (
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Enviar E-mail
              </Button>
            )}
            {(contato.tipo_contato.toLowerCase() === 'telefone' || 
              contato.tipo_contato.toLowerCase() === 'whatsapp') && (
              <>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </>
            )}
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Follow-up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
