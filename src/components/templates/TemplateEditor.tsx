
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCreateTemplate, useUpdateTemplate } from "@/hooks/useTemplates";
import { Save } from "lucide-react";
import { TemplateBasicInfo } from './TemplateBasicInfo';
import { TemplateContentEditor } from './TemplateContentEditor';
import { TemplatePreview } from './TemplatePreview';
import { TemplateVariablesHelper } from './TemplateVariablesHelper';
import { VARIAVEIS_DISPONIVEIS } from './constants';
import { extractWhatsAppText, createWhatsAppJson } from './utils';
import type { TemplateEditorProps, TemplateFormData } from './types';

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  open,
  onOpenChange,
  template,
  mode
}) => {
  const { toast } = useToast();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const [formData, setFormData] = useState<TemplateFormData>({
    nome_template: '',
    canal: 'whatsapp',
    etapa_cadencia: 101,
    assunto_template: '',
    corpo_template: '',
    descricao_interna: '',
    ativo: true
  });

  const [whatsappText, setWhatsappText] = useState('Olá {{nome_lead}}! Detectamos um erro no seu site {{dominio}}. Podemos ajudar?');
  const [variaveisUsadas, setVariaveisUsadas] = useState<string[]>([]);

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
        setWhatsappText(extractWhatsAppText(template.corpo_template));
      }
    } else {
      setFormData({
        nome_template: '',
        canal: 'whatsapp',
        etapa_cadencia: 101,
        assunto_template: '',
        corpo_template: '',
        descricao_interna: '',
        ativo: true
      });
      setWhatsappText('Olá {{nome_lead}}! Detectamos um erro no seu site {{dominio}}. Podemos ajudar?');
    }
  }, [template, mode, open]);

  // Detectar variáveis usadas no conteúdo
  useEffect(() => {
    let conteudo = '';
    if (formData.canal === 'whatsapp') {
      conteudo = whatsappText;
    } else {
      conteudo = formData.assunto_template + ' ' + formData.corpo_template;
    }

    const variaveisEncontradas = VARIAVEIS_DISPONIVEIS.filter(variavel => 
      conteudo.includes(variavel)
    );
    setVariaveisUsadas(variaveisEncontradas);
  }, [whatsappText, formData.corpo_template, formData.assunto_template, formData.canal]);

  // Atualizar o corpo_template quando o texto WhatsApp mudar
  useEffect(() => {
    if (formData.canal === 'whatsapp') {
      setFormData(prev => ({
        ...prev,
        corpo_template: createWhatsAppJson(whatsappText)
      }));
    }
  }, [whatsappText, formData.canal]);

  const handleFormDataChange = (data: Partial<TemplateFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    try {
      if (!formData.nome_template.trim()) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Nome do template é obrigatório."
        });
        return;
      }

      if (formData.canal === 'whatsapp' && !whatsappText.trim()) {
        toast({
          variant: "destructive",
          title: "Erro", 
          description: "Texto da mensagem é obrigatório."
        });
        return;
      }

      if (formData.canal === 'email') {
        if (!formData.assunto_template.trim()) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Assunto do email é obrigatório."
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

  const adicionarVariavel = (variavel: string) => {
    if (formData.canal === 'whatsapp') {
      setWhatsappText(prev => prev + ' ' + variavel);
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
            <TemplateBasicInfo 
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />

            <TemplateContentEditor
              formData={formData}
              whatsappText={whatsappText}
              onFormDataChange={handleFormDataChange}
              onWhatsappTextChange={setWhatsappText}
            />
          </div>

          {/* Preview Side */}
          <div className="space-y-6">
            <TemplatePreview 
              formData={formData}
              whatsappText={whatsappText}
            />

            <TemplateVariablesHelper
              formData={formData}
              whatsappText={whatsappText}
              variaveisUsadas={variaveisUsadas}
              onAddVariable={adicionarVariavel}
            />
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
