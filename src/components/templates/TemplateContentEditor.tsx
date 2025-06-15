
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TemplateFormData } from './types';

interface TemplateContentEditorProps {
  formData: TemplateFormData;
  whatsappText: string;
  onFormDataChange: (data: Partial<TemplateFormData>) => void;
  onWhatsappTextChange: (text: string) => void;
}

export const TemplateContentEditor: React.FC<TemplateContentEditorProps> = ({
  formData,
  whatsappText,
  onFormDataChange,
  onWhatsappTextChange
}) => {
  return (
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
                onChange={(e) => onFormDataChange({ assunto_template: e.target.value })}
                placeholder="Assunto do e-mail"
              />
            </div>
            
            <div>
              <Label htmlFor="corpo-email">Corpo do E-mail (HTML)</Label>
              <Textarea
                id="corpo-email"
                value={formData.corpo_template}
                onChange={(e) => onFormDataChange({ corpo_template: e.target.value })}
                placeholder="Conteúdo HTML do e-mail"
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="whatsapp-text">Texto da Mensagem WhatsApp</Label>
              <Textarea
                id="whatsapp-text"
                value={whatsappText}
                onChange={(e) => onWhatsappTextChange(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                rows={6}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use as variáveis disponíveis como {`{{nome_lead}}`} para personalizar a mensagem
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
