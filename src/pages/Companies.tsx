
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, Filter } from "lucide-react";
import { EmpresasList } from "@/components/empresa/EmpresasList";
import { EmpresaModal } from "@/components/empresa/EmpresaModal";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Empresas</h2>
          <p className="text-gray-600 mt-1">Gerencie todas as empresas prospectadas e seus status de cadência.</p>
        </div>
        <EmpresaModal mode="create" />
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="sucesso_contato_realizado">Sucesso</SelectItem>
                <SelectItem value="apta_para_contato">Apta para Contato</SelectItem>
                <SelectItem value="em_cadencia">Em Cadência</SelectItem>
                <SelectItem value="aguardando_resposta">Aguardando Resposta</SelectItem>
                <SelectItem value="nao_perturbe">Não Perturbe</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Building2 className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Lista de Empresas</h3>
        </div>
        <EmpresasList searchTerm={searchTerm} statusFilter={statusFilter} />
      </div>
    </div>
  );
};

export default Companies;
