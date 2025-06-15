
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ETAPAS_CADENCIA } from './constants';
import type { TemplateFormData } from './types';

interface TemplateBasicInfoProps {
  formData: TemplateFormData;
  onFormDataChange: (data: Partial<TemplateFormData>) => void;
}

export const TemplateBasicInfo: React.FC<TemplateBasicInfoProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
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
            onChange={(e) => onFormDataChange({ nome_template: e.target.value })}
            placeholder="Ex: Primeira abordagem - Erro 404"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="canal">Canal</Label>
            <Select
              value={formData.canal}
              onValueChange={(value) => onFormDataChange({ canal: value })}
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
              onValueChange={(value) => onFormDataChange({ etapa_cadencia: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ETAPAS_CADENCIA.map(grupo => (
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
            onChange={(e) => onFormDataChange({ descricao_interna: e.target.value })}
            placeholder="Descrição para uso interno da equipe"
            rows={2}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ativo"
            checked={formData.ativo}
            onCheckedChange={(checked) => onFormDataChange({ ativo: checked })}
          />
          <Label htmlFor="ativo">Template ativo</Label>
        </div>
      </CardContent>
    </Card>
  );
};
