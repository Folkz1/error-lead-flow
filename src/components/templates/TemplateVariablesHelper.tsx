
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { VARIAVEIS_DISPONIVEIS } from './constants';
import type { TemplateFormData } from './types';

interface TemplateVariablesHelperProps {
  formData: TemplateFormData;
  whatsappText: string;
  variaveisUsadas: string[];
  onAddVariable: (variavel: string) => void;
}

export const TemplateVariablesHelper: React.FC<TemplateVariablesHelperProps> = ({
  formData,
  whatsappText,
  variaveisUsadas,
  onAddVariable
}) => {
  const [showAllVariables, setShowAllVariables] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {variaveisUsadas.length > 0 ? 'Variáveis Usadas' : 'Nenhuma Variável Detectada'}
        </CardTitle>
        <CardDescription>
          {variaveisUsadas.length > 0 
            ? 'Variáveis detectadas no seu template'
            : 'Adicione variáveis como {{nome_lead}} para personalizar'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {variaveisUsadas.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {variaveisUsadas.map((variavel) => (
                <Badge key={variavel} variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 text-green-600 mr-1" />
                  {variavel}
                </Badge>
              ))}
            </div>
            
            <Separator />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllVariables(!showAllVariables)}
            >
              {showAllVariables ? 'Ocultar outras variáveis' : 'Ver todas as variáveis'}
            </Button>
            
            {showAllVariables && (
              <div className="grid grid-cols-1 gap-2 mt-4">
                {VARIAVEIS_DISPONIVEIS
                  .filter(v => !variaveisUsadas.includes(v))
                  .map((variavel) => (
                    <button
                      key={variavel}
                      onClick={() => onAddVariable(variavel)}
                      className="text-left p-2 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      {variavel}
                    </button>
                  ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {VARIAVEIS_DISPONIVEIS.map((variavel) => (
              <button
                key={variavel}
                onClick={() => onAddVariable(variavel)}
                className="text-left p-2 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                {variavel}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
