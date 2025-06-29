export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          role: 'farmer' | 'buyer' | 'admin'
          phone_number: string | null
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'farmer' | 'buyer' | 'admin'
          phone_number?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'farmer' | 'buyer' | 'admin'
          phone_number?: string | null
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      farmer_profiles: {
        Row: {
          id: string
          user_id: string
          farm_name: string
          location_lat: number | null
          location_lng: number | null
          location_address: string | null
          profile_photo_url: string | null
          verification_status: 'pending' | 'approved' | 'rejected'
          verified_at: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          farm_name: string
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          profile_photo_url?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
          verified_at?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          farm_name?: string
          location_lat?: number | null
          location_lng?: number | null
          location_address?: string | null
          profile_photo_url?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
          verified_at?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      crops: {
        Row: {
          id: string
          farmer_id: string
          crop_name: string
          estimated_quantity_tons: number
          expected_harvest_date: string
          description: string | null
          photos: Json
          videos: Json
          price_per_ton: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          crop_name: string
          estimated_quantity_tons: number
          expected_harvest_date: string
          description?: string | null
          photos?: Json
          videos?: Json
          price_per_ton?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          crop_name?: string
          estimated_quantity_tons?: number
          expected_harvest_date?: string
          description?: string | null
          photos?: Json
          videos?: Json
          price_per_ton?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      buyer_subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'expired'
          plan_name: string
          monthly_price: number
          started_at: string | null
          expires_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'expired'
          plan_name: string
          monthly_price: number
          started_at?: string | null
          expires_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'expired'
          plan_name?: string
          monthly_price?: number
          started_at?: string | null
          expires_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      verification_documents: {
        Row: {
          id: string
          farmer_id: string
          document_type: string
          document_url: string
          verification_status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          document_type: string
          document_url: string
          verification_status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          document_type?: string
          document_url?: string
          verification_status?: 'pending' | 'approved' | 'rejected'
          admin_notes?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          farmer_id: string
          buyer_id: string
          crop_id: string | null
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          farmer_id: string
          buyer_id: string
          crop_id?: string | null
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          farmer_id?: string
          buyer_id?: string
          crop_id?: string | null
          last_message_at?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'farmer' | 'buyer' | 'admin'
      verification_status: 'pending' | 'approved' | 'rejected'
      subscription_status: 'active' | 'inactive' | 'cancelled' | 'expired'
    }
  }
}