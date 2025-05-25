
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, GitBranch, Edit3, Trash2 } from "lucide-react"; // Added Edit3, Trash2
import { useTemplates, useDeleteTemplateMessage } from "@/hooks/useTemplates"; // Added useDeleteTemplateMessage
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import type { Tables } from '@/integrations/supabase/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Added AlertDialog components
import { useToast } from "@/components/ui/use-toast"; // Added useToast

// Type for individual template messages (steps of a cadence)
type TemplateMensagem = Tables<'templates_mensagens'>;

// Interface for a grouped cadence
interface GroupedCadence {
  name: string;
  steps: TemplateMensagem[];
  description?: string;
  isActive?: boolean;
}

const Cadences = () => {
  const navigate = useNavigate(); // Instantiated useNavigate
  const { toast } = useToast(); // Instantiated useToast
  const deleteTemplateMessage = useDeleteTemplateMessage(); // Instantiated useDeleteTemplateMessage

  // Fetch all templates (no canal filter)
  const { data: templatesMessages, isLoading, error } = useTemplates();

  const handleDeleteCadence = async (cadenceName: string, steps: TemplateMensagem[]) => {
    toast({
      title: "Excluindo...",
      description: `A cadência "${cadenceName}" está sendo excluída.`,
    });
    try {
      for (const step of steps) {
        await deleteTemplateMessage.mutateAsync({ id: step.id });
      }
      toast({
        title: "Sucesso!",
        description: `Cadência "${cadenceName}" excluída com sucesso.`,
        variant: "default",
      });
      // Query invalidation is handled by the onSuccess of useDeleteTemplateMessage
    } catch (error) {
      console.error("Erro ao excluir cadência:", error);
      toast({
        title: "Erro ao excluir",
        description: `Não foi possível excluir a cadência "${cadenceName}". Tente novamente.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center">Carregando cadências...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6 overflow-auto">
        <div className="text-center text-red-600">
          Erro ao carregar cadências: {error.message}
        </div>
      </div>
    );
  }

  // Grouping logic
  const groupedCadencesArray: GroupedCadence[] = [];
  if (templatesMessages) {
    const cadencesMap = new Map<string, TemplateMensagem[]>();
    for (const msg of templatesMessages) {
      if (!cadencesMap.has(msg.nome_template)) {
        cadencesMap.set(msg.nome_template, []);
      }
      cadencesMap.get(msg.nome_template)!.push(msg);
    }
    
    Array.from(cadencesMap.entries()).forEach(([name, steps]) => {
      const sortedSteps = steps.sort((a, b) => a.etapa_cadencia - b.etapa_cadencia);
      groupedCadencesArray.push({
        name,
        steps: sortedSteps,
        description: sortedSteps[0]?.descricao_interna || undefined,
        isActive: sortedSteps[0]?.ativo !== undefined ? sortedSteps[0]?.ativo : undefined,
      });
    });
  }

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Gerenciar Cadências</h2>
          <p className="text-gray-600 mt-1">Crie, visualize e gerencie suas cadências de prospecção.</p>
        </div>
        <Link to="/cadences/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cadência
          </Button>
        </Link>
      </div>

      {/* Cadences List */}
      {groupedCadencesArray.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Nenhuma cadência encontrada.</p>
            <p className="text-center text-gray-500 text-sm mt-2">
              Crie sua primeira cadência clicando em "Nova Cadência".
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupedCadencesArray.map((cadence) => (
          <Card key={cadence.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl font-semibold">{cadence.name}</CardTitle>
                {cadence.isActive !== undefined && (
                  <Badge className={cadence.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {cadence.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                )}
              </div>
              {cadence.description && (
                <CardDescription className="mt-1 text-sm text-gray-500">
                  {cadence.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <GitBranch className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{cadence.steps.length} etapa(s)</span>
                </div>
                {/* Further details can be added here if needed */}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-auto">
              <div className="flex w-full justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/cadences/edit/${encodeURIComponent(cadence.name)}`)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso excluirá permanentemente a cadência "{cadence.name}" e todas as suas {cadence.steps.length} etapa(s).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCadence(cadence.name, cadence.steps)}>
                        Confirmar Exclusão
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cadences;
