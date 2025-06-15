
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/useTemplates";
import { Eye, Save, AlertCircle, Check } from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

type TemplateMensagem = Tables<'templates_mensagens'>;

interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: TemplateMensagem | null;
  mode: 'create' | 'edit';
}

interface WhatsAppMessage {
  type: 'text' | 'interactive';
  text?: {
    body: string;
  };
  interactive?: {
    type: 'button';
    body: {
      text: string;
    };
    action: {
      buttons: Array<{
        type: 'reply';
        reply: {
          id: string;
          title: string;
        };
      }>;
    };
  };
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  open,
  onOpenChange,
  template,
  mode
}) => {
  const { toast } = useToast();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const [formData, setFormData] = useState({
    nome_template: '',
    canal: 'whatsapp',
    etapa_cadencia: 101,
    assunto_template: '',
    corpo_template: '',
    descricao_interna: '',
    ativo: true
  });

  const [whatsappJson, setWhatsappJson] = useState<WhatsAppMessage>({
    type: 'text',
    text: {
      body: 'Olá {{nome_lead}}! Detectamos um erro no seu site {{dominio}}. Podemos ajudar?'
    }
  });

  const [jsonError, setJsonError] = useState('');
  const [variaveisUsadas, setVariaveisUsadas] = useState<string[]>([]);

  // Variáveis disponíveis no sistema
  const variaveisDisponiveis = [
    '{{nome_lead}}',
    '{{dominio}}',
    '{{tipo_erro}}',
    '{{empresa_nome}}',
    '{{url_erro}}',
    '{{data_deteccao}}',
    '{{link_agendamento}}',
    '{{nome_consultor}}'
  ];

  // Opções de etapas da cadência organizadas
  const etapasCadencia = [
    { grupo: 'Dia 1', opcoes: [
      { value: 101, label: 'Dia 1 - Primeira abordagem (101)' },
      { value: 102, label: 'Dia 1 - Reforço 1 (102)' },
      { value: 103, label: 'Dia 1 - Reforço 2 (103)' }
    ]},
    { grupo: 'Dia 2', opcoes: [
      { value: 201, label: 'Dia 2 - Primeira mensagem (201)' },
      { value: 202, label: 'Dia 2 - Reforço 1 (202)' },
      { value: 203, label: 'Dia 2 - Reforço 2 (203)' }
    ]},
    { grupo: 'Dia 3', opcoes: [
      { value: 301, label: 'Dia 3 - Última tentativa (301)' },
      { value: 302, label: 'Dia 3 - Reforço final (302)' },
      { value: 303, label: 'Dia 3 - Encerramento (303)' }
    ]}
  ];

  const isValidJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (template && mode === 'edit') {
      setFormData({
        nome_template: template.nome_template || '',
        canal: template.canal || 'whatsapp',
        etapa_cadencia: Number(template.etapa_cadencia) || 101,
        assunto_template: template.assunto_template || '',
        corpo_template: template.corpo_template || '',
        descricao_interna: template.descricao_interna || '',
        ativo: template.ativo ?? true
      });

      if (template.canal === 'whatsapp' && template.corpo_template) {
        // Verificar se o corpo_template é um JSON válido
        if (isValidJson(template.corpo_template)) {
          try {
            const parsed = JSON.parse(template.corpo_template);
            setWhatsappJson(parsed);
            setJsonError('');
          } catch (error) {
            console.error('Erro ao parsear JSON do WhatsApp:', error);
            // Se falhar, criar um JSON padrão com o conteúdo existente
            const defaultJson = {
              type: 'text' as const,
              text: {
                body: template.corpo_template
              }
            };
            setWhatsappJson(defaultJson);
            setFormData(prev => ({
              ...prev,
              corpo_template: JSON.stringify(defaultJson, null, 2)
            }));
          }
        } else {
          // Se não for JSON válido, criar um JSON padrão com o conteúdo existente
          const defaultJson = {
            type: 'text' as const,
            text: {
              body: template.corpo_template
            }
          };
          setWhatsappJson(defaultJson);
          setFormData(prev => ({
            ...prev,
            corpo_template: JSON.stringify(defaultJson, null, 2)
          }));
        }
      }
    } else {
      // Reset form for create mode
      setFormData({
        nome_template: '',
        canal: 'whatsapp',
        etapa_cadencia: 101,
        assunto_template: '',
        corpo_template: '',
        descricao_interna: '',
        ativo: true
      });
      const defaultJson = {
        type: 'text' as const,
        text: {
          body: 'Olá {{nome_lead}}! Detectamos um erro no seu site {{dominio}}. Podemos ajudar?'
        }
      };
      setWhatsappJson(defaultJson);
      setFormData(prev => ({
        ...prev,
        corpo_template: JSON.stringify(defaultJson, null, 2)
      }));
    }
  }, [template, mode, open]);

  // Detectar variáveis usadas no conteúdo
  useEffect(() => {
    let conteudo = '';
    if (formData.canal === 'whatsapp') {
      conteudo = formData.corpo_template;
    } else {
      conteudo = formData.assunto_template + ' ' + formData.corpo_template;
    }

    const variaveisEncontradas = variaveisDisponiveis.filter(variavel => 
      conteudo.includes(variavel)
    );
    setVariaveisUsadas(variaveisEncontradas);
  }, [formData.corpo_template, formData.assunto_template, formData.canal]);

  const validateWhatsAppJson = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      setWhatsappJson(parsed);
      setJsonError('');
      return true;
    } catch (error) {
      setJsonError('JSON inválido: ' + (error as Error).message);
      return false;
    }
  };

  const handleSave = async () => {
    try {
      // Validações
      if (!formData.nome_template.trim()) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Nome do template é obrigatório."
        });
        return;
      }

      if (!formData.corpo_template.trim()) {
        toast({
          variant: "destructive",
          title: "Erro", 
          description: "Corpo do template é obrigatório."
        });
        return;
      }

      if (formData.canal === 'email' && !formData.assunto_template.trim()) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Assunto do email é obrigatório."
        });
        return;
      }

      if (formData.canal === 'whatsapp') {
        if (!validateWhatsAppJson(formData.corpo_template)) {
          return;
        }
      }

      const templateData = {
        ...formData,
        etapa_cadencia: Number(formData.etapa_cadencia)
      };

      if (mode === 'edit' && template) {
        await updateTemplate.mutateAsync({
          id: template.id,
          template: templateData
        });
        toast({
          title: "Sucesso!",
          description: "Template atualizado com sucesso."
        });
      } else {
        await createTemplate.mutateAsync(templateData);
        toast({
          title: "Sucesso!",
          description: "Template criado com sucesso."
        });
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao salvar template."
      });
    }
  };

  const renderWhatsAppPreview = () => {
    try {
      if (whatsappJson.type === 'text' && whatsappJson.text) {
        return (
          <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-none max-w-xs ml-auto">
            <p className="text-sm whitespace-pre-wrap">{whatsappJson.text.body}</p>
          </div>
        );
      }
      
      if (whatsappJson.type === 'interactive' && whatsappJson.interactive) {
        return (
          <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-none max-w-xs ml-auto">
            <p className="text-sm whitespace-pre-wrap mb-2">{whatsappJson.interactive.body.text}</p>
            {whatsappJson.interactive.action.buttons.map((button, index) => (
              <button
                key={index}
                className="block w-full text-left bg-white/20 p-2 rounded mt-1 text-xs"
              >
                {button.reply.title}
              </button>
            ))}
          </div>
        );
      }
    } catch (error) {
      return <p className="text-red-500 text-sm">Erro no preview</p>;
    }
    
    return <p className="text-gray-500 text-sm">Preview não disponível</p>;
  };

  const adicionarVariavel = (variavel: string) => {
    if (formData.canal === 'whatsapp') {
      setFormData(prev => ({
        ...prev,
        corpo_template: prev.corpo_template + ' ' + variavel
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        corpo_template: prev.corpo_template + ' ' + variavel
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Editar Template' : 'Criar Novo Template'}
          </DialogTitle>
          <DialogDescription>
            Configure o template de mensagem para a cadência automatizada.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Side */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Template</Label>
                  <Input
                    id="nome"
                    value={formData.nome_template}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_template: e.target.value }))}
                    placeholder="Ex: Primeira abordagem - Erro 404"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="canal">Canal</Label>
                    <Select
                      value={formData.canal}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, canal: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">E-mail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="etapa">Etapa da Cadência</Label>
                    <Select
                      value={formData.etapa_cadencia.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, etapa_cadencia: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {etapasCadencia.map(grupo => (
                          <div key={grupo.grupo}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                              {grupo.grupo}
                            </div>
                            {grupo.opcoes.map(opcao => (
                              <SelectItem key={opcao.value} value={opcao.value.toString()}>
                                {opcao.label}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição Interna</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao_interna}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao_interna: e.target.value }))}
                    placeholder="Descrição para uso interno da equipe"
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                  />
                  <Label htmlFor="ativo">Template ativo</Label>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conteúdo do Template</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.canal === 'email' ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="assunto">Assunto do E-mail</Label>
                      <Input
                        id="assunto"
                        value={formData.assunto_template}
                        onChange={(e) => setFormData(prev => ({ ...prev, assunto_template: e.target.value }))}
                        placeholder="Assunto do e-mail"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="corpo-email">Corpo do E-mail (HTML)</Label>
                      <Textarea
                        id="corpo-email"
                        value={formData.corpo_template}
                        onChange={(e) => setFormData(prev => ({ ...prev, corpo_template: e.target.value }))}
                        placeholder="Conteúdo HTML do e-mail"
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="whatsapp-json">Estrutura da Mensagem WhatsApp</Label>
                      <Textarea
                        id="whatsapp-json"
                        value={formData.corpo_template}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, corpo_template: e.target.value }));
                          validateWhatsAppJson(e.target.value);
                        }}
                        placeholder="JSON estruturado para WhatsApp"
                        rows={10}
                        className="font-mono text-sm"
                      />
                      {jsonError && (
                        <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                          <AlertCircle className="h-4 w-4" />
                          {jsonError}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Side */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
                <CardDescription>
                  Visualize como a mensagem será exibida
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formData.canal === 'email' ? (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="bg-white border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-3 border-b">
                        <p className="font-medium text-sm">
                          <strong>Assunto:</strong> {formData.assunto_template || 'Sem assunto'}
                        </p>
                      </div>
                      <div 
                        className="p-4"
                        dangerouslySetInnerHTML={{ 
                          __html: formData.corpo_template || '<p>Conteúdo do e-mail...</p>' 
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-green-50">
                    <div className="flex flex-col space-y-2">
                      <div className="text-center">
                        <Badge variant="outline">WhatsApp Preview</Badge>
                      </div>
                      <div className="bg-white p-4 rounded-lg min-h-[200px]">
                        {renderWhatsAppPreview()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Variables Helper */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Variáveis Disponíveis</CardTitle>
                <CardDescription>
                  Clique para adicionar as variáveis ao template
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {variaveisDisponiveis.map((variavel) => (
                    <button
                      key={variavel}
                      onClick={() => adicionarVariavel(variavel)}
                      className="text-left p-2 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors flex justify-between items-center"
                    >
                      <span>{variavel}</span>
                      {variaveisUsadas.includes(variavel) && (
                        <Check className="h-3 w-3 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>

                {variaveisUsadas.length > 0 && (
                  <div>
                    <Separator className="my-3" />
                    <div className="text-sm font-medium mb-2">Variáveis detectadas no template:</div>
                    <div className="flex flex-wrap gap-1">
                      {variaveisUsadas.map((variavel) => (
                        <Badge key={variavel} variant="secondary" className="text-xs">
                          {variavel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={createTemplate.isPending || updateTemplate.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === 'edit' ? 'Atualizar' : 'Criar'} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
