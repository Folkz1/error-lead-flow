
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAtividadeRecente = () => {
  return useQuery({
    queryKey: ['atividade-recente'],
    queryFn: async () => {
      console.log('Buscando atividade recente...');
      
      const { data: interacoes, error } = await supabase
        .from('interacoes')
        .select(`
          *,
          empresas!fk_interacoes_empresa_id (
            dominio,
            nome_empresa_pagina,
            nome_empresa_gmn
          )
        `)
        .order('timestamp_criacao', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Erro ao buscar atividade recente:', error);
        throw error;
      }
      
      console.log('Atividades recentes encontradas:', interacoes?.length);
      return interacoes || [];
    },
  });
};
