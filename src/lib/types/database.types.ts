export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chatbot_docs: {
        Row: {
          chars: number
          chatbot_id: string
          content: string
          created_at: string
          file_name: string
          id: string
        }
        Insert: {
          chars: number
          chatbot_id: string
          content: string
          created_at?: string
          file_name: string
          id?: string
        }
        Update: {
          chars?: number
          chatbot_id?: string
          content?: string
          created_at?: string
          file_name?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_docs_chatbot_id_fkey"
            columns: ["chatbot_id"]
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_docs_file_name_fkey"
            columns: ["file_name"]
            referencedRelation: "objects"
            referencedColumns: ["name"]
          }
        ]
      }
      chatbot_notion: {
        Row: {
          chars: number
          chatbot_id: string
          content: string
          created_at: string
          id: string
          name: string
          type: string
        }
        Insert: {
          chars: number
          chatbot_id: string
          content: string
          created_at?: string
          id?: string
          name: string
          type: string
        }
        Update: {
          chars?: number
          chatbot_id?: string
          content?: string
          created_at?: string
          id?: string
          name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_notion_chatbot_id_fkey"
            columns: ["chatbot_id"]
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          }
        ]
      }
      chatbot_settings: {
        Row: {
          chatbot_background: string | null
          chatbot_bubble_align: string | null
          chatbot_bubble_logo: string | null
          chatbot_id: string
          chatbot_logo: string | null
          display_name: string | null
          id: string
          primary_color: string
          suggested_message: string[] | null
          theme: string | null
          user_id: string
          user_message_background: string | null
          welcome_message: string
        }
        Insert: {
          chatbot_background?: string | null
          chatbot_bubble_align?: string | null
          chatbot_bubble_logo?: string | null
          chatbot_id: string
          chatbot_logo?: string | null
          display_name?: string | null
          id?: string
          primary_color: string
          suggested_message?: string[] | null
          theme?: string | null
          user_id: string
          user_message_background?: string | null
          welcome_message: string
        }
        Update: {
          chatbot_background?: string | null
          chatbot_bubble_align?: string | null
          chatbot_bubble_logo?: string | null
          chatbot_id?: string
          chatbot_logo?: string | null
          display_name?: string | null
          id?: string
          primary_color?: string
          suggested_message?: string[] | null
          theme?: string | null
          user_id?: string
          user_message_background?: string | null
          welcome_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_settings_chatbot_id_fkey"
            columns: ["chatbot_id"]
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chatbot_urls: {
        Row: {
          chars: number
          chatbot_id: string
          content: string
          created_at: string
          id: string
          url: string
        }
        Insert: {
          chars: number
          chatbot_id: string
          content: string
          created_at?: string
          id?: string
          url: string
        }
        Update: {
          chars?: number
          chatbot_id?: string
          content?: string
          created_at?: string
          id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_urls_chatbot_id_fkey"
            columns: ["chatbot_id"]
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          }
        ]
      }
      chatbots: {
        Row: {
          created_at: string
          files: string[] | null
          id: string
          is_public: boolean | null
          name: string | null
          params: Json | null
          status: string | null
          text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          files?: string[] | null
          id?: string
          is_public?: boolean | null
          name?: string | null
          params?: Json | null
          status?: string | null
          text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          files?: string[] | null
          id?: string
          is_public?: boolean | null
          name?: string | null
          params?: Json | null
          status?: string | null
          text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          chatbot_id: string
          chatbot_owner_id: string | null
          conversation_id: string | null
          created_at: string
          entry: string | null
          id: string
          metadata: Json | null
          session_id: string
          speaker: string
        }
        Insert: {
          chatbot_id: string
          chatbot_owner_id?: string | null
          conversation_id?: string | null
          created_at?: string
          entry?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string
          speaker: string
        }
        Update: {
          chatbot_id?: string
          chatbot_owner_id?: string | null
          conversation_id?: string | null
          created_at?: string
          entry?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string
          speaker?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_chatbot_owner_id_fkey"
            columns: ["chatbot_owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      knowledge_base: {
        Row: {
          chatbot_id: string | null
          content: string
          created_at: string | null
          doc_id: string | null
          embedding: string | null
          file_name: string | null
          id: number
          metadata: Json | null
          notion_id: string | null
          url_id: string | null
          user_id: string | null
        }
        Insert: {
          chatbot_id?: string | null
          content: string
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          file_name?: string | null
          id?: number
          metadata?: Json | null
          notion_id?: string | null
          url_id?: string | null
          user_id?: string | null
        }
        Update: {
          chatbot_id?: string | null
          content?: string
          created_at?: string | null
          doc_id?: string | null
          embedding?: string | null
          file_name?: string | null
          id?: number
          metadata?: Json | null
          notion_id?: string | null
          url_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_chatbot_id_fkey"
            columns: ["chatbot_id"]
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_doc_id_fkey"
            columns: ["doc_id"]
            referencedRelation: "chatbot_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_file_name_fkey"
            columns: ["file_name"]
            referencedRelation: "objects"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "knowledge_base_notion_id_fkey"
            columns: ["notion_id"]
            referencedRelation: "chatbot_notion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_url_id_fkey"
            columns: ["url_id"]
            referencedRelation: "chatbot_urls"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          billing_interval: string
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          customer_id: string
          id: string
          note: string | null
          plan: string | null
          subscription_id: string
        }
        Insert: {
          billing_interval: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id: string
          id: string
          note?: string | null
          plan?: string | null
          subscription_id?: string
        }
        Update: {
          billing_interval?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          customer_id?: string
          id?: string
          note?: string | null
          plan?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_messages_by_chatbot_id: {
        Args: {
          p_chatbot_id: string
        }
        Returns: {
          conversation_id: string
          chatbot_id: string
          user_last_message: string
          assistant_last_message: string
          sent_at: string
        }[]
      }
      get_messages_by_session: {
        Args: {
          p_chatbot_id: string
        }
        Returns: {
          session_id: string
          chatbot_id: string
          user_last_message: string
          assistant_last_message: string
          sent_at: string
        }[]
      }
      get_user_id_by_email: {
        Args: {
          user_email: string
        }
        Returns: string
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_documents: {
        Args: {
          p_query_embedding: string
          p_match_count: number
          p_chatbot_id: string
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name: string
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
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
