
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRelatorios = () => {
  return useQuery({
    queryKey: ['relatorios'],
    queryFn: async () => {
      console.log('Buscando dados para relatórios...');
      
      // Buscar interações por mês
      const { data: interacoes, error: interacoesError } = await supabase
        .from('interacoes')
        .select('*')
        .order('timestamp_criacao', { ascending: false });
      
      if (interacoesError) {
        console.error('Erro ao buscar interações:', interacoesError);
        throw interacoesError;
      }

      // Buscar empresas para estatísticas
      const { data: empresas, error: empresasError } = await supabase
        .from('empresas')
        .select('*');
      
      if (empresasError) {
        console.error('Erro ao buscar empresas:', empresasError);
        throw empresasError;
      }

      // Buscar agendamentos
      const { data: agendamentos, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('*')
        .order('timestamp_criacao', { ascending: false });
      
      if (agendamentosError) {
        console.error('Erro ao buscar agendamentos:', agendamentosError);
        throw agendamentosError;
      }

      // Processar dados para gráficos
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentMonth - 5 + i + 12) % 12;
        const year = monthIndex > currentMonth ? currentYear - 1 : currentYear;
        const monthName = new Date(year, monthIndex).toLocaleDateString('pt-BR', { month: 'short' });
        
        const monthInteracoes = interacoes?.filter(int => {
          const intDate = new Date(int.timestamp_criacao || '');
          return intDate.getMonth() === monthIndex && intDate.getFullYear() === year;
        }) || [];

        const monthAgendamentos = agendamentos?.filter(ag => {
          const agDate = new Date(ag.timestamp_criacao || '');
          return agDate.getMonth() === monthIndex && agDate.getFullYear() === year;
        }) || [];

        return {
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          contacts: monthInteracoes.length,
          conversions: monthAgendamentos.length,
          emails: monthInteracoes.filter(i => i.canal === 'email').length,
          calls: monthInteracoes.filter(i => i.canal === 'telefone').length,
          whatsapp: monthInteracoes.filter(i => i.canal === 'whatsapp').length
        };
      });

      // Calcular distribuição por canal
      const totalInteracoes = interacoes?.length || 1;
      const emailCount = interacoes?.filter(i => i.canal === 'email').length || 0;
      const whatsappCount = interacoes?.filter(i => i.canal === 'whatsapp').length || 0;
      const callsCount = interacoes?.filter(i => i.canal === 'telefone').length || 0;

      const channelData = [
        { 
          name: 'E-mail', 
          value: Math.round((emailCount / totalInteracoes) * 100), 
          color: '#3b82f6' 
        },
        { 
          name: 'WhatsApp', 
          value: Math.round((whatsappCount / totalInteracoes) * 100), 
          color: '#10b981' 
        },
        { 
          name: 'Telefone', 
          value: Math.round((callsCount / totalInteracoes) * 100), 
          color: '#f59e0b' 
        }
      ];

      // Agrupar empresas por categoria/setor
      const setoresMap = new Map();
      empresas?.forEach(empresa => {
        const setor = empresa.gmn_categoria || 'Outros';
        if (!setoresMap.has(setor)) {
          setoresMap.set(setor, { companies: 0, conversions: 0 });
        }
        const sectorData = setoresMap.get(setor);
        sectorData.companies += 1;
        
        // Contar agendamentos para esta empresa
        const empresaAgendamentos = agendamentos?.filter(ag => ag.empresa_id === empresa.id).length || 0;
        sectorData.conversions += empresaAgendamentos;
      });

      const sectorData = Array.from(setoresMap.entries())
        .map(([sector, data]) => ({
          sector,
          companies: data.companies,
          conversions: data.conversions
        }))
        .sort((a, b) => b.companies - a.companies)
        .slice(0, 5);

      console.log('Dados de relatórios processados');
      
      return {
        monthlyData,
        channelData,
        sectorData,
        stats: {
          totalContatos: interacoes?.length || 0,
          taxaConversao: totalInteracoes > 0 ? Math.round((agendamentos?.length || 0) / totalInteracoes * 100) : 0,
          tempoMedioResposta: '2.3d', // Placeholder - seria necessário calcular baseado nos dados
          agendamentos: agendamentos?.length || 0
        }
      };
    },
  });
};
