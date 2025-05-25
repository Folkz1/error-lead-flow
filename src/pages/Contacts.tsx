
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Mail, 
  Phone, 
  MessageSquare,
  Plus,
  Filter,
  MoreHorizontal,
  Building2
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const contactsData = [
  {
    id: 1,
    name: "Ana Silva",
    email: "ana.silva@techsolutions.com",
    phone: "+55 11 99999-9999",
    company: "Tech Solutions Inc.",
    position: "CTO",
    status: "ativo",
    lastContact: "2024-07-25",
    whatsappBusiness: true,
    gmn: false
  },
  {
    id: 2,
    name: "Carlos Mendes",
    email: "carlos@globalretail.com",
    phone: "+55 21 88888-8888",
    company: "Global Retail Co.",
    position: "CEO",
    status: "sem_resposta",
    lastContact: "2024-07-20",
    whatsappBusiness: false,
    gmn: true
  },
  {
    id: 3,
    name: "Mariana Costa",
    email: "mariana@edutech.edu.br",
    phone: "+55 31 77777-7777",
    company: "EduTech Innovations",
    position: "Diretora de TI",
    status: "respondido",
    lastContact: "2024-07-23",
    whatsappBusiness: true,
    gmn: false
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "ativo":
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    case "sem_resposta":
      return <Badge className="bg-yellow-100 text-yellow-800">Sem Resposta</Badge>;
    case "respondido":
      return <Badge className="bg-blue-100 text-blue-800">Respondido</Badge>;
    case "nao_usar":
      return <Badge className="bg-red-100 text-red-800">Não Usar</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
  }
};

const Contacts = () => {
  return (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Contatos</h2>
          <p className="text-gray-600 mt-1">Gerencie todos os contatos das empresas em sua pipeline.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Contato
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar contatos..."
                  className="pl-9 bg-white"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contato</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactsData.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.email}</div>
                          <div className="text-xs text-gray-500">{contact.position}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{contact.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{contact.phone}</span>
                        {contact.whatsappBusiness && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            WhatsApp Business
                          </Badge>
                        )}
                        {contact.gmn && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            GMN
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell className="text-gray-600">{contact.lastContact}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contacts;
