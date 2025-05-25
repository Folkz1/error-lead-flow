
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Plus, Search, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added imports
import { EmpresasList } from "@/components/EmpresasList";
import { useState } from "react";
import { useEmpresas } from "@/hooks/useEmpresas"; // Added import

// Define Status Options
const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "sucesso_contato_realizado", label: "Sucesso" },
  { value: "apta_para_nova_cadencia", label: "Apta" },
  { value: "nao_perturbe", label: "Não Perturbe" },
  { value: "fluxo_concluido_sem_resposta", label: "Sem Resposta" },
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos"); // Added statusFilter state

  // Moved useEmpresas hook call
  const { data: empresas, isLoading, error } = useEmpresas(searchTerm, statusFilter);

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Empresas</h2>
          <p className="text-gray-600 mt-1">Gerencie todas as empresas prospectadas e seus status de cadência.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buscar e Filtrar</CardTitle>
          <CardDescription>Encontre empresas específicas ou filtre por status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome da empresa ou domínio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            {/* Wrapped Button with DropdownMenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  {statusOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Lista de Empresas</h3>
        </div>
        {/* Passed props to EmpresasList */}
        <EmpresasList empresas={empresas} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default Companies;
