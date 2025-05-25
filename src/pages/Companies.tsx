
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Building2, 
  Mail, 
  Phone, 
  Globe,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const companiesData = [
  {
    id: 1,
    name: "Tech Solutions Inc.",
    domain: "techsolutions.com.br",
    sector: "Tecnologia",
    size: "100-500",
    location: "São Paulo, SP",
    contact: "Ana Silva",
    status: "cadencia_dia1_ativa",
    statusLabel: "Ativo",
    lastContact: "2024-07-25",
    totalAttempts: 2,
    currentError: "SSL Certificate expired"
  },
  {
    id: 2,
    name: "Global Retail Co.",
    domain: "globalretail.com",
    sector: "Varejo",
    size: "500+",
    location: "Rio de Janeiro, RJ",
    contact: "Carlos Mendes",
    status: "fluxo_concluido_sem_resposta",
    statusLabel: "Inativo",
    lastContact: "2024-07-20",
    totalAttempts: 7,
    currentError: null
  },
  {
    id: 3,
    name: "EduTech Innovations",
    domain: "edutech.edu.br",
    sector: "Educação",
    size: "50-100",
    location: "Belo Horizonte, MG",
    contact: "Mariana Costa",
    status: "cadencia_dia2_ativa",
    statusLabel: "Ativo",
    lastContact: "2024-07-23",
    totalAttempts: 1,
    currentError: "Page loading timeout"
  },
  {
    id: 4,
    name: "HealthFirst Group",
    domain: "healthfirst.med.br",
    sector: "Saúde",
    size: "200-500",
    location: "Porto Alegre, RS",
    contact: "Ricardo Almeida",
    status: "sucesso_contato_realizado",
    statusLabel: "Ativo",
    lastContact: "2024-07-24",
    totalAttempts: 3,
    currentError: null
  },
  {
    id: 5,
    name: "AgriCorp Ltd.",
    domain: "agricorp.agro.br",
    sector: "Agricultura",
    size: "1000+",
    location: "Brasília, DF",
    contact: "Fernanda Lima",
    status: "nao_perturbe",
    statusLabel: "Inativo",
    lastContact: "2024-07-18",
    totalAttempts: 5,
    currentError: null
  }
];

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "cadencia_dia1_ativa":
    case "cadencia_dia2_ativa":
    case "cadencia_dia3_ativa":
    case "sucesso_contato_realizado":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "fluxo_concluido_sem_resposta":
    case "nao_perturbe":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "aguardando_reforco1_dia1":
    case "aguardando_reforco2_dia1":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredCompanies = companiesData.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "all" || company.sector === selectedSector;
    const matchesSize = selectedSize === "all" || company.size === selectedSize;
    const matchesStatus = selectedStatus === "all" || company.statusLabel === selectedStatus;
    
    return matchesSearch && matchesSector && matchesSize && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Empresas</h2>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe todas as empresas em suas cadências de contato.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Empresa
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar empresas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
            </div>
            
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Setor" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md">
                <SelectItem value="all">Todos os Setores</SelectItem>
                <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                <SelectItem value="Varejo">Varejo</SelectItem>
                <SelectItem value="Educação">Educação</SelectItem>
                <SelectItem value="Saúde">Saúde</SelectItem>
                <SelectItem value="Agricultura">Agricultura</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Tamanho da Empresa" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md">
                <SelectItem value="all">Todos os Tamanhos</SelectItem>
                <SelectItem value="50-100">50-100</SelectItem>
                <SelectItem value="100-500">100-500</SelectItem>
                <SelectItem value="500+">500+</SelectItem>
                <SelectItem value="1000+">1000+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md">
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Empresas</span>
            <span className="text-sm font-normal text-gray-600">
              {filteredCompanies.length} de {companiesData.length} empresas
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Empresa</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Contato Principal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-600">{company.domain}</div>
                          {company.currentError && (
                            <div className="text-xs text-red-600 mt-1">
                              Erro: {company.currentError}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {company.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{company.size}</TableCell>
                    <TableCell className="text-gray-600">{company.location}</TableCell>
                    <TableCell className="text-gray-600">{company.contact}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(company.status)}>
                        {company.statusLabel}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {company.totalAttempts} tentativa(s)
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                            <Building2 className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                            <Mail className="h-4 w-4 mr-2" />
                            Enviar e-mail
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                            <Phone className="h-4 w-4 mr-2" />
                            Ligar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                            <Globe className="h-4 w-4 mr-2" />
                            Visitar site
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-600">
              Mostrando 1 de 5 resultados
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                4
              </Button>
              <Button variant="outline" size="sm">
                5
              </Button>
              <Button variant="outline" size="sm">
                Próximo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Companies;
