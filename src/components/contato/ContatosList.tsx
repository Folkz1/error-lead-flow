
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Mail, 
  Phone, 
  MessageSquare,
  Building2,
  Eye,
  Edit,
  MoreHorizontal
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useContatos } from "@/hooks/useContatos";
import { useState } from "react";
import { ContatoDetalhes } from "./ContatoDetalhes";

interface ContatosListProps {
  searchTerm?: string;
  empresaId?: number;
}

export const ContatosList = ({ searchTerm, empresaId }: ContatosListProps) => {
  const { data: contatos, isLoading, error } = useContatos(empresaId);
  const [contatoDetalhes, setContatoDetalhes] = useState<any>(null);
  const [view, setView] = useState<'list' | 'detalhes'>('list');

  const filteredContatos = contatos?.filter(contato => 
    !searchTerm || 
    contato.valor_contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.empresas?.nome_empresa_pagina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.empresas?.nome_empresa_gmn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.empresas?.dominio.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (view === 'detalhes' && contatoDetalhes) {
    return (
      <ContatoDetalhes
        contato={contatoDetalhes}
        onVoltar={() => {
          setView('list');
          setContatoDetalhes(null);
        }}
        onEditarContato={() => {
          // TODO: Implementar edição
          console.log('Editar contato:', contatoDetalhes.id);
        }}
        onIniciarContato={() => {
          // TODO: Implementar início de contato
          console.log('Iniciar contato:', contatoDetalhes.id);
        }}
      />
    );
  }

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando contatos...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">Erro ao carregar contatos: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Contatos ({filteredContatos.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contato</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Adição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContatos.map((contato) => (
                <TableRow key={contato.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {contato.valor_contato.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{contato.valor_contato}</div>
                        {contato.descricao && (
                          <div className="text-sm text-gray-600">{contato.descricao}</div>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          {contato.whatsappbusiness && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              WhatsApp Business
                            </Badge>
                          )}
                          {contato.gmn && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              GMN
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-900">
                          {contato.empresas?.nome_empresa_pagina || contato.empresas?.nome_empresa_gmn || contato.empresas?.dominio}
                        </span>
                        <div className="text-sm text-gray-600">{contato.empresas?.dominio}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{contato.tipo_contato}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(contato.status_contato)}</TableCell>
                  <TableCell className="text-gray-600">{formatDate(contato.data_adicao)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setContatoDetalhes(contato);
                          setView('detalhes');
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredContatos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum contato encontrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
