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
      contractors: {
        Row: {
          address: string | null
          billing_type: Database["public"]["Enums"]["billing_type"]
          city: string
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          license_number: string | null
          license_verified: boolean
          max_leads_per_day: number
          max_leads_per_month: number | null
          notes: string | null
          notification_email: string | null
          notification_phone: string | null
          phone: string
          service_zips: string[]
          services: Database["public"]["Enums"]["service_type"][]
          state: string
          status: Database["public"]["Enums"]["contractor_status"]
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
          zip: string
        }
        Insert: {
          address?: string | null
          billing_type?: Database["public"]["Enums"]["billing_type"]
          city: string
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          license_number?: string | null
          license_verified?: boolean
          max_leads_per_day?: number
          max_leads_per_month?: number | null
          notes?: string | null
          notification_email?: string | null
          notification_phone?: string | null
          phone: string
          service_zips: string[]
          services: Database["public"]["Enums"]["service_type"][]
          state?: string
          status?: Database["public"]["Enums"]["contractor_status"]
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
          zip: string
        }
        Update: {
          address?: string | null
          billing_type?: Database["public"]["Enums"]["billing_type"]
          city?: string
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          license_number?: string | null
          license_verified?: boolean
          max_leads_per_day?: number
          max_leads_per_month?: number | null
          notes?: string | null
          notification_email?: string | null
          notification_phone?: string | null
          phone?: string
          service_zips?: string[]
          services?: Database["public"]["Enums"]["service_type"][]
          state?: string
          status?: Database["public"]["Enums"]["contractor_status"]
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
          zip?: string
        }
        Relationships: []
      }
      lead_deliveries: {
        Row: {
          billed: boolean
          billed_at: string | null
          contractor_id: string
          created_at: string
          feedback: string | null
          id: string
          is_exclusive: boolean
          lead_id: string
          outcome: Database["public"]["Enums"]["delivery_outcome"]
          price: number
          quality_rating: number | null
          responded_at: string | null
          sent_at: string
          stripe_invoice_id: string | null
          viewed_at: string | null
        }
        Insert: {
          billed?: boolean
          billed_at?: string | null
          contractor_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_exclusive?: boolean
          lead_id: string
          outcome?: Database["public"]["Enums"]["delivery_outcome"]
          price: number
          quality_rating?: number | null
          responded_at?: string | null
          sent_at?: string
          stripe_invoice_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          billed?: boolean
          billed_at?: string | null
          contractor_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_exclusive?: boolean
          lead_id?: string
          outcome?: Database["public"]["Enums"]["delivery_outcome"]
          price?: number
          quality_rating?: number | null
          responded_at?: string | null
          sent_at?: string
          stripe_invoice_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_deliveries_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_deliveries_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_prices: {
        Row: {
          base_price: number
          id: string
          is_exclusive: boolean
          metro_area: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          state: string | null
          urgency: Database["public"]["Enums"]["lead_urgency"]
        }
        Insert: {
          base_price: number
          id?: string
          is_exclusive?: boolean
          metro_area?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          state?: string | null
          urgency: Database["public"]["Enums"]["lead_urgency"]
        }
        Update: {
          base_price?: number
          id?: string
          is_exclusive?: boolean
          metro_area?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          state?: string | null
          urgency?: Database["public"]["Enums"]["lead_urgency"]
        }
        Relationships: []
      }
      leads: {
        Row: {
          address: string
          city: string
          created_at: string
          description: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string
          phone_verified: boolean
          property_type: Database["public"]["Enums"]["property_type"]
          quality_score: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          source: Database["public"]["Enums"]["lead_source"]
          source_url: string | null
          state: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          urgency: Database["public"]["Enums"]["lead_urgency"]
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          zip: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone: string
          phone_verified?: boolean
          property_type?: Database["public"]["Enums"]["property_type"]
          quality_score?: number | null
          service_type: Database["public"]["Enums"]["service_type"]
          source?: Database["public"]["Enums"]["lead_source"]
          source_url?: string | null
          state?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          urgency: Database["public"]["Enums"]["lead_urgency"]
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          zip: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          phone_verified?: boolean
          property_type?: Database["public"]["Enums"]["property_type"]
          quality_score?: number | null
          service_type?: Database["public"]["Enums"]["service_type"]
          source?: Database["public"]["Enums"]["lead_source"]
          source_url?: string | null
          state?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          urgency?: Database["public"]["Enums"]["lead_urgency"]
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          zip?: string
        }
        Relationships: []
      }
      service_areas: {
        Row: {
          city: string
          id: string
          is_active: boolean
          metro_area: string | null
          population: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          state: string
        }
        Insert: {
          city: string
          id?: string
          is_active?: boolean
          metro_area?: string | null
          population?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          state?: string
        }
        Update: {
          city?: string
          id?: string
          is_active?: boolean
          metro_area?: string | null
          population?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          state?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_contractors_for_lead: {
        Args: { p_lead_id: string }
        Returns: {
          address: string | null
          billing_type: Database["public"]["Enums"]["billing_type"]
          city: string
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          license_number: string | null
          license_verified: boolean
          max_leads_per_day: number
          max_leads_per_month: number | null
          notes: string | null
          notification_email: string | null
          notification_phone: string | null
          phone: string
          service_zips: string[]
          services: Database["public"]["Enums"]["service_type"][]
          state: string
          status: Database["public"]["Enums"]["contractor_status"]
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
          zip: string
        }[]
        SetofOptions: {
          from: "*"
          to: "contractors"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      billing_type: "per_lead" | "monthly" | "hybrid"
      contractor_status: "pending" | "active" | "paused" | "churned"
      delivery_outcome:
        | "pending"
        | "viewed"
        | "accepted"
        | "rejected"
        | "no_response"
      lead_source: "seo" | "ppc" | "facebook" | "referral" | "direct"
      lead_status:
        | "new"
        | "verified"
        | "sent"
        | "accepted"
        | "rejected"
        | "converted"
        | "invalid"
      lead_urgency: "emergency" | "today" | "this_week" | "flexible"
      property_type: "residential" | "commercial"
      service_type:
        | "hvac_repair"
        | "hvac_install"
        | "hvac_maintenance"
        | "plumbing_emergency"
        | "plumbing_repair"
        | "plumbing_install"
        | "water_heater"
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
      billing_type: ["per_lead", "monthly", "hybrid"],
      contractor_status: ["pending", "active", "paused", "churned"],
      delivery_outcome: [
        "pending",
        "viewed",
        "accepted",
        "rejected",
        "no_response",
      ],
      lead_source: ["seo", "ppc", "facebook", "referral", "direct"],
      lead_status: [
        "new",
        "verified",
        "sent",
        "accepted",
        "rejected",
        "converted",
        "invalid",
      ],
      lead_urgency: ["emergency", "today", "this_week", "flexible"],
      property_type: ["residential", "commercial"],
      service_type: [
        "hvac_repair",
        "hvac_install",
        "hvac_maintenance",
        "plumbing_emergency",
        "plumbing_repair",
        "plumbing_install",
        "water_heater",
      ],
    },
  },
} as const
