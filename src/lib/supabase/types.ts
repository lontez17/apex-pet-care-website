export type CareType = "dog_walking" | "pet_sitting" | "drop_in";
export type BookingStatus = "pending" | "active" | "cancelled" | "payment_failed";

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          created_at: string;
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
        };
        Insert: {
          id?: string;
          created_at?: string;
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
        };
        Update: {
          id?: string;
          created_at?: string;
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
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          responded?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          responded?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      care_type: CareType;
      booking_status: BookingStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
