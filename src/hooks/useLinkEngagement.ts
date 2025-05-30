
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LinkEngagementFilters {
  startDate?: string;
  endDate?: string;
  linkType?: string;
  empresaId?: number;
}

export const useLinkEngagement = (filters: LinkEngagementFilters = {}) => {
  return useQuery({
    queryKey: ['link-engagement', filters],
    queryFn: async () => {
      console.log('Buscando dados de engajamento com links:', filters);
      
      // Buscar métricas de cliques
      let metricsQuery = supabase
        .from('metricas_cliques_links')
        .select('*');

      const { data: metricas, error: metricsError } = await metricsQuery;
      if (metricsError) throw metricsError;

      // Buscar eventos analytics para gráfico temporal
      let eventsQuery = supabase
        .from('eventos_analytics')
        .select('timestamp_evento, tipo_evento, identificador_link_pai, url_destino, empresa_id')
        .eq('tipo_evento', 'click');

      if (filters.startDate) {
        eventsQuery = eventsQuery.gte('timestamp_evento', filters.startDate);
      }
      if (filters.endDate) {
        eventsQuery = eventsQuery.lte('timestamp_evento', filters.endDate);
      }
      if (filters.linkType && filters.linkType !== 'todos') {
        eventsQuery = eventsQuery.eq('identificador_link_pai', filters.linkType);
      }
      if (filters.empresaId) {
        eventsQuery = eventsQuery.eq('empresa_id', filters.empresaId);
      }

      const { data: eventos, error: eventsError } = await eventsQuery;
      if (eventsError) throw eventsError;

      // Processar dados para o gráfico temporal (cliques por dia)
      const clicksByDay = eventos?.reduce((acc, evento) => {
        const date = new Date(evento.timestamp_evento).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const dailyData = Object.entries(clicksByDay).map(([date, clicks]) => ({
        date,
        clicks
      })).sort((a, b) => a.date.localeCompare(b.date));

      // Calcular totais
      const totalClicks = eventos?.length || 0;
      const uniqueLinks = new Set(eventos?.map(e => e.identificador_link_pai)).size || 0;

      // Processar dados das métricas para a tabela
      const linkMetrics = metricas?.map(metrica => ({
        id: metrica.id,
        descricao: metrica.descricao_link || metrica.identificador_link,
        identificador: metrica.identificador_link,
        urlDestino: metrica.url_destino_base,
        totalCliques: metrica.total_cliques,
        dataUltimoClique: metrica.data_ultimo_clique,
        dataPrimeiroClique: metrica.data_primeiro_clique
      })) || [];

      console.log('Dados de engajamento processados');
      
      return {
        totalClicks,
        uniqueLinks,
        dailyData,
        linkMetrics,
        recentEvents: eventos || []
      };
    },
  });
};
