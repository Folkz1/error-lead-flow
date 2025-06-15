
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateEmpresa, useUpdateEmpresa } from "@/hooks/useEmpresas";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Empresa = Tables<'empresas'>;

interface EmpresaModalProps {
  empresa?: Empresa | null;
  trigger?: React.ReactNode;
  mode: 'create' | 'edit';
  onClose?: () => void;
}

export const EmpresaModal = ({ empresa, trigger, mode, onClose }: EmpresaModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dominio: '',
    nome_empresa_pagina: '',
    nome_empresa_gmn: '',
    url_inicial: '',
    status_cadencia_geral: 'apta_para_contato',
    notas_internas: ''
  });

  const createMutation = useCreateEmpresa();
  const updateMutation = useUpdateEmpresa();
  const { toast } = useToast();

  useEffect(() => {
    if (empresa && mode === 'edit') {
      setFormData({
        dominio: empresa.dominio || '',
        nome_empresa_pagina: empresa.nome_empresa_pagina || '',
        nome_empresa_gmn: empresa.nome_empresa_gmn || '',
        url_inicial: empresa.url_inicial || '',
        status_cadencia_geral: empresa.status_cadencia_geral || 'apta_para_contato',
        notas_internas: empresa.notas_internas || ''
      });
    }
  }, [empresa, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(formData);
        toast({
          title: "Empresa criada com sucesso!",
          description: "A empresa foi adicionada ao sistema."
        });
      } else if (empresa) {
        await updateMutation.mutateAsync({
          id: empresa.id,
          updates: formData
        });
        toast({
          title: "Empresa atualizada com sucesso!",
          description: "As informações foram salvas."
        });
      }
      
      setOpen(false);
      onClose?.();
      
      // Reset form for create mode
      if (mode === 'create') {
        setFormData({
          dominio: '',
          nome_empresa_pagina: '',
          nome_empresa_gmn: '',
          url_inicial: '',
          status_cadencia_geral: 'apta_para_contato',
          notas_internas: ''
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar empresa",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const defaultTrigger = mode === 'create' ? (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Nova Empresa
    </Button>
  ) : (
    <Button variant="outline" size="sm">
      <Edit className="h-4 w-4 mr-1" />
      Editar
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
            {mode === 'create' ? 'Nova Empresa' : 'Editar Empresa'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dominio">Domínio *</Label>
              <Input
                id="dominio"
                value={formData.dominio}
                onChange={(e) => setFormData(prev => ({ ...prev, dominio: e.target.value }))}
                placeholder="exemplo.com.br"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status da Cadência</Label>
              <Select 
                value={formData.status_cadencia_geral} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status_cadencia_geral: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apta_para_contato">Apta para Contato</SelectItem>
                  <SelectItem value="em_cadencia">Em Cadência</SelectItem>
                  <SelectItem value="aguardando_resposta">Aguardando Resposta</SelectItem>
                  <SelectItem value="sucesso_contato_realizado">Sucesso</SelectItem>
                  <SelectItem value="nao_perturbe">Não Perturbe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_pagina">Nome da Empresa (Página)</Label>
              <Input
                id="nome_pagina"
                value={formData.nome_empresa_pagina}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_empresa_pagina: e.target.value }))}
                placeholder="Nome encontrado na página"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nome_gmn">Nome da Empresa (GMN)</Label>
              <Input
                id="nome_gmn"
                value={formData.nome_empresa_gmn}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_empresa_gmn: e.target.value }))}
                placeholder="Nome do Google My Business"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_inicial">URL Inicial</Label>
            <Input
              id="url_inicial"
              value={formData.url_inicial}
              onChange={(e) => setFormData(prev => ({ ...prev, url_inicial: e.target.value }))}
              placeholder="https://exemplo.com.br"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas Internas</Label>
            <Textarea
              id="notas"
              value={formData.notas_internas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas_internas: e.target.value }))}
              placeholder="Observações internas sobre a empresa..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
