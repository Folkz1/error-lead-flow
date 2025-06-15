
import type { Tables } from '@/integrations/supabase/types';

export type TemplateMensagem = Tables<'templates_mensagens'>;

export interface TemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: TemplateMensagem | null;
  mode: 'create' | 'edit';
}

export interface TemplateFormData {
  nome_template: string;
  canal: string;
  etapa_cadencia: number;
  assunto_template: string;
  corpo_template: string;
  descricao_interna: string;
  ativo: boolean;
}

export interface EtapaCadencia {
  grupo: string;
  opcoes: Array<{
    value: number;
    label: string;
  }>;
}
