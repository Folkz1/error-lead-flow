
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEmpresasSelect = () => {
  return useQuery({
    queryKey: ['empresas-select'],
    queryFn: async () => {
      console.log('Buscando empresas para seleção...');
      
      const { data, error } = await supabase
        .from('empresas')
        .select('id, dominio, nome_empresa_pagina, nome_empresa_gmn')
        .order('nome_empresa_pagina', { ascending: true, nullsFirst: false })
        .order('dominio', { ascending: true });
      
      if (error) {
        console.error('Erro ao buscar empresas para seleção:', error);
        throw error;
      }
      
      // Formatear dados para uso em selects
      const empresasFormatadas = data?.map(empresa => ({
        id: empresa.id,
        label: empresa.nome_empresa_pagina || empresa.nome_empresa_gmn || empresa.dominio,
        dominio: empresa.dominio
      })) || [];
      
      console.log('Empresas para seleção encontradas:', empresasFormatadas.length);
      return empresasFormatadas;
    },
  });
};
