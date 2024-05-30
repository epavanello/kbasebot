
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_docs_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_docs_file_name_fkey"
            columns: ["file_name"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["name"]
          },
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
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_notion_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
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
          leads: Json | null
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
          leads?: Json | null
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
          leads?: Json | null
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
            isOneToOne: true
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_settings_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: true
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["user_id"]
          },
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
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_urls_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbots: {
        Row: {
          created_at: string
          custom_context: string
          files: string[] | null
          id: string
          is_public: boolean | null
          model: string
          name: string | null
          params: Json | null
          status: string | null
          text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          custom_context?: string
          files?: string[] | null
          id?: string
          is_public?: boolean | null
          model?: string
          name?: string | null
          params?: Json | null
          status?: string | null
          text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          custom_context?: string
          files?: string[] | null
          id?: string
          is_public?: boolean | null
          model?: string
          name?: string | null
          params?: Json | null
          status?: string | null
          text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["user_id"]
          },
        ]
      }
      conversations: {
        Row: {
          chatbot_id: string | null
          chatbot_owner_id: string
          conversation_id: string | null
          created_at: string
          entry: string | null
          id: string
          metadata: Json | null
          session_id: string
          speaker: string
        }
        Insert: {
          chatbot_id?: string | null
          chatbot_owner_id: string
          conversation_id?: string | null
          created_at?: string
          entry?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string
          speaker: string
        }
        Update: {
          chatbot_id?: string | null
          chatbot_owner_id?: string
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
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_chatbot_owner_id_fkey"
            columns: ["chatbot_owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_chatbot_owner_id_fkey"
            columns: ["chatbot_owner_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["user_id"]
          },
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
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "chatbot_docs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_file_name_fkey"
            columns: ["file_name"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "knowledge_base_notion_id_fkey"
            columns: ["notion_id"]
            isOneToOne: false
            referencedRelation: "chatbot_notion"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_base_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "chatbot_urls"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          chatbot_id: string | null
          chatbot_owner_id: string | null
          conversation_id: string
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
        }
        Insert: {
          chatbot_id?: string | null
          chatbot_owner_id?: string | null
          conversation_id: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Update: {
          chatbot_id?: string | null
          chatbot_owner_id?: string | null
          conversation_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_chatbot_owner_id_fkey"
            columns: ["chatbot_owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_chatbot_owner_id_fkey"
            columns: ["chatbot_owner_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["user_id"]
          },
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
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users_chatbots"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      chatbot_training_status: {
        Row: {
          chars: number | null
          chatbot_id: string | null
          trained: boolean | null
          url: string | null
        }
        Insert: {
          chars?: number | null
          chatbot_id?: string | null
          trained?: never
          url?: string | null
        }
        Update: {
          chars?: number | null
          chatbot_id?: string | null
          trained?: never
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_urls_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbot_urls_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "users_chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      users_chatbots: {
        Row: {
          context: string | null
          created_at: string | null
          email: string | null
          id: string | null
          model: string | null
          name: string | null
          notion_pages: number | null
          num_chunks: number | null
          num_conversations: number | null
          num_links: number | null
          plan: string | null
          status: string | null
          user_id: string | null
        }
        Relationships: []
      }
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
          p_threshold?: number
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents_old: {
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
          owner_id: string | null
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
          owner_id?: string | null
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
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
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
          owner_id: string | null
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
          owner_id?: string | null
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
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
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
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
