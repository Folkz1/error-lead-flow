
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateContato } from "@/hooks/useContatos";
import { useEmpresasSelect } from "@/hooks/useEmpresasSelect";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ContatoEmpresa = Tables<'contatos_empresa'>;

interface ContatoModalProps {
  contato?: ContatoEmpresa | null;
  empresaId?: number;
  trigger?: React.ReactNode;
  mode: 'create' | 'edit';
  onClose?: () => void;
}

export const ContatoModal = ({ contato, empresaId, trigger, mode, onClose }: ContatoModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    empresa_id: empresaId || 0,
    tipo_contato: 'email',
    valor_contato: '',
    fonte_contato: '',
    descricao: '',
    status_contato: 'ativo',
    whatsapp_valido: false,
    whatsappbusiness: false,
    gmn: false
  });

  const createMutation = useCreateContato();
  const { data: empresas, isLoading: empresasLoading } = useEmpresasSelect();
  const { toast } = useToast();

  useEffect(() => {
    if (contato && mode === 'edit') {
      setFormData({
        empresa_id: contato.empresa_id,
        tipo_contato: contato.tipo_contato || 'email',
        valor_contato: contato.valor_contato || '',
        fonte_contato: contato.fonte_contato || '',
        descricao: contato.descricao || '',
        status_contato: contato.status_contato || 'ativo',
        whatsapp_valido: contato.whatsapp_valido || false,
        whatsappbusiness: contato.whatsappbusiness || false,
        gmn: contato.gmn || false
      });
    }
  }, [contato, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresa_id) {
      toast({
        title: "Erro",
        description: "É necessário informar a empresa para o contato.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createMutation.mutateAsync(formData);
      toast({
        title: "Contato salvo com sucesso!",
        description: "O contato foi adicionado à empresa."
      });
      
      setOpen(false);
      onClose?.();
      
      // Reset form for create mode
      if (mode === 'create') {
        setFormData({
          empresa_id: empresaId || 0,
          tipo_contato: 'email',
          valor_contato: '',
          fonte_contato: '',
          descricao: '',
          status_contato: 'ativo',
          whatsapp_valido: false,
          whatsappbusiness: false,
          gmn: false
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar contato",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const defaultTrigger = (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Adicionar Contato
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Contato' : 'Editar Contato'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!empresaId && (
            <div className="space-y-2">
              <Label htmlFor="empresa_id">Empresa *</Label>
              <Select 
                value={formData.empresa_id.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, empresa_id: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresasLoading ? (
                    <SelectItem value="" disabled>Carregando empresas...</SelectItem>
                  ) : (
                    empresas?.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString()}>
                        {empresa.label} ({empresa.dominio})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_contato">Tipo de Contato *</Label>
              <Select 
                value={formData.tipo_contato} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_contato: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="telefone">Telefone</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status_contato">Status</Label>
              <Select 
                value={formData.status_contato} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status_contato: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="sem_resposta">Sem Resposta</SelectItem>
                  <SelectItem value="respondido">Respondido</SelectItem>
                  <SelectItem value="nao_usar">Não Usar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_contato">Valor do Contato *</Label>
            <Input
              id="valor_contato"
              value={formData.valor_contato}
              onChange={(e) => setFormData(prev => ({ ...prev, valor_contato: e.target.value }))}
              placeholder="email@exemplo.com ou (11) 99999-9999"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fonte_contato">Fonte do Contato</Label>
            <Input
              id="fonte_contato"
              value={formData.fonte_contato}
              onChange={(e) => setFormData(prev => ({ ...prev, fonte_contato: e.target.value }))}
              placeholder="Site, Google My Business, LinkedIn..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Informações adicionais sobre o contato..."
              rows={3}
            />
          </div>

          {formData.tipo_contato === 'whatsapp' && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium">Configurações WhatsApp</h4>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp_valido">WhatsApp Válido</Label>
                <Switch
                  id="whatsapp_valido"
                  checked={formData.whatsapp_valido}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsapp_valido: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsappbusiness">WhatsApp Business</Label>
                <Switch
                  id="whatsappbusiness"
                  checked={formData.whatsappbusiness}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, whatsappbusiness: checked }))}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Label htmlFor="gmn">Contato do Google My Business</Label>
            <Switch
              id="gmn"
              checked={formData.gmn}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, gmn: checked }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
