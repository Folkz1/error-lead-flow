export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agendamentos: {
        Row: {
          agendado_por: string | null
          description_gcal: string | null
          empresa_id: number
          end_time: string | null
          google_calender_event_id: string | null
          id: number
          id_evento_erro: number | null
          interacao_id: number | null
          link_evento_calendar: string | null
          notas_agendamento: string | null
          start_time: string | null
          status_agendamento: string | null
          status_lembrete: string | null
          summary_gcal: string | null
          timestamp_agendamento: string
          timestamp_criacao: string | null
        }
        Insert: {
          agendado_por?: string | null
          description_gcal?: string | null
          empresa_id: number
          end_time?: string | null
          google_calender_event_id?: string | null
          id?: number
          id_evento_erro?: number | null
          interacao_id?: number | null
          link_evento_calendar?: string | null
          notas_agendamento?: string | null
          start_time?: string | null
          status_agendamento?: string | null
          status_lembrete?: string | null
          summary_gcal?: string | null
          timestamp_agendamento: string
          timestamp_criacao?: string | null
        }
        Update: {
          agendado_por?: string | null
          description_gcal?: string | null
          empresa_id?: number
          end_time?: string | null
          google_calender_event_id?: string | null
          id?: number
          id_evento_erro?: number | null
          interacao_id?: number | null
          link_evento_calendar?: string | null
          notas_agendamento?: string | null
          start_time?: string | null
          status_agendamento?: string | null
          status_lembrete?: string | null
          summary_gcal?: string | null
          timestamp_agendamento?: string
          timestamp_criacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_interacao_id_fkey"
            columns: ["interacao_id"]
            isOneToOne: false
            referencedRelation: "interacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agendamentos_empresa_id"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agendamentos_id_evento_erro"
            columns: ["id_evento_erro"]
            isOneToOne: false
            referencedRelation: "eventos_erro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_agendamentos_interacao_id"
            columns: ["interacao_id"]
            isOneToOne: false
            referencedRelation: "interacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_cadencia: {
        Row: {
          ativo: boolean | null
          cooldown_entre_cadencias_dias: number | null
          data_criacao: string | null
          data_ultima_atualizacao: string | null
          dias_semana_funcionamento: string[] | null
          horario_fim_funcionamento: string | null
          horario_inicio_funcionamento: string | null
          id: number
          intervalo_max_entre_mensagens_global_segundos: number | null
          intervalo_min_entre_mensagens_global_segundos: number | null
          intervalo_reforco1_horas: number | null
          intervalo_reforco2_horas: number | null
          limite_max_novas_abordagens_dia: number | null
          max_cadencias_por_empresa: number | null
          max_dias_cadencia_por_evento: number | null
          max_mensagens_dia1: number | null
          max_mensagens_dia2: number | null
          max_mensagens_dia3: number | null
          nome_configuracao: string
        }
        Insert: {
          ativo?: boolean | null
          cooldown_entre_cadencias_dias?: number | null
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          dias_semana_funcionamento?: string[] | null
          horario_fim_funcionamento?: string | null
          horario_inicio_funcionamento?: string | null
          id?: number
          intervalo_max_entre_mensagens_global_segundos?: number | null
          intervalo_min_entre_mensagens_global_segundos?: number | null
          intervalo_reforco1_horas?: number | null
          intervalo_reforco2_horas?: number | null
          limite_max_novas_abordagens_dia?: number | null
          max_cadencias_por_empresa?: number | null
          max_dias_cadencia_por_evento?: number | null
          max_mensagens_dia1?: number | null
          max_mensagens_dia2?: number | null
          max_mensagens_dia3?: number | null
          nome_configuracao: string
        }
        Update: {
          ativo?: boolean | null
          cooldown_entre_cadencias_dias?: number | null
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          dias_semana_funcionamento?: string[] | null
          horario_fim_funcionamento?: string | null
          horario_inicio_funcionamento?: string | null
          id?: number
          intervalo_max_entre_mensagens_global_segundos?: number | null
          intervalo_min_entre_mensagens_global_segundos?: number | null
          intervalo_reforco1_horas?: number | null
          intervalo_reforco2_horas?: number | null
          limite_max_novas_abordagens_dia?: number | null
          max_cadencias_por_empresa?: number | null
          max_dias_cadencia_por_evento?: number | null
          max_mensagens_dia1?: number | null
          max_mensagens_dia2?: number | null
          max_mensagens_dia3?: number | null
          nome_configuracao?: string
        }
        Relationships: []
      }
      contatos_empresa: {
        Row: {
          data_adicao: string | null
          descricao: string | null
          empresa_id: number
          fonte_contato: string | null
          gmn: boolean | null
          id: number
          status_contato: string | null
          tipo_contato: string
          valor_contato: string
          whatsapp_valido: boolean | null
          whatsappbusiness: boolean | null
        }
        Insert: {
          data_adicao?: string | null
          descricao?: string | null
          empresa_id: number
          fonte_contato?: string | null
          gmn?: boolean | null
          id?: number
          status_contato?: string | null
          tipo_contato: string
          valor_contato: string
          whatsapp_valido?: boolean | null
          whatsappbusiness?: boolean | null
        }
        Update: {
          data_adicao?: string | null
          descricao?: string | null
          empresa_id?: number
          fonte_contato?: string | null
          gmn?: boolean | null
          id?: number
          status_contato?: string | null
          tipo_contato?: string
          valor_contato?: string
          whatsapp_valido?: boolean | null
          whatsappbusiness?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contatos_empresa_empresa_id"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          bitrix_lead_id: string | null
          contador_total_tentativas_cadencia: number | null
          data_criacao: string | null
          data_ultima_atualizacao: string | null
          data_ultimo_erro_site: string | null
          dominio: string
          emails_scraping: string | null
          gmn_categoria: string | null
          gmn_encontrado: boolean | null
          gmn_endereco: string | null
          gmn_horarios_funcionamento: Json | null
          gmn_place_id: string | null
          gmn_rating: number | null
          gmn_ratings_total: number | null
          gmn_status: string | null
          gmn_telefone: string | null
          gmn_website: string | null
          id: number
          id_evento_erro_atual: number | null
          links_sociais_scraping: string | null
          nome_empresa_gmn: string | null
          nome_empresa_pagina: string | null
          notas_internas: string | null
          status_acao_pos_espera: string | null
          status_cadencia_geral: string | null
          status_geral: string | null
          status_scraping_t1: string | null
          status_scraping_t2: string | null
          telefones_scraping: string | null
          timestamp_para_ligacao: string | null
          timestamp_proxima_tentativa_permitida: string | null
          timestamp_ultima_tentativa_cadencia: string | null
          tipo_ultimo_erro_site: string | null
          url_inicial: string | null
        }
        Insert: {
          bitrix_lead_id?: string | null
          contador_total_tentativas_cadencia?: number | null
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          data_ultimo_erro_site?: string | null
          dominio: string
          emails_scraping?: string | null
          gmn_categoria?: string | null
          gmn_encontrado?: boolean | null
          gmn_endereco?: string | null
          gmn_horarios_funcionamento?: Json | null
          gmn_place_id?: string | null
          gmn_rating?: number | null
          gmn_ratings_total?: number | null
          gmn_status?: string | null
          gmn_telefone?: string | null
          gmn_website?: string | null
          id?: number
          id_evento_erro_atual?: number | null
          links_sociais_scraping?: string | null
          nome_empresa_gmn?: string | null
          nome_empresa_pagina?: string | null
          notas_internas?: string | null
          status_acao_pos_espera?: string | null
          status_cadencia_geral?: string | null
          status_geral?: string | null
          status_scraping_t1?: string | null
          status_scraping_t2?: string | null
          telefones_scraping?: string | null
          timestamp_para_ligacao?: string | null
          timestamp_proxima_tentativa_permitida?: string | null
          timestamp_ultima_tentativa_cadencia?: string | null
          tipo_ultimo_erro_site?: string | null
          url_inicial?: string | null
        }
        Update: {
          bitrix_lead_id?: string | null
          contador_total_tentativas_cadencia?: number | null
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          data_ultimo_erro_site?: string | null
          dominio?: string
          emails_scraping?: string | null
          gmn_categoria?: string | null
          gmn_encontrado?: boolean | null
          gmn_endereco?: string | null
          gmn_horarios_funcionamento?: Json | null
          gmn_place_id?: string | null
          gmn_rating?: number | null
          gmn_ratings_total?: number | null
          gmn_status?: string | null
          gmn_telefone?: string | null
          gmn_website?: string | null
          id?: number
          id_evento_erro_atual?: number | null
          links_sociais_scraping?: string | null
          nome_empresa_gmn?: string | null
          nome_empresa_pagina?: string | null
          notas_internas?: string | null
          status_acao_pos_espera?: string | null
          status_cadencia_geral?: string | null
          status_geral?: string | null
          status_scraping_t1?: string | null
          status_scraping_t2?: string | null
          telefones_scraping?: string | null
          timestamp_para_ligacao?: string | null
          timestamp_proxima_tentativa_permitida?: string | null
          timestamp_ultima_tentativa_cadencia?: string | null
          tipo_ultimo_erro_site?: string | null
          url_inicial?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresas_id_evento_erro_atual"
            columns: ["id_evento_erro_atual"]
            isOneToOne: false
            referencedRelation: "eventos_erro"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_analytics: {
        Row: {
          agendamento_id: number | null
          contato_id: number | null
          dados_adicionais: Json | null
          empresa_id: number | null
          id: number
          identificador_link_pai: string | null
          interacao_id: number | null
          origem_evento_detalhada: string | null
          template_mensagem_id: number | null
          timestamp_evento: string
          tipo_evento: string
          url_destino: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          agendamento_id?: number | null
          contato_id?: number | null
          dados_adicionais?: Json | null
          empresa_id?: number | null
          id?: number
          identificador_link_pai?: string | null
          interacao_id?: number | null
          origem_evento_detalhada?: string | null
          template_mensagem_id?: number | null
          timestamp_evento?: string
          tipo_evento: string
          url_destino?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          agendamento_id?: number | null
          contato_id?: number | null
          dados_adicionais?: Json | null
          empresa_id?: number | null
          id?: number
          identificador_link_pai?: string | null
          interacao_id?: number | null
          origem_evento_detalhada?: string | null
          template_mensagem_id?: number | null
          timestamp_evento?: string
          tipo_evento?: string
          url_destino?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_analytics_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_analytics_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_analytics_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_analytics_identificador_link_pai_fkey"
            columns: ["identificador_link_pai"]
            isOneToOne: false
            referencedRelation: "metricas_cliques_links"
            referencedColumns: ["identificador_link"]
          },
          {
            foreignKeyName: "eventos_analytics_interacao_id_fkey"
            columns: ["interacao_id"]
            isOneToOne: false
            referencedRelation: "interacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_analytics_template_mensagem_id_fkey"
            columns: ["template_mensagem_id"]
            isOneToOne: false
            referencedRelation: "templates_mensagens"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_erro: {
        Row: {
          data_criacao: string | null
          data_ultima_atualizacao: string | null
          detalhes_erro_payload: string | null
          dia_atual_na_cadencia: number | null
          empresa_id: number
          id: number
          id_cadencia_associada: number | null
          id_evento_erro_externo: string | null
          nome_erro: string | null
          status_processamento_evento: string | null
          timestamp_erro_detectado: string | null
          tipo_erro_site: string | null
          url_site_com_erro: string
        }
        Insert: {
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          detalhes_erro_payload?: string | null
          dia_atual_na_cadencia?: number | null
          empresa_id: number
          id?: number
          id_cadencia_associada?: number | null
          id_evento_erro_externo?: string | null
          nome_erro?: string | null
          status_processamento_evento?: string | null
          timestamp_erro_detectado?: string | null
          tipo_erro_site?: string | null
          url_site_com_erro: string
        }
        Update: {
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          detalhes_erro_payload?: string | null
          dia_atual_na_cadencia?: number | null
          empresa_id?: number
          id?: number
          id_cadencia_associada?: number | null
          id_evento_erro_externo?: string | null
          nome_erro?: string | null
          status_processamento_evento?: string | null
          timestamp_erro_detectado?: string | null
          tipo_erro_site?: string | null
          url_site_com_erro?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_eventos_erro_empresa_id"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      interacoes: {
        Row: {
          agente_ia_usado: string | null
          canal: string
          contato_id: string | null
          contato_utilizado: string | null
          custo_estimado: number | null
          direcao: string | null
          empresa_id: number
          followup_clique_link_enviado: boolean | null
          google_calender_event_id: string | null
          id: number
          id_evento_erro: number | null
          link_bitrix_enviado_timestamp: string | null
          log_completo_ia: Json | null
          log_resumido_ia: string | null
          prompt_usado: string | null
          referencia_externa_id: string | null
          resposta_ia: string | null
          status_interacao: string
          timestamp_criacao: string | null
          timestamp_fim: string | null
          timestamp_ultima_atualizacao: string | null
          ultima_mensagem_agente_timestamp: string | null
          ultima_mensagem_usuario_timestamp: string | null
          ultimo_agente_processado: string | null
        }
        Insert: {
          agente_ia_usado?: string | null
          canal: string
          contato_id?: string | null
          contato_utilizado?: string | null
          custo_estimado?: number | null
          direcao?: string | null
          empresa_id: number
          followup_clique_link_enviado?: boolean | null
          google_calender_event_id?: string | null
          id?: number
          id_evento_erro?: number | null
          link_bitrix_enviado_timestamp?: string | null
          log_completo_ia?: Json | null
          log_resumido_ia?: string | null
          prompt_usado?: string | null
          referencia_externa_id?: string | null
          resposta_ia?: string | null
          status_interacao: string
          timestamp_criacao?: string | null
          timestamp_fim?: string | null
          timestamp_ultima_atualizacao?: string | null
          ultima_mensagem_agente_timestamp?: string | null
          ultima_mensagem_usuario_timestamp?: string | null
          ultimo_agente_processado?: string | null
        }
        Update: {
          agente_ia_usado?: string | null
          canal?: string
          contato_id?: string | null
          contato_utilizado?: string | null
          custo_estimado?: number | null
          direcao?: string | null
          empresa_id?: number
          followup_clique_link_enviado?: boolean | null
          google_calender_event_id?: string | null
          id?: number
          id_evento_erro?: number | null
          link_bitrix_enviado_timestamp?: string | null
          log_completo_ia?: Json | null
          log_resumido_ia?: string | null
          prompt_usado?: string | null
          referencia_externa_id?: string | null
          resposta_ia?: string | null
          status_interacao?: string
          timestamp_criacao?: string | null
          timestamp_fim?: string | null
          timestamp_ultima_atualizacao?: string | null
          ultima_mensagem_agente_timestamp?: string | null
          ultima_mensagem_usuario_timestamp?: string | null
          ultimo_agente_processado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_interacoes_empresa_id"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_interacoes_id_evento_erro"
            columns: ["id_evento_erro"]
            isOneToOne: false
            referencedRelation: "eventos_erro"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_ia: {
        Row: {
          ativo: boolean | null
          data_criacao: string | null
          data_ultima_atualizacao: string | null
          id: number
          kb_content: string
          kb_contexto_uso: string | null
          kb_key: string
          kb_type: string
        }
        Insert: {
          ativo?: boolean | null
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          id?: number
          kb_content: string
          kb_contexto_uso?: string | null
          kb_key: string
          kb_type: string
        }
        Update: {
          ativo?: boolean | null
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          id?: number
          kb_content?: string
          kb_contexto_uso?: string | null
          kb_key?: string
          kb_type?: string
        }
        Relationships: []
      }
      log_controle_diario: {
        Row: {
          data_execucao: string
          novas_abordagens_iniciadas_hoje: number | null
        }
        Insert: {
          data_execucao: string
          novas_abordagens_iniciadas_hoje?: number | null
        }
        Update: {
          data_execucao?: string
          novas_abordagens_iniciadas_hoje?: number | null
        }
        Relationships: []
      }
      metricas_cliques_links: {
        Row: {
          data_criacao_registro: string
          data_primeiro_clique: string | null
          data_ultima_atualizacao_registro: string
          data_ultimo_clique: string | null
          descricao_link: string | null
          id: number
          identificador_link: string
          total_cliques: number
          url_destino_base: string | null
        }
        Insert: {
          data_criacao_registro?: string
          data_primeiro_clique?: string | null
          data_ultima_atualizacao_registro?: string
          data_ultimo_clique?: string | null
          descricao_link?: string | null
          id?: number
          identificador_link: string
          total_cliques?: number
          url_destino_base?: string | null
        }
        Update: {
          data_criacao_registro?: string
          data_primeiro_clique?: string | null
          data_ultima_atualizacao_registro?: string
          data_ultimo_clique?: string | null
          descricao_link?: string | null
          id?: number
          identificador_link?: string
          total_cliques?: number
          url_destino_base?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
          timestamp_criacao: string | null
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
          timestamp_criacao?: string | null
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
          timestamp_criacao?: string | null
        }
        Relationships: []
      }
      tarefas_follow_up: {
        Row: {
          contato_id: number | null
          contato_utilizado: string
          data_criacao: string
          data_prevista_follow_up: string
          data_ultima_atualizacao: string
          detalhes_solicitacao_follow_up: string | null
          empresa_id: number
          id: number
          interacao_id: number
          observacao_interna_follow_up: string | null
          status_follow_up: string
          tentativas_follow_up: number | null
        }
        Insert: {
          contato_id?: number | null
          contato_utilizado: string
          data_criacao?: string
          data_prevista_follow_up: string
          data_ultima_atualizacao?: string
          detalhes_solicitacao_follow_up?: string | null
          empresa_id: number
          id?: number
          interacao_id: number
          observacao_interna_follow_up?: string | null
          status_follow_up?: string
          tentativas_follow_up?: number | null
        }
        Update: {
          contato_id?: number | null
          contato_utilizado?: string
          data_criacao?: string
          data_prevista_follow_up?: string
          data_ultima_atualizacao?: string
          detalhes_solicitacao_follow_up?: string | null
          empresa_id?: number
          id?: number
          interacao_id?: number
          observacao_interna_follow_up?: string | null
          status_follow_up?: string
          tentativas_follow_up?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_follow_up_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos_empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_follow_up_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_follow_up_interacao_id_fkey"
            columns: ["interacao_id"]
            isOneToOne: false
            referencedRelation: "interacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      templates_mensagens: {
        Row: {
          assunto_template: string | null
          ativo: boolean | null
          canal: string
          corpo_template: string
          data_criacao: string | null
          data_ultima_atualizacao: string | null
          descricao_interna: string | null
          etapa_cadencia: number
          id: number
          name_teamplate_meta: string | null
          nome_template: string
        }
        Insert: {
          assunto_template?: string | null
          ativo?: boolean | null
          canal: string
          corpo_template: string
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          descricao_interna?: string | null
          etapa_cadencia: number
          id?: number
          name_teamplate_meta?: string | null
          nome_template: string
        }
        Update: {
          assunto_template?: string | null
          ativo?: boolean | null
          canal?: string
          corpo_template?: string
          data_criacao?: string | null
          data_ultima_atualizacao?: string | null
          descricao_interna?: string | null
          etapa_cadencia?: number
          id?: number
          name_teamplate_meta?: string | null
          nome_template?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
