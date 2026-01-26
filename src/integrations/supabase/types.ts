export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      deals: {
        Row: {
          category: Database["public"]["Enums"]["deal_category"]
          client_email: string | null
          client_name: string | null
          created_at: string
          currency: string | null
          deal_id: string
          email_message_id: string | null
          email_received_at: string | null
          email_subject: string | null
          id: string
          overall_risk_score: number | null
          status: Database["public"]["Enums"]["deal_status"]
          summary: string | null
          title: string
          transaction_value: number | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["deal_category"]
          client_email?: string | null
          client_name?: string | null
          created_at?: string
          currency?: string | null
          deal_id: string
          email_message_id?: string | null
          email_received_at?: string | null
          email_subject?: string | null
          id?: string
          overall_risk_score?: number | null
          status?: Database["public"]["Enums"]["deal_status"]
          summary?: string | null
          title: string
          transaction_value?: number | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["deal_category"]
          client_email?: string | null
          client_name?: string | null
          created_at?: string
          currency?: string | null
          deal_id?: string
          email_message_id?: string | null
          email_received_at?: string | null
          email_subject?: string | null
          id?: string
          overall_risk_score?: number | null
          status?: Database["public"]["Enums"]["deal_status"]
          summary?: string | null
          title?: string
          transaction_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          deal_id: string
          extracted_text: string | null
          file_name: string
          file_size: number | null
          file_type: string
          id: string
          is_analyzed: boolean | null
          mime_type: string | null
          review_status: string | null
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deal_id: string
          extracted_text?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          id?: string
          is_analyzed?: boolean | null
          mime_type?: string | null
          review_status?: string | null
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string
          extracted_text?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_analyzed?: boolean | null
          mime_type?: string | null
          review_status?: string | null
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sync_state: {
        Row: {
          created_at: string
          id: string
          last_message_id: string | null
          last_sync_at: string | null
          mailbox_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_id?: string | null
          last_sync_at?: string | null
          mailbox_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_id?: string | null
          last_sync_at?: string | null
          mailbox_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      risk_analysis: {
        Row: {
          created_at: string
          deal_id: string
          document_id: string | null
          id: string
          is_material: boolean | null
          page_number: number | null
          recommendation: string | null
          risk_category: string
          risk_description: string
          risk_title: string
          severity: Database["public"]["Enums"]["risk_severity"]
          source_excerpt: string | null
        }
        Insert: {
          created_at?: string
          deal_id: string
          document_id?: string | null
          id?: string
          is_material?: boolean | null
          page_number?: number | null
          recommendation?: string | null
          risk_category: string
          risk_description: string
          risk_title: string
          severity: Database["public"]["Enums"]["risk_severity"]
          source_excerpt?: string | null
        }
        Update: {
          created_at?: string
          deal_id?: string
          document_id?: string | null
          id?: string
          is_material?: boolean | null
          page_number?: number | null
          recommendation?: string | null
          risk_category?: string
          risk_description?: string
          risk_title?: string
          severity?: Database["public"]["Enums"]["risk_severity"]
          source_excerpt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_analysis_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_analysis_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      underwriting_reports: {
        Row: {
          coverage_analysis: Json | null
          deal_id: string
          exclusions_review: Json | null
          executive_summary: string | null
          generated_at: string
          id: string
          is_final: boolean | null
          key_findings: Json | null
          pricing_indicators: Json | null
          recommendations: Json | null
          report_type: string
          risk_overview: Json | null
        }
        Insert: {
          coverage_analysis?: Json | null
          deal_id: string
          exclusions_review?: Json | null
          executive_summary?: string | null
          generated_at?: string
          id?: string
          is_final?: boolean | null
          key_findings?: Json | null
          pricing_indicators?: Json | null
          recommendations?: Json | null
          report_type?: string
          risk_overview?: Json | null
        }
        Update: {
          coverage_analysis?: Json | null
          deal_id?: string
          exclusions_review?: Json | null
          executive_summary?: string | null
          generated_at?: string
          id?: string
          is_final?: boolean | null
          key_findings?: Json | null
          pricing_indicators?: Json | null
          recommendations?: Json | null
          report_type?: string
          risk_overview?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "underwriting_reports_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      deal_category:
        | "title"
        | "w_and_i"
        | "contingent_risk"
        | "tax"
        | "environmental"
      deal_status: "new" | "in_review" | "analyzed" | "approved" | "declined"
      risk_severity: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      deal_category: [
        "title",
        "w_and_i",
        "contingent_risk",
        "tax",
        "environmental",
      ],
      deal_status: ["new", "in_review", "analyzed", "approved", "declined"],
      risk_severity: ["low", "medium", "high", "critical"],
    },
  },
} as const
