
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Calendar, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  Save
} from "lucide-react";

export const CadenceRules = () => {
  const [formData, setFormData] = useState({
    horario_inicio_funcionamento: '09:00',
    horario_fim_funcionamento: '18:00',
    dias_semana_funcionamento: ['seg', 'ter', 'qua', 'qui', 'sex'],
    max_cadencias_por_empresa: 7,
    cooldown_entre_cadencias_dias: 2,
    max_mensagens_dia1: 3,
    max_mensagens_dia2: 3,
    max_mensagens_dia3: 1,
    intervalo_reforco1_horas: 3,
    intervalo_reforco2_horas: 5,
    limite_max_novas_abordagens_dia: 100,
    intervalo_min_entre_mensagens_global_segundos: 60,
    intervalo_max_entre_mensagens_global_segundos: 180,
    ativo: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configuracoes, isLoading } = useQuery({
    queryKey: ['cadence-rules'],
    queryFn: async () => {
      console.log('Buscando configurações de cadência...');
      
      const { data, error } = await supabase
        .from('configuracoes_cadencia')
        .select('*')
        .eq('ativo', true)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar configurações:', error);
        throw error;
      }
      
      return data;
    }
  });

  const updateRulesMutation = useMutation({
    mutationFn: async (rules: typeof formData) => {
      console.log('Atualizando regras de cadência:', rules);
      
      if (configuracoes?.id) {
        // Atualizar configuração existente
        const { data, error } = await supabase
          .from('configuracoes_cadencia')
          .update({
            ...rules,
            data_ultima_atualizacao: new Date().toISOString()
          })
          .eq('id', configuracoes.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Criar nova configuração
        const { data, error } = await supabase
          .from('configuracoes_cadencia')
          .insert({
            ...rules,
            nome_configuracao: 'Configuração Principal'
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast({
        title: "Regras atualizadas!",
        description: "As configurações de cadência foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['cadence-rules'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar regras",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (configuracoes) {
      setFormData({
        horario_inicio_funcionamento: configuracoes.horario_inicio_funcionamento || '09:00',
        horario_fim_funcionamento: configuracoes.horario_fim_funcionamento || '18:00',
        dias_semana_funcionamento: configuracoes.dias_semana_funcionamento || ['seg', 'ter', 'qua', 'qui', 'sex'],
        max_cadencias_por_empresa: configuracoes.max_cadencias_por_empresa || 7,
        cooldown_entre_cadencias_dias: configuracoes.cooldown_entre_cadencias_dias || 2,
        max_mensagens_dia1: configuracoes.max_mensagens_dia1 || 3,
        max_mensagens_dia2: configuracoes.max_mensagens_dia2 || 3,
        max_mensagens_dia3: configuracoes.max_mensagens_dia3 || 1,
        intervalo_reforco1_horas: configuracoes.intervalo_reforco1_horas || 3,
        intervalo_reforco2_horas: configuracoes.intervalo_reforco2_horas || 5,
        limite_max_novas_abordagens_dia: configuracoes.limite_max_novas_abordagens_dia || 100,
        intervalo_min_entre_mensagens_global_segundos: configuracoes.intervalo_min_entre_mensagens_global_segundos || 60,
        intervalo_max_entre_mensagens_global_segundos: configuracoes.intervalo_max_entre_mensagens_global_segundos || 180,
        ativo: configuracoes.ativo ?? true
      });
    }
  }, [configuracoes]);

  const handleSave = () => {
    updateRulesMutation.mutate(formData);
  };

  const diasSemana = [
    { key: 'seg', label: 'Segunda' },
    { key: 'ter', label: 'Terça' },
    { key: 'qua', label: 'Quarta' },
    { key: 'qui', label: 'Quinta' },
    { key: 'sex', label: 'Sexta' },
    { key: 'sab', label: 'Sábado' },
    { key: 'dom', label: 'Domingo' }
  ];

  const toggleDiaSemana = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      dias_semana_funcionamento: prev.dias_semana_funcionamento.includes(dia)
        ? prev.dias_semana_funcionamento.filter(d => d !== dia)
        : [...prev.dias_semana_funcionamento, dia]
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regras de Cadência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Regras de Cadência</span>
          </div>
          <Badge variant={formData.ativo ? "default" : "secondary"}>
            {formData.ativo ? "Ativo" : "Inativo"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Horários de Funcionamento */}
        <div>
          <h3 className="text-lg font-medium flex items-center space-x-2 mb-4">
            <Clock className="h-4 w-4" />
            <span>Horários de Funcionamento</span>
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="horario_inicio">Início</Label>
              <Input
                id="horario_inicio"
                type="time"
                value={formData.horario_inicio_funcionamento}
                onChange={(e) => setFormData(prev => ({ ...prev, horario_inicio_funcionamento: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="horario_fim">Fim</Label>
              <Input
                id="horario_fim"
                type="time"
                value={formData.horario_fim_funcionamento}
                onChange={(e) => setFormData(prev => ({ ...prev, horario_fim_funcionamento: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Dias da Semana */}
        <div>
          <h3 className="text-lg font-medium flex items-center space-x-2 mb-4">
            <Calendar className="h-4 w-4" />
            <span>Dias de Funcionamento</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {diasSemana.map((dia) => (
              <Badge
                key={dia.key}
                variant={formData.dias_semana_funcionamento.includes(dia.key) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleDiaSemana(dia.key)}
              >
                {dia.label}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Limites de Cadência */}
        <div>
          <h3 className="text-lg font-medium mb-4">Limites de Cadência</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_cadencias">Máx. Cadências por Empresa</Label>
              <Input
                id="max_cadencias"
                type="number"
                value={formData.max_cadencias_por_empresa}
                onChange={(e) => setFormData(prev => ({ ...prev, max_cadencias_por_empresa: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="cooldown">Cooldown (dias)</Label>
              <Input
                id="cooldown"
                type="number"
                value={formData.cooldown_entre_cadencias_dias}
                onChange={(e) => setFormData(prev => ({ ...prev, cooldown_entre_cadencias_dias: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Mensagens por Dia */}
        <div>
          <h3 className="text-lg font-medium mb-4">Mensagens por Dia</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="msg_dia1">Dia 1</Label>
              <Input
                id="msg_dia1"
                type="number"
                value={formData.max_mensagens_dia1}
                onChange={(e) => setFormData(prev => ({ ...prev, max_mensagens_dia1: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="msg_dia2">Dia 2</Label>
              <Input
                id="msg_dia2"
                type="number"
                value={formData.max_mensagens_dia2}
                onChange={(e) => setFormData(prev => ({ ...prev, max_mensagens_dia2: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="msg_dia3">Dia 3</Label>
              <Input
                id="msg_dia3"
                type="number"
                value={formData.max_mensagens_dia3}
                onChange={(e) => setFormData(prev => ({ ...prev, max_mensagens_dia3: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Intervalos */}
        <div>
          <h3 className="text-lg font-medium mb-4">Intervalos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="intervalo_min">Intervalo Mín. (segundos)</Label>
              <Input
                id="intervalo_min"
                type="number"
                value={formData.intervalo_min_entre_mensagens_global_segundos}
                onChange={(e) => setFormData(prev => ({ ...prev, intervalo_min_entre_mensagens_global_segundos: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label htmlFor="intervalo_max">Intervalo Máx. (segundos)</Label>
              <Input
                id="intervalo_max"
                type="number"
                value={formData.intervalo_max_entre_mensagens_global_segundos}
                onChange={(e) => setFormData(prev => ({ ...prev, intervalo_max_entre_mensagens_global_segundos: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Controles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
            />
            <Label>Ativar regras de cadência</Label>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={updateRulesMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateRulesMutation.isPending ? 'Salvando...' : 'Salvar Regras'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
