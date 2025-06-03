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
      listing_additional_fees: {
        Row: {
          amount: number
          created_at: string | null
          fee_name: string
          frequency: string
          id: string
          listing_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          fee_name: string
          frequency: string
          id?: string
          listing_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          fee_name?: string
          frequency?: string
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_additional_fees_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          name: string | null
          phone: string | null
          profile_picture_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          is_verified?: boolean | null
          name?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          name?: string | null
          phone?: string | null
          profile_picture_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      property_inquiries: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          message: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          message: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          message?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_inquiries_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      property_listings: {
        Row: {
          amenities: string[] | null
          availability_date: string
          bathrooms: number | null
          bedrooms: number | null
          broker_free: boolean | null
          city: string
          created_at: string | null
          flexibility_notes: string | null
          furnished_items: string[] | null
          furnishing_status: Database["public"]["Enums"]["furnishing_status"]
          house_rules: string | null
          id: string
          landlord_id: string
          latitude: number | null
          longitude: number | null
          maximum_stay_months: number | null
          minimum_stay_months: number
          monthly_rent: number
          photos: string[] | null
          pincode: string
          property_type: Database["public"]["Enums"]["property_type"]
          security_deposit: number
          size_sqft: number | null
          state: string
          status: Database["public"]["Enums"]["listing_status"] | null
          street_address: string
          title: string | null
          updated_at: string | null
          utilities_included: string[] | null
          video_tour_url: string | null
          views_count: number | null
        }
        Insert: {
          amenities?: string[] | null
          availability_date: string
          bathrooms?: number | null
          bedrooms?: number | null
          broker_free?: boolean | null
          city: string
          created_at?: string | null
          flexibility_notes?: string | null
          furnished_items?: string[] | null
          furnishing_status: Database["public"]["Enums"]["furnishing_status"]
          house_rules?: string | null
          id?: string
          landlord_id: string
          latitude?: number | null
          longitude?: number | null
          maximum_stay_months?: number | null
          minimum_stay_months?: number
          monthly_rent: number
          photos?: string[] | null
          pincode: string
          property_type: Database["public"]["Enums"]["property_type"]
          security_deposit: number
          size_sqft?: number | null
          state: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          street_address: string
          title?: string | null
          updated_at?: string | null
          utilities_included?: string[] | null
          video_tour_url?: string | null
          views_count?: number | null
        }
        Update: {
          amenities?: string[] | null
          availability_date?: string
          bathrooms?: number | null
          bedrooms?: number | null
          broker_free?: boolean | null
          city?: string
          created_at?: string | null
          flexibility_notes?: string | null
          furnished_items?: string[] | null
          furnishing_status?: Database["public"]["Enums"]["furnishing_status"]
          house_rules?: string | null
          id?: string
          landlord_id?: string
          latitude?: number | null
          longitude?: number | null
          maximum_stay_months?: number | null
          minimum_stay_months?: number
          monthly_rent?: number
          photos?: string[] | null
          pincode?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          security_deposit?: number
          size_sqft?: number | null
          state?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          street_address?: string
          title?: string | null
          updated_at?: string | null
          utilities_included?: string[] | null
          video_tour_url?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          listing_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          reviewer_type: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          listing_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          reviewer_type: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          reviewer_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "property_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
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
      furnishing_status: "unfurnished" | "semi_furnished" | "fully_furnished"
      listing_status:
        | "active"
        | "inactive"
        | "rented"
        | "pending_review"
        | "draft"
      property_type:
        | "single_room"
        | "full_flat_1bhk"
        | "full_flat_2bhk"
        | "full_flat_3bhk_plus"
        | "pg_hostel_room"
        | "shared_room"
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
    Enums: {
      furnishing_status: ["unfurnished", "semi_furnished", "fully_furnished"],
      listing_status: [
        "active",
        "inactive",
        "rented",
        "pending_review",
        "draft",
      ],
      property_type: [
        "single_room",
        "full_flat_1bhk",
        "full_flat_2bhk",
        "full_flat_3bhk_plus",
        "pg_hostel_room",
        "shared_room",
      ],
    },
  },
} as const
