
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useInteractionEvents = (interacaoId: number) => {
  return useQuery({
    queryKey: ['interaction-events', interacaoId],
    queryFn: async () => {
      console.log('Buscando eventos analytics para interação:', interacaoId);
      
      const { data: eventos, error } = await supabase
        .from('eventos_analytics')
        .select('*')
        .eq('interacao_id', interacaoId)
        .order('timestamp_evento', { ascending: false });

      if (error) throw error;

      console.log('Eventos encontrados:', eventos?.length || 0);
      
      return eventos || [];
    },
    enabled: !!interacaoId,
  });
};
