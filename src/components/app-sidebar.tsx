
import { Calendar, Home, Building2, Users, MessageSquare, TrendingUp, Settings, Layers3, UserCheck, BarChart3, MessageCircle, Clock } from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Empresas/Leads",
    url: "/companies",
    icon: Building2,
  },
  {
    title: "Cadências",
    url: "/cadences",
    icon: Layers3,
  },
  {
    title: "Contatos",
    url: "/contacts",
    icon: Users,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: MessageSquare,
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Follow-ups",
    url: "/followups",
    icon: Clock,
  },
  {
    title: "Interações",
    url: "/interactions",
    icon: MessageCircle,
  },
  {
    title: "Relatórios",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">ErrorLeadFlow</h2>
            <p className="text-xs text-gray-600">CRM Automatizado</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          ErrorLeadFlow CRM v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
