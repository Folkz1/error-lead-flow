
import type { EtapaCadencia } from './types';

export const VARIAVEIS_DISPONIVEIS = [
  '{{nome_lead}}',
  '{{dominio}}',
  '{{tipo_erro}}',
  '{{empresa_nome}}',
  '{{url_erro}}',
  '{{data_deteccao}}',
  '{{link_agendamento}}',
  '{{nome_consultor}}'
];

export const ETAPAS_CADENCIA: EtapaCadencia[] = [
  { grupo: 'Dia 1', opcoes: [
    { value: 101, label: 'Dia 1 - Primeira abordagem (101)' },
    { value: 102, label: 'Dia 1 - Reforço 1 (102)' },
    { value: 103, label: 'Dia 1 - Reforço 2 (103)' }
  ]},
  { grupo: 'Dia 2', opcoes: [
    { value: 201, label: 'Dia 2 - Primeira mensagem (201)' },
    { value: 202, label: 'Dia 2 - Reforço 1 (202)' },
    { value: 203, label: 'Dia 2 - Reforço 2 (203)' }
  ]},
  { grupo: 'Dia 3', opcoes: [
    { value: 301, label: 'Dia 3 - Última tentativa (301)' },
    { value: 302, label: 'Dia 3 - Reforço final (302)' },
    { value: 303, label: 'Dia 3 - Encerramento (303)' }
  ]}
];

export const EXEMPLOS_VARIAVEIS: Record<string, string> = {
  '{{nome_lead}}': 'João Silva',
  '{{dominio}}': 'example.com',
  '{{tipo_erro}}': '404 - Página não encontrada',
  '{{empresa_nome}}': 'Empresa ABC',
  '{{url_erro}}': 'https://example.com/pagina',
  '{{data_deteccao}}': new Date().toLocaleDateString(),
  '{{link_agendamento}}': 'https://calendly.com/exemplo',
  '{{nome_consultor}}': 'Maria Santos'
};
