import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTemplates, useCreateTemplate, useUpdateTemplateMessage, useDeleteTemplateMessage } from '@/hooks/useTemplates'; // Added useDeleteTemplateMessage
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Save, X, ArrowLeft, Loader2, Plus, Edit, Trash2 } from 'lucide-react'; // Added Plus, Edit, Trash2
import type { Tables, TablesInsert } from '@/integrations/supabase/types'; // Added TablesInsert
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger, // Though we might open programmatically
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Select components

type TemplateMensagem = Tables<'templates_mensagens'>;
// For new steps that don't have all fields of TemplateMensagem yet
type PartialTemplateMensagem = Partial<TablesInsert<'templates_mensagens'>> & {
  // Define fields that are absolutely required for a new step in the UI
  canal: string;
  etapa_cadencia: number;
  corpo_template: string;
  assunto_template?: string;
  // Frontend-only temporary ID for new steps, to help with list operations
  temp_id?: number; 
};

const CadenceForm = () => {
  const { cadenceName: routeCadenceName } = useParams<{ cadenceName?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = Boolean(routeCadenceName);

  // Form State
  const [cadenceName, setCadenceName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [originalSteps, setOriginalSteps] = useState<TemplateMensagem[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false); // For edit mode data loading
  const [isSaving, setIsSaving] = useState(false); // State for save loading

  // State for current steps being edited in the form
  const [currentSteps, setCurrentSteps] = useState<Array<TemplateMensagem | PartialTemplateMensagem>>([]);

  // State for the step modal/sub-form
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<TemplateMensagem | PartialTemplateMensagem | null>(null); // Can be a full step or a partial one for new entries
  const [stepFormValues, setStepFormValues] = useState<PartialTemplateMensagem>({
    canal: 'EMAIL',
    etapa_cadencia: 1,
    corpo_template: '',
    assunto_template: '',
  });

  // Hooks for fetching/mutating data
  const { data: allTemplates, isLoading: isLoadingAllTemplates, error: errorLoadingAllTemplates } = useTemplates();
  const createTemplateMessage = useCreateTemplate();
  const updateTemplateMessage = useUpdateTemplateMessage();
  const deleteTemplateMessage = useDeleteTemplateMessage();

  useEffect(() => {
    if (isEditMode && routeCadenceName && allTemplates) {
      setIsLoadingData(true);
      const decodedCadenceName = decodeURIComponent(routeCadenceName);
      const stepsForCurrentCadence = allTemplates.filter(
        (step) => step.nome_template === decodedCadenceName
      );

      if (stepsForCurrentCadence.length > 0) {
        // Sort steps by etapa_cadencia to ensure consistency
        const sortedSteps = [...stepsForCurrentCadence].sort((a,b) => a.etapa_cadencia - b.etapa_cadencia);
        setCadenceName(decodedCadenceName);
        setDescription(sortedSteps[0]?.descricao_interna || '');
        setIsActive(sortedSteps[0]?.ativo !== undefined ? sortedSteps[0]?.ativo : true);
        setOriginalSteps(sortedSteps);
        setCurrentSteps(sortedSteps); // Initialize currentSteps with loaded steps
      } else {
        toast({
          title: "Erro",
          description: `Cadência "${decodedCadenceName}" não encontrada. Redirecionando...`,
          variant: "destructive",
        });
        navigate("/cadences");
      }
      setIsLoadingData(false);
    } else if (!isEditMode) {
      // Reset form for new cadence if not in edit mode
      setCadenceName('');
      setDescription('');
      setIsActive(true);
      setOriginalSteps([]);
      setCurrentSteps([]); // Reset current steps for new cadence
    }
  }, [isEditMode, routeCadenceName, allTemplates, navigate, toast]);

  const handleOpenNewStepModal = () => {
    setEditingStep(null);
    const nextEtapa = (currentSteps.length > 0 ? Math.max(...currentSteps.map(s => s.etapa_cadencia || 0)) : 0) + 1;
    setStepFormValues({
      canal: 'EMAIL',
      etapa_cadencia: nextEtapa,
      corpo_template: '',
      assunto_template: '',
    });
    setIsStepModalOpen(true);
  };

  const handleOpenEditStepModal = (step: TemplateMensagem | PartialTemplateMensagem) => {
    setEditingStep(step);
    setStepFormValues({
      ...step, // Spread existing step data
      canal: step.canal || 'EMAIL', // default if not set
      etapa_cadencia: step.etapa_cadencia || 1,
      corpo_template: step.corpo_template || '',
      assunto_template: step.assunto_template || '',
    });
    setIsStepModalOpen(true);
  };

  const handleCloseStepModal = () => {
    setIsStepModalOpen(false);
    setEditingStep(null);
  };

  const handleSaveStep = () => {
    if (!stepFormValues.corpo_template) {
      toast({ title: "Erro", description: "O corpo da mensagem não pode ser vazio.", variant: "destructive" });
      return;
    }
    if (!stepFormValues.canal) {
      toast({ title: "Erro", description: "O canal deve ser selecionado.", variant: "destructive" });
      return;
    }
     if (!stepFormValues.etapa_cadencia || stepFormValues.etapa_cadencia <= 0) {
      toast({ title: "Erro", description: "A ordem da etapa deve ser um número positivo.", variant: "destructive" });
      return;
    }


    if (editingStep) { // Editing existing step (could be a new one with temp_id or an old one with DB id)
      setCurrentSteps(currentSteps.map(s => 
        (s.id && s.id === editingStep.id) || (s.temp_id && s.temp_id === editingStep.temp_id) 
        ? { ...s, ...stepFormValues, id: s.id, temp_id: s.temp_id } // Preserve original ID or temp_id
        : s
      ));
    } else { // Adding new step
      const newStep: PartialTemplateMensagem = {
        ...stepFormValues,
        temp_id: Date.now(), // Temporary ID for UI operations
        // data_criacao: new Date().toISOString(), // This will be set by backend
        // id: undefined, // This will be set by backend
        // nome_template: cadenceName, // This will be set when saving the whole cadence
        // ativo: isActive, // This will be set when saving the whole cadence
        // descricao_interna: description, // This will be set when saving the whole cadence
      };
      setCurrentSteps([...currentSteps, newStep]);
    }
    handleCloseStepModal();
    toast({ title: "Sucesso", description: "Etapa salva localmente." });
  };

  const handleRemoveStep = (stepToRemove: TemplateMensagem | PartialTemplateMensagem) => {
    setCurrentSteps(currentSteps.filter(s => 
      (s.id && s.id !== stepToRemove.id) || (s.temp_id && s.temp_id !== stepToRemove.temp_id) || (s !== stepToRemove)
    ));
    toast({ title: "Sucesso", description: "Etapa removida localmente." });
  };
  
  const handleSaveCadence = async () => {
    setIsSaving(true);
    try {
      const finalCadenceName = cadenceName.trim();
      const finalDescription = description;
      const finalIsActive = isActive;
      const finalSteps = currentSteps;

      if (!finalCadenceName) {
        toast({ title: "Erro", description: "O nome da cadência é obrigatório.", variant: "destructive" });
        return;
      }
      if (finalSteps.length === 0) {
        toast({ title: "Erro", description: "Uma cadência deve ter pelo menos uma etapa.", variant: "destructive" });
        return;
      }

      if (isEditMode) {
        // EDIT MODE
        const stepIdsToDelete: number[] = [];
        originalSteps.forEach(originalStep => {
          if (!finalSteps.find(currentStep => currentStep.id === originalStep.id)) {
            if (originalStep.id) stepIdsToDelete.push(originalStep.id);
          }
        });

        const stepsToCreate: Array<TablesInsert<'templates_mensagens'>> = [];
        const stepsToUpdate: Array<{id: number, updates: Partial<TablesInsert<'templates_mensagens'>>}> = [];

        finalSteps.forEach((step, index) => {
          const stepPayload: Partial<TablesInsert<'templates_mensagens'>> = {
            nome_template: finalCadenceName,
            descricao_interna: index === 0 ? finalDescription : null,
            ativo: finalIsActive,
            etapa_cadencia: index + 1,
            canal: step.canal,
            corpo_template: step.corpo_template,
            assunto_template: step.canal === 'EMAIL' ? step.assunto_template : null,
            // id and data_criacao are handled by DB or not included for new items
          };
          
          // Remove undefined keys to prevent issues with Supabase client
          Object.keys(stepPayload).forEach(key => stepPayload[key as keyof typeof stepPayload] === undefined && delete stepPayload[key as keyof typeof stepPayload]);


          if (step.id && typeof step.id === 'number' && step.id > 0) { // Existing step
            stepsToUpdate.push({ id: step.id, updates: stepPayload });
          } else { // New step
             // Ensure no 'id' or 'temp_id' is passed in the create payload
            const { id, temp_id, ...newStepData } = stepPayload;
            stepsToCreate.push(newStepData as TablesInsert<'templates_mensagens'>);
          }
        });
        
        // Execute mutations
        for (const id of stepIdsToDelete) {
          await deleteTemplateMessage.mutateAsync({ id });
        }
        for (const { id, updates } of stepsToUpdate) {
          await updateTemplateMessage.mutateAsync({ id, updates });
        }
        for (const stepCreatePayload of stepsToCreate) {
          await createTemplateMessage.mutateAsync(stepCreatePayload);
        }

      } else {
        // CREATE MODE
        const stepsToCreate: Array<TablesInsert<'templates_mensagens'>> = [];
        finalSteps.forEach((step, index) => {
          const stepPayload: TablesInsert<'templates_mensagens'> = {
            nome_template: finalCadenceName,
            descricao_interna: index === 0 ? finalDescription : null,
            ativo: finalIsActive,
            etapa_cadencia: index + 1,
            canal: step.canal!, // canal is guaranteed by form validation
            corpo_template: step.corpo_template!, // corpo_template is guaranteed
            assunto_template: step.canal === 'EMAIL' ? step.assunto_template : null,
            // id, data_criacao are handled by DB
            // data_ultima_atualizacao is handled by DB
            // user_id can be set if available
          };
          // Remove undefined keys
          Object.keys(stepPayload).forEach(key => stepPayload[key as keyof typeof stepPayload] === undefined && delete stepPayload[key as keyof typeof stepPayload]);

          stepsToCreate.push(stepPayload);
        });

        for (const stepCreatePayload of stepsToCreate) {
          await createTemplateMessage.mutateAsync(stepCreatePayload);
        }
      }

      toast({ title: "Sucesso", description: `Cadência "${finalCadenceName}" salva com sucesso!` });
      navigate("/cadences");

    } catch (error) {
      console.error("Erro ao salvar cadência:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast({ title: "Erro ao Salvar", description: `Falha ao salvar a cadência: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingAllTemplates || (isEditMode && isLoadingData)) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg">Carregando dados da cadência...</p>
      </div>
    );
  }

  if (errorLoadingAllTemplates) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto text-center text-red-600">
        <p>Erro ao carregar templates: {errorLoadingAllTemplates.message}</p>
        <Button onClick={() => navigate("/cadences")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Cadências
        </Button>
      </div>
    );
  }
  
  const pageTitle = isEditMode 
    ? `Editar Cadência: ${routeCadenceName ? decodeURIComponent(routeCadenceName) : ''}` 
    : "Criar Nova Cadência";

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{pageTitle}</h2>
        <Link to="/cadences">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Cadência</CardTitle>
          <CardDescription>Defina o nome, descrição e status da sua cadência.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cadenceName">Nome da Cadência</Label>
            <Input 
              id="cadenceName" 
              placeholder="Ex: Prospecção Dezembro" 
              value={cadenceName}
              onChange={(e) => setCadenceName(e.target.value)}
              disabled={isEditMode} // Prevent editing name in edit mode for now, as it's part of the key
            />
            {isEditMode && <p className="text-xs text-muted-foreground">O nome da cadência não pode ser alterado no modo de edição para manter a integridade.</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Descreva o objetivo ou público desta cadência..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="isActive" 
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive">Cadência Ativa</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Link to="/cadences">
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </Link>
          <Button onClick={handleSaveCadence} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Salvando..." : "Salvar Cadência"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Etapas da Cadência</CardTitle>
          <CardDescription>Defina as mensagens e a ordem da sua cadência.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={handleOpenNewStepModal}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Etapa
            </Button>
          </div>
          {currentSteps.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Nenhuma etapa definida.</p>
          ) : (
            <div className="space-y-4">
              {currentSteps
                .sort((a, b) => (a.etapa_cadencia || 0) - (b.etapa_cadencia || 0))
                .map((step, index) => (
                <Card key={step.id || step.temp_id || index} className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        Etapa {step.etapa_cadencia} - {step.canal}
                      </CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEditStepModal(step)}>
                          <Edit className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveStep(step)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Remover
                        </Button>
                      </div>
                    </div>
                    {step.canal === 'EMAIL' && step.assunto_template && (
                      <CardDescription className="pt-1">Assunto: {step.assunto_template}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap truncate max-h-20 overflow-hidden">
                      {step.corpo_template}
                    </p>
                     {step.corpo_template && step.corpo_template.length > 80 && <span className="text-xs text-blue-500"> (ver mais)</span>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step Modal/Dialog */}
      <Dialog open={isStepModalOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseStepModal(); else setIsStepModalOpen(true); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStep ? "Editar Etapa" : "Nova Etapa"}</DialogTitle>
            <DialogDescription>
              Configure os detalhes da etapa da cadência.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="step-canal" className="text-right">
                Canal
              </Label>
              <Select
                value={stepFormValues.canal}
                onValueChange={(value) => setStepFormValues({ ...stepFormValues, canal: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMAIL">EMAIL</SelectItem>
                  <SelectItem value="WHATSAPP">WHATSAPP</SelectItem>
                  {/* Adicionar outros canais se necessário */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="step-etapa_cadencia" className="text-right">
                Ordem
              </Label>
              <Input
                id="step-etapa_cadencia"
                type="number"
                min="1"
                value={stepFormValues.etapa_cadencia}
                onChange={(e) => setStepFormValues({ ...stepFormValues, etapa_cadencia: parseInt(e.target.value, 10) || 1 })}
                className="col-span-3"
              />
            </div>
            {stepFormValues.canal === 'EMAIL' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="step-assunto_template" className="text-right">
                  Assunto
                </Label>
                <Input
                  id="step-assunto_template"
                  value={stepFormValues.assunto_template || ''}
                  onChange={(e) => setStepFormValues({ ...stepFormValues, assunto_template: e.target.value })}
                  className="col-span-3"
                  placeholder="Assunto do E-mail"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-start gap-4"> {/* Changed items-center to items-start for Textarea */}
              <Label htmlFor="step-corpo_template" className="text-right pt-2"> {/* Added pt-2 for alignment */}
                Corpo
              </Label>
              <Textarea
                id="step-corpo_template"
                value={stepFormValues.corpo_template}
                onChange={(e) => setStepFormValues({ ...stepFormValues, corpo_template: e.target.value })}
                className="col-span-3 min-h-[150px]"
                placeholder="Conteúdo da mensagem..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseStepModal}>Cancelar</Button>
            <Button onClick={handleSaveStep}>Salvar Etapa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CadenceForm;
