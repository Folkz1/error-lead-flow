
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { EXEMPLOS_VARIAVEIS } from './constants';
import type { TemplateFormData } from './types';

interface TemplatePreviewProps {
  formData: TemplateFormData;
  whatsappText: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  formData,
  whatsappText
}) => {
  const renderWhatsAppPreview = () => {
    let textoPreview = whatsappText;
    Object.entries(EXEMPLOS_VARIAVEIS).forEach(([variavel, valor]) => {
      textoPreview = textoPreview.replace(new RegExp(variavel.replace(/[{}]/g, '\\$&'), 'g'), valor);
    });

    return (
      <div className="bg-green-500 text-white p-3 rounded-lg rounded-bl-none max-w-xs ml-auto">
        <p className="text-sm whitespace-pre-wrap">{textoPreview}</p>
      </div>
    );
  };

  return (
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
  );
};
