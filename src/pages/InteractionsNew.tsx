
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractionDetail } from "@/components/interactions/InteractionDetail";
import { MessageApprovalQueue } from "@/components/interactions/MessageApprovalQueue";
import { SessionsList } from "@/components/interactions/SessionsList";
import { SessionChat } from "@/components/interactions/SessionChat";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const InteractionsNew = () => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<number | null>(null);
  const [interacaoDetalhada, setInteracaoDetalhada] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCanal, setFiltroCanal] = useState<string>("todos");

  // Buscar empresas com interações
  const { data: empresasComInteracoes, isLoading: empresasLoading, refetch: refetchEmpresas } = useQuery({
    queryKey: ['empresas-interacoes', searchTerm, filtroCanal],
    queryFn: async () => {
      console.log('Buscando empresas com interações...');
      
      let query = supabase
        .from('empresas')
        .select(`
          id,
          dominio,
          nome_empresa_pagina,
          nome_empresa_gmn,
          status_cadencia_geral,
          interacoes!fk_interacoes_empresa_id (
            id,
            canal,
            status_interacao,
            timestamp_criacao,
            direcao,
            resposta_ia,
            log_resumido_ia
          )
        `)
        .not('interacoes', 'is', null);
      
      if (searchTerm) {
        query = query.or(`dominio.ilike.%${searchTerm}%,nome_empresa_pagina.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('id', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar empresas com interações:', error);
        throw error;
      }
      
      // Filtrar por canal se necessário
      let empresasFiltradas = data || [];
      if (filtroCanal !== 'todos') {
        empresasFiltradas = empresasFiltradas.filter(empresa =>
          empresa.interacoes?.some((i: any) => i.canal === filtroCanal)
        );
      }
      
      console.log('Empresas com interações encontradas:', empresasFiltradas.length);
      return empresasFiltradas;
    },
  });

  // Buscar interações da empresa selecionada
  const { data: interacoesEmpresa, refetch: refetchInteracoes } = useQuery({
    queryKey: ['interacoes-empresa', empresaSelecionada],
    queryFn: async () => {
      if (!empresaSelecionada) return [];
      
      console.log('Buscando interações da empresa:', empresaSelecionada);
      
      const { data, error } = await supabase
        .from('interacoes')
        .select('*')
        .eq('empresa_id', empresaSelecionada)
        .order('timestamp_criacao', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar interações:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!empresaSelecionada,
  });

  // Buscar mensagens pendentes de aprovação
  const { data: mensagensPendentes, refetch: refetchPendentes } = useQuery({
    queryKey: ['mensagens-pendentes'],
    queryFn: async () => {
      console.log('Buscando mensagens pendentes...');
      
      const { data, error } = await supabase
        .from('interacoes')
        .select('*')
        .eq('status_interacao', 'pendente_aprovacao')
        .order('timestamp_criacao', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar mensagens pendentes:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleRefreshAll = () => {
    refetchEmpresas();
    refetchInteracoes();
    refetchPendentes();
  };

  const handleEmpresaClick = (empresaId: number) => {
    setEmpresaSelecionada(empresaId);
    setInteracaoDetalhada(null);
  };

  const handleInteracaoClick = (interacao: any) => {
    setInteracaoDetalhada(interacao);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'enviada':
        return 'bg-green-100 text-green-800';
      case 'entregue':
        return 'bg-blue-100 text-blue-800';
      case 'lida':
        return 'bg-purple-100 text-purple-800';
      case 'respondida':
        return 'bg-emerald-100 text-emerald-800';
      case 'erro':
        return 'bg-red-100 text-red-800';
      case 'pendente_aprovacao':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (canal: string) => {
    switch (canal.toLowerCase()) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'email':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'telefone':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  // Se há interação detalhada selecionada, mostrar detalhes
  if (interacaoDetalhada) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <InteractionDetail
          interacao={interacaoDetalhada}
          onVoltar={() => setInteracaoDetalhada(null)}
          onResponder={() => {
            setInteracaoDetalhada(null);
            setEmpresaSelecionada(interacaoDetalhada.empresa_id);
          }}
        />
      </div>
    );
  }

  // Se há empresa selecionada, mostrar chat
  if (empresaSelecionada) {
    const empresaAtual = empresasComInteracoes?.find(e => e.id === empresaSelecionada);
    
    return (
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setEmpresaSelecionada(null)}>
              ← Voltar para Lista
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Chat Unificado - {empresaAtual?.nome_empresa_pagina || empresaAtual?.dominio}
              </h1>
              <p className="text-muted-foreground">
                Chat integrado com histórico do N8N e sistema de interações
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleRefreshAll}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Chat Interface */}
        <ChatInterface
          empresaId={empresaSelecionada}
          onRefresh={refetchInteracoes}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Interações e Chat</h1>
          <p className="text-muted-foreground">
            Gerencie conversas, aprove mensagens e acompanhe interações
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefreshAll}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conversations" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Conversas</span>
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Aprovações</span>
            {mensagensPendentes && mensagensPendentes.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {mensagensPendentes.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Análises</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por domínio ou nome da empresa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex space-x-2">
                  {['todos', 'whatsapp', 'email', 'telefone'].map((canal) => (
                    <Button
                      key={canal}
                      variant={filtroCanal === canal ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFiltroCanal(canal)}
                    >
                      {canal === 'todos' ? 'Todos' : canal.charAt(0).toUpperCase() + canal.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Empresas com Interações */}
          <Card>
            <CardHeader>
              <CardTitle>Empresas com Interações Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              {empresasLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : empresasComInteracoes && empresasComInteracoes.length > 0 ? (
                <div className="space-y-4">
                  {empresasComInteracoes.map((empresa) => (
                    <Card
                      key={empresa.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleEmpresaClick(empresa.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {empresa.nome_empresa_pagina || empresa.dominio}
                            </h3>
                            <p className="text-sm text-gray-600">{empresa.dominio}</p>
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-500">
                                {empresa.interacoes?.length || 0} mensagens
                              </span>
                              <span className="text-sm text-gray-500">
                                Última: {empresa.interacoes?.[0] 
                                  ? format(new Date(empresa.interacoes[0].timestamp_criacao), 'dd/MM HH:mm', { locale: ptBR })
                                  : 'N/A'
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {empresa.interacoes?.slice(0, 3).map((interacao: any) => (
                              <div
                                key={interacao.id}
                                className="flex items-center space-x-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInteracaoClick(interacao);
                                }}
                              >
                                {getChannelIcon(interacao.canal)}
                                <Badge className={getStatusColor(interacao.status_interacao)}>
                                  {interacao.status_interacao}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>Nenhuma empresa com interações encontrada</p>
                  <p className="text-sm">As empresas aparecerão aqui quando houver mensagens</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          <MessageApprovalQueue
            mensagensPendentes={mensagensPendentes || []}
            onRefresh={refetchPendentes}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Análises de interações serão implementadas na Fase 4</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractionsNew;
