export type CareType = "dog_walking" | "pet_sitting" | "drop_in";
export type BookingStatus = "pending" | "active" | "cancelled" | "payment_failed";
export type BookingType = "subscription" | "pack" | "one_time";
export type AggressionLevel = "none" | "mild" | "aggressive";
export type PackStatus = "active" | "exhausted" | "expired" | "refunded";
export type LogStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type AdminRole = "admin" | "owner" | "walker";

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          created_at: string;
          user_id: string | null;
          pet_name: string;
          pet_type: string;
          pet_breed: string | null;
          pet_age: string | null;
          owner_name: string;
          email: string;
          phone: string;
          care_type: CareType;
          days_per_week: number | null;
          selected_days: string[] | null;
          start_date: string;
          notes: string | null;
          monthly_rate: number;
          registration_fee: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_session_id: string | null;
          status: BookingStatus;
          booking_type: BookingType;
          service_pack_id: string | null;
          plan_label: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          pet_name: string;
          pet_type: string;
          pet_breed?: string | null;
          pet_age?: string | null;
          owner_name: string;
          email: string;
          phone: string;
          care_type: CareType;
          days_per_week?: number | null;
          selected_days?: string[] | null;
          start_date: string;
          notes?: string | null;
          monthly_rate: number;
          registration_fee: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_session_id?: string | null;
          status?: BookingStatus;
          booking_type?: BookingType;
          service_pack_id?: string | null;
          plan_label?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          pet_name?: string;
          pet_type?: string;
          pet_breed?: string | null;
          pet_age?: string | null;
          owner_name?: string;
          email?: string;
          phone?: string;
          care_type?: CareType;
          days_per_week?: number | null;
          selected_days?: string[] | null;
          start_date?: string;
          notes?: string | null;
          monthly_rate?: number;
          registration_fee?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_session_id?: string | null;
          status?: BookingStatus;
          booking_type?: BookingType;
          service_pack_id?: string | null;
          plan_label?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          breed: string | null;
          age: string | null;
          weight: string | null;
          aggression_level: AggressionLevel;
          spayed_neutered: boolean;
          vaccinations_current: boolean;
          special_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          breed?: string | null;
          age?: string | null;
          weight?: string | null;
          aggression_level?: AggressionLevel;
          spayed_neutered?: boolean;
          vaccinations_current?: boolean;
          special_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          breed?: string | null;
          age?: string | null;
          weight?: string | null;
          aggression_level?: AggressionLevel;
          spayed_neutered?: boolean;
          vaccinations_current?: boolean;
          special_notes?: string | null;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          responded: boolean;
          admin_notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          responded?: boolean;
          admin_notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          responded?: boolean;
          admin_notes?: string | null;
        };
        Relationships: [];
      };
      service_packs: {
        Row: {
          id: string;
          created_at: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          service_type: string;
          pack_type: string;
          pack_label: string;
          total_sessions: number;
          used_sessions: number;
          remaining_sessions: number;
          unit_duration_minutes: number | null;
          price_paid: number;
          stripe_session_id: string | null;
          stripe_customer_id: string | null;
          status: PackStatus;
          purchased_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          service_type: string;
          pack_type: string;
          pack_label: string;
          total_sessions: number;
          used_sessions?: number;
          unit_duration_minutes?: number | null;
          price_paid: number;
          stripe_session_id?: string | null;
          stripe_customer_id?: string | null;
          status?: PackStatus;
          purchased_at?: string;
        };
        Update: {
          used_sessions?: number;
          status?: PackStatus;
          user_id?: string | null;
        };
        Relationships: [];
      };
      service_logs: {
        Row: {
          id: string;
          created_at: string;
          service_pack_id: string | null;
          booking_id: string | null;
          user_id: string | null;
          pet_name: string;
          service_type: string;
          service_date: string;
          start_time: string | null;
          duration_minutes: number | null;
          walker_name: string | null;
          notes: string | null;
          status: LogStatus;
          logged_by: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          service_pack_id?: string | null;
          booking_id?: string | null;
          user_id?: string | null;
          pet_name: string;
          service_type: string;
          service_date: string;
          start_time?: string | null;
          duration_minutes?: number | null;
          walker_name?: string | null;
          notes?: string | null;
          status?: LogStatus;
          logged_by?: string | null;
        };
        Update: {
          status?: LogStatus;
          notes?: string | null;
          walker_name?: string | null;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: AdminRole;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          role?: AdminRole;
          created_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          role?: AdminRole;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      log_service_and_deduct: {
        Args: {
          p_pack_id: string;
          p_user_id: string | null;
          p_pet_name: string;
          p_service_date: string;
          p_start_time: string | null;
          p_duration: number | null;
          p_walker: string | null;
          p_notes: string | null;
          p_logged_by: string;
        };
        Returns: string;
      };
    };
    Enums: {
      care_type: CareType;
      booking_status: BookingStatus;
      booking_type: BookingType;
      aggression_level: AggressionLevel;
      pack_status: PackStatus;
      log_status: LogStatus;
      admin_role: AdminRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
