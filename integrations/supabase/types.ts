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
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      entries: {
        Row: {
          id: string
          category: "issue" | "knowledge"
          title: string
          description: string
          content: string
          keywords: string[]
          resolver: string | null
          embedding: number[] | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          category: "issue" | "knowledge"
          title: string
          description: string
          content: string
          keywords?: string[]
          resolver?: string | null
          embedding?: number[] | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          category?: "issue" | "knowledge"
          title?: string
          description?: string
          content?: string
          keywords?: string[]
          resolver?: string | null
          embedding?: number[] | null
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      catatan_hsi: {
        Row: {
          id: string
          title: string
          slug: string
          transcription: string
          content: string | null
          ustad: string
          published_at: string
          summary: string
          audio_src: string | null
          series: string
          episode: number
          total_episodes: number
          tags: string[]
          source: string
          status: 'raw' | 'draft' | 'published'
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          transcription: string
          content?: string | null
          ustad: string
          published_at: string
          summary: string
          audio_src?: string | null
          series: string
          episode: number
          total_episodes: number
          tags: string[]
          source: string
          status?: 'raw' | 'draft' | 'published'
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          transcription?: string
          content?: string | null
          ustad?: string
          published_at?: string
          summary?: string
          audio_src?: string | null
          series?: string
          episode?: number
          total_episodes?: number
          tags?: string[]
          source?: string
          status?: 'raw' | 'draft' | 'published'
          created_at?: string
          updated_at?: string
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "catatan_hsi_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_entries: {
        Args: {
          query_embedding: number[]
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          category: string
          title: string
          description: string
          content: string
          keywords: string[]
          resolver: string | null
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
