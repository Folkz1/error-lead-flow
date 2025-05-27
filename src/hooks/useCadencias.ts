
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type EmpresaCadencia = Tables<'empresas'> & {
  eventos_erro?: Tables<'eventos_erro'>[];
  contatos_empresa?: Tables<'contatos_empresa'>[];
  interacoes?: Tables<'interacoes'>[];
  agendamentos?: Tables<'agendamentos'>[];
  tarefas_follow_up?: Tables<'tarefas_follow_up'>[];
};

export const useCadencias = () => {
  return useQuery({
    queryKey: ['cadencias'],
    queryFn: async () => {
      console.log('Buscando empresas em cadência...');
      
      const { data: empresas, error } = await supabase
        .from('empresas')
        .select(`
          *,
          eventos_erro!fk_eventos_erro_empresa_id (*),
          contatos_empresa!fk_contatos_empresa_empresa_id (*),
          interacoes!fk_interacoes_empresa_id (*),
          agendamentos!fk_agendamentos_empresa_id (*),
          tarefas_follow_up!tarefas_follow_up_empresa_id_fkey (*)
        `)
        .order('data_ultima_atualizacao', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar cadências:', error);
        throw error;
      }
      
      console.log('Empresas em cadência encontradas:', empresas?.length);
      return empresas as EmpresaCadencia[];
    },
  });
};

export const useEmpresaDetalhada = (empresaId: number) => {
  return useQuery({
    queryKey: ['empresa-detalhada', empresaId],
    queryFn: async () => {
      console.log('Buscando detalhes da empresa:', empresaId);
      
      const { data: empresa, error } = await supabase
        .from('empresas')
        .select(`
          *,
          eventos_erro!fk_eventos_erro_empresa_id (*),
          contatos_empresa!fk_contatos_empresa_empresa_id (*),
          interacoes!fk_interacoes_empresa_id (*),
          agendamentos!fk_agendamentos_empresa_id (*),
          tarefas_follow_up!tarefas_follow_up_empresa_id_fkey (*)
        `)
        .eq('id', empresaId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar detalhes da empresa:', error);
        throw error;
      }
      
      return empresa as EmpresaCadencia;
    },
    enabled: !!empresaId,
  });
};
