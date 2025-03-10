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
      categories: {
        Row: {
          created_at: string | null
          depth: number
          icon_path: string | null
          id: number
          is_active: boolean | null
          name: string
          parent_id: number | null
          shortname: string | null
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          depth: number
          icon_path?: string | null
          id?: never
          is_active?: boolean | null
          name: string
          parent_id?: number | null
          shortname?: string | null
          sort_order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          depth?: number
          icon_path?: string | null
          id?: never
          is_active?: boolean | null
          name?: string
          parent_id?: number | null
          shortname?: string | null
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          name_ko: string | null
          name_vi: string
          sort_order: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          name_ko?: string | null
          name_vi: string
          sort_order: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          name_ko?: string | null
          name_vi?: string
          sort_order?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: number
          created_at: string | null
          id: number
          user_id: string
        }
        Insert: {
          comment_id: number
          created_at?: string | null
          id?: never
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string | null
          id?: never
          user_id?: string
        }
        Relationships: []
      }
      consultation_categories: {
        Row: {
          category_id: number
          consultation_id: number
        }
        Insert: {
          category_id: number
          consultation_id: number
        }
        Update: {
          category_id?: number
          consultation_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "consultation_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_categories_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_images: {
        Row: {
          consultation_id: number | null
          created_at: string | null
          id: number
          image_url: string
        }
        Insert: {
          consultation_id?: number | null
          created_at?: string | null
          id?: never
          image_url: string
        }
        Update: {
          consultation_id?: number | null
          created_at?: string | null
          id?: never
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_images_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          consultation_id: number | null
          id: number
          new_status: number | null
          previous_status: number | null
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          consultation_id?: number | null
          id?: never
          new_status?: number | null
          previous_status?: number | null
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          consultation_id?: number | null
          id?: never
          new_status?: number | null
          previous_status?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_status_history_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          created_at: string | null
          description: string | null
          email: string
          hospital_id: number | null
          id: number
          name: string
          phone: string
          status: number | null
          treatment_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          email: string
          hospital_id?: number | null
          id?: never
          name: string
          phone: string
          status?: number | null
          treatment_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          email?: string
          hospital_id?: number | null
          id?: never
          name?: string
          phone?: string
          status?: number | null
          treatment_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultations_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_categories: {
        Row: {
          created_at: string | null
          depth2_category_id: number | null
          depth3_category_id: number | null
          hospital_id: number | null
          id: number
        }
        Insert: {
          created_at?: string | null
          depth2_category_id?: number | null
          depth3_category_id?: number | null
          hospital_id?: number | null
          id?: never
        }
        Update: {
          created_at?: string | null
          depth2_category_id?: number | null
          depth3_category_id?: number | null
          hospital_id?: number | null
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "hospital_categories_depth2_category_id_fkey"
            columns: ["depth2_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_categories_depth3_category_id_fkey"
            columns: ["depth3_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_categories_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_likes: {
        Row: {
          created_at: string | null
          hospital_id: number | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          hospital_id?: number | null
          id?: never
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          hospital_id?: number | null
          id?: never
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospital_likes_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          average_rating: number | null
          business_hours: string | null
          city_id: number | null
          comment_count: number | null
          created_at: string | null
          description: string | null
          detail_content: string | null
          email: string | null
          facebook_url: string | null
          google_map_url: string | null
          has_discount: boolean | null
          id: number
          instagram_url: string | null
          is_advertised: boolean | null
          is_google: boolean | null
          is_member: boolean | null
          is_recommended: boolean | null
          latitude: number | null
          like_count: number | null
          longitude: number | null
          name: string
          phone: string | null
          thumbnail_url: string | null
          tiktok_url: string | null
          updated_at: string | null
          view_count: number | null
          website: string | null
          youtube_url: string | null
          zalo_id: string | null
        }
        Insert: {
          address: string
          average_rating?: number | null
          business_hours?: string | null
          city_id?: number | null
          comment_count?: number | null
          created_at?: string | null
          description?: string | null
          detail_content?: string | null
          email?: string | null
          facebook_url?: string | null
          google_map_url?: string | null
          has_discount?: boolean | null
          id?: never
          instagram_url?: string | null
          is_advertised?: boolean | null
          is_google?: boolean | null
          is_member?: boolean | null
          is_recommended?: boolean | null
          latitude?: number | null
          like_count?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          thumbnail_url?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          view_count?: number | null
          website?: string | null
          youtube_url?: string | null
          zalo_id?: string | null
        }
        Update: {
          address?: string
          average_rating?: number | null
          business_hours?: string | null
          city_id?: number | null
          comment_count?: number | null
          created_at?: string | null
          description?: string | null
          detail_content?: string | null
          email?: string | null
          facebook_url?: string | null
          google_map_url?: string | null
          has_discount?: boolean | null
          id?: never
          instagram_url?: string | null
          is_advertised?: boolean | null
          is_google?: boolean | null
          is_member?: boolean | null
          is_recommended?: boolean | null
          latitude?: number | null
          like_count?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          thumbnail_url?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          view_count?: number | null
          website?: string | null
          youtube_url?: string | null
          zalo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospitals_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: number
          is_deleted: boolean | null
          parent_id: number | null
          post_id: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          parent_id?: number | null
          post_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          is_deleted?: boolean | null
          parent_id?: number | null
          post_id?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string | null
          post_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          post_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          post_id?: number
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          comment_count: number | null
          content: string
          created_at: string | null
          id: number
          like_count: number | null
          meta_description: string | null
          published_at: string | null
          slug: string | null
          status: Database["public"]["Enums"]["post_status"] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          comment_count?: number | null
          content: string
          created_at?: string | null
          id?: number
          like_count?: number | null
          meta_description?: string | null
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          comment_count?: number | null
          content?: string
          created_at?: string | null
          id?: number
          like_count?: number | null
          meta_description?: string | null
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      posts_tags: {
        Row: {
          post_id: number
          tag_id: number
        }
        Insert: {
          post_id: number
          tag_id: number
        }
        Update: {
          post_id?: number
          tag_id?: number
        }
        Relationships: []
      }
      review_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: number
          like_count: number | null
          parent_id: number | null
          review_id: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: never
          like_count?: number | null
          parent_id?: number | null
          review_id: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: never
          like_count?: number | null
          parent_id?: number | null
          review_id?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      review_images: {
        Row: {
          created_at: string | null
          display_order: number
          id: number
          image_type: string | null
          image_url: string
          review_id: number
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id?: never
          image_type?: string | null
          image_url: string
          review_id: number
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: never
          image_type?: string | null
          image_url?: string
          review_id?: number
        }
        Relationships: []
      }
      review_likes: {
        Row: {
          created_at: string | null
          id: number
          review_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          review_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          review_id?: number
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_id: string
          comment_count: number | null
          content: string
          created_at: string | null
          hospital_id: number | null
          id: number
          is_best: boolean | null
          is_google: boolean | null
          is_verified: boolean | null
          like_count: number | null
          rating: number
          status: string | null
          title: string
          treatment_cost: number | null
          treatment_date: string | null
          treatment_id: number | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          comment_count?: number | null
          content: string
          created_at?: string | null
          hospital_id?: number | null
          id?: never
          is_best?: boolean | null
          is_google?: boolean | null
          is_verified?: boolean | null
          like_count?: number | null
          rating?: number
          status?: string | null
          title: string
          treatment_cost?: number | null
          treatment_date?: string | null
          treatment_id?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          comment_count?: number | null
          content?: string
          created_at?: string | null
          hospital_id?: number | null
          id?: never
          is_best?: boolean | null
          is_google?: boolean | null
          is_verified?: boolean | null
          like_count?: number | null
          rating?: number
          status?: string | null
          title?: string
          treatment_cost?: number | null
          treatment_date?: string | null
          treatment_id?: number | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: number
          name: string
          post_count: number | null
          slug: string
        }
        Insert: {
          id?: number
          name: string
          post_count?: number | null
          slug: string
        }
        Update: {
          id?: number
          name?: string
          post_count?: number | null
          slug?: string
        }
        Relationships: []
      }
      test_connection: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      treatment_categories: {
        Row: {
          created_at: string | null
          depth2_category_id: number | null
          depth3_category_id: number | null
          id: number
          treatment_id: number | null
        }
        Insert: {
          created_at?: string | null
          depth2_category_id?: number | null
          depth3_category_id?: number | null
          id?: never
          treatment_id?: number | null
        }
        Update: {
          created_at?: string | null
          depth2_category_id?: number | null
          depth3_category_id?: number | null
          id?: never
          treatment_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_categories_depth2_category_id_fkey"
            columns: ["depth2_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_categories_depth3_category_id_fkey"
            columns: ["depth3_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_categories_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_likes: {
        Row: {
          created_at: string | null
          id: number
          treatment_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          treatment_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          treatment_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_likes_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          city_id: number | null
          comment_count: number | null
          created_at: string | null
          detail_content: string | null
          discount_price: number | null
          discount_rate: number | null
          hospital_id: number | null
          id: number
          is_advertised: boolean | null
          is_discounted: boolean | null
          is_recommended: boolean | null
          like_count: number | null
          price: number | null
          rating: number | null
          summary: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          city_id?: number | null
          comment_count?: number | null
          created_at?: string | null
          detail_content?: string | null
          discount_price?: number | null
          discount_rate?: number | null
          hospital_id?: number | null
          id?: never
          is_advertised?: boolean | null
          is_discounted?: boolean | null
          is_recommended?: boolean | null
          like_count?: number | null
          price?: number | null
          rating?: number | null
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          city_id?: number | null
          comment_count?: number | null
          created_at?: string | null
          detail_content?: string | null
          discount_price?: number | null
          discount_rate?: number | null
          hospital_id?: number | null
          id?: never
          is_advertised?: boolean | null
          is_discounted?: boolean | null
          is_recommended?: boolean | null
          like_count?: number | null
          price?: number | null
          rating?: number | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatments_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferred_categories: {
        Row: {
          created_at: string | null
          depth2_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          depth2_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          depth2_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferred_categories_depth2_id_fkey"
            columns: ["depth2_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferred_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          birth_day: string | null
          birth_month: string | null
          birth_year: string | null
          city_id: number | null
          created_at: string | null
          gender: string
          id: string
          is_active: boolean | null
          name: string | null
          nickname: string | null
          phone: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_day?: string | null
          birth_month?: string | null
          birth_year?: string | null
          city_id?: number | null
          created_at?: string | null
          gender: string
          id: string
          is_active?: boolean | null
          name?: string | null
          nickname?: string | null
          phone: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_day?: string | null
          birth_month?: string | null
          birth_year?: string | null
          city_id?: number | null
          created_at?: string | null
          gender?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          nickname?: string | null
          phone?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_review_comment:
        | {
            Args: {
              p_review_id: number
              p_user_id: string
              p_content: string
              p_parent_id?: number
            }
            Returns: Json
          }
        | {
            Args: {
              p_review_id: number
              p_user_id: string
              p_content: string
              p_parent_id?: number
              p_hospital_id?: number
              p_treatment_id?: number
            }
            Returns: Json
          }
        | {
            Args: {
              p_review_id: number
              p_user_id: string
              p_content: string
              p_rating: number
              p_parent_id?: number
            }
            Returns: Json
          }
      admin_create_treatment:
        | {
            Args: {
              p_hospital_id: number
              p_city_id: number
              p_name: string
              p_thumbnail_url: string
              p_description: string
              p_detail_content: string
              p_is_advertised: boolean
              p_is_recommended: boolean
              p_is_discounted: boolean
              p_discount_rate: number
              p_discounted_price: number
              p_original_price: number
              p_categories: Json
            }
            Returns: Json
          }
        | {
            Args: {
              p_hospital_id: number
              p_name: string
              p_thumbnail_url: string
              p_description: string
              p_detail_content: string
              p_is_advertised: boolean
              p_is_recommended: boolean
              p_is_discounted: boolean
              p_discount_rate: number
              p_discounted_price: number
              p_original_price: number
              p_categories: Json
            }
            Returns: Json
          }
      check_hospital_like: {
        Args: {
          p_hospital_id: number
          p_user_id: string
        }
        Returns: boolean
      }
      check_treatment_like: {
        Args: {
          p_treatment_id: number
          p_user_id: string
        }
        Returns: boolean
      }
      create_hospital: {
        Args: {
          p_hospital_data: Json
          p_categories: Json
        }
        Returns: Json
      }
      delete_hospital_with_categories: {
        Args: {
          p_hospital_id: number
        }
        Returns: boolean
      }
      delete_review: {
        Args: {
          p_review_id: number
          p_user_id: string
        }
        Returns: boolean
      }
      delete_review_comment:
        | {
            Args: {
              p_comment_id: number
              p_user_id: string
            }
            Returns: boolean
          }
        | {
            Args: {
              p_comment_id: number
              p_user_id: string
              p_hospital_id?: number
              p_treatment_id?: number
            }
            Returns: boolean
          }
      get_admins: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          name: string
          role: string
          last_sign_in_at: string
          created_at: string
          phone: string
        }[]
      }
      get_categories: {
        Args: {
          p_parent_depth1_id: number
        }
        Returns: Json
      }
      get_comments: {
        Args: {
          p_content?: string
          p_author?: string
          p_status?: string
          p_page?: number
          p_page_size?: number
        }
        Returns: {
          id: number
          content: string
          treatment_name: string
          hospital_name: string
          author_email: string
          author_nickname: string
          status: string
          like_count: number
          created_at: string
          parent_id: number
          is_reply: boolean
          total_count: number
        }[]
      }
      get_dashboard_chart_data: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: Json
      }
      get_dashboard_stats:
        | {
            Args: Record<PropertyKey, never>
            Returns: Json
          }
        | {
            Args: {
              start_date: string
              end_date: string
            }
            Returns: Json
          }
      get_hospital_detail: {
        Args: {
          p_hospital_id: number
        }
        Returns: {
          id: number
          hospital_name: string
          city_id: number
          business_hours: string
          address: string
          phone: string
          email: string
          website: string
          facebook_url: string
          youtube_url: string
          tiktok_url: string
          instagram_url: string
          zalo_id: string
          description: string
          thumbnail_url: string
          detail_content: string
          latitude: number
          longitude: number
          is_advertised: boolean
          is_recommended: boolean
          is_member: boolean
          is_google: boolean
          has_discount: boolean
          view_count: number
          like_count: number
          average_rating: number
          city_name: string
          city_name_vi: string
          city_name_ko: string
          categories: Json
          created_at: string
          updated_at: string
        }[]
      }
      get_hospitals_list:
        | {
            Args: {
              p_city_id?: number
              p_depth2_body_category_id?: number
              p_depth2_treatment_category_id?: number
              p_depth3_body_category_id?: number
              p_depth3_treatment_category_id?: number
              p_is_advertised?: boolean
              p_is_recommended?: boolean
              p_is_member?: boolean
              p_is_google?: boolean
              p_has_discount?: boolean
              p_page_size?: number
              p_page?: number
              p_ad_limit?: number
              p_sort_by?: string
              p_search_term?: string
            }
            Returns: {
              id: number
              hospital_name: string
              address: string
              description: string
              thumbnail_url: string
              business_hours: string
              phone: string
              website: string
              is_advertised: boolean
              is_recommended: boolean
              is_member: boolean
              is_google: boolean
              has_discount: boolean
              view_count: number
              like_count: number
              average_rating: number
              city_name: string
              city_name_vi: string
              city_name_ko: string
              has_next_page: boolean
              is_ad: boolean
              categories: Json
              total_count: number
            }[]
          }
        | {
            Args: {
              p_city_id?: number
              p_depth2_body_category_id?: number
              p_depth2_treatment_category_id?: number
              p_depth3_body_category_id?: number
              p_depth3_treatment_category_id?: number
              p_is_advertised?: boolean
              p_is_recommended?: boolean
              p_is_member?: boolean
              p_is_google?: boolean
              p_has_discount?: boolean
              p_page_size?: number
              p_page?: number
              p_ad_limit?: number
              p_sort_by?: string
              p_search_term?: string
              p_user_id?: string
            }
            Returns: {
              id: number
              hospital_name: string
              address: string
              description: string
              thumbnail_url: string
              business_hours: string
              phone: string
              website: string
              is_advertised: boolean
              is_recommended: boolean
              is_member: boolean
              is_google: boolean
              has_discount: boolean
              view_count: number
              like_count: number
              average_rating: number
              city_name: string
              city_name_vi: string
              city_name_ko: string
              has_next_page: boolean
              is_ad: boolean
              categories: Json
              total_count: number
              is_liked: boolean
            }[]
          }
      get_liked_hospitals: {
        Args: {
          p_user_id: string
          p_sort_by?: string
          p_page_size?: number
          p_page?: number
        }
        Returns: {
          id: number
          hospital_name: string
          address: string
          description: string
          thumbnail_url: string
          business_hours: string
          phone: string
          website: string
          is_advertised: boolean
          is_recommended: boolean
          is_member: boolean
          has_discount: boolean
          view_count: number
          like_count: number
          average_rating: number
          city_name: string
          city_name_vi: string
          city_name_ko: string
          has_next_page: boolean
          categories: Json
          total_count: number
          liked_at: string
        }[]
      }
      get_liked_posts: {
        Args: {
          p_user_id: string
          p_sort_by?: string
          p_page_size?: number
          p_page?: number
        }
        Returns: {
          id: number
          title: string
          content: string
          thumbnail_url: string
          created_at: string
          updated_at: string
          published_at: string
          status: Database["public"]["Enums"]["post_status"]
          view_count: number
          like_count: number
          comment_count: number
          author_id: string
          slug: string
          meta_description: string
          tags: Json
          author_name: string
          author_avatar_url: string
          total_count: number
          has_next_page: boolean
          liked_at: string
        }[]
      }
      get_liked_reviews: {
        Args: {
          p_user_id: string
          p_sort_by?: string
          p_page_size?: number
          p_page?: number
        }
        Returns: {
          id: number
          title: string
          content: string
          before_image: string
          after_image: string
          rating: number
          view_count: number
          like_count: number
          comment_count: number
          author_id: string
          author_name: string
          author_image: string
          created_at: string
          treatment_id: number
          treatment_name: string
          hospital_id: number
          hospital_name: string
          location: string
          categories: Json
          is_best: boolean
          is_google: boolean
          total_count: number
          has_next_page: boolean
          liked_at: string
        }[]
      }
      get_liked_treatments: {
        Args: {
          p_user_id: string
          p_sort_by?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: number
          hospital_id: number
          hospital_name: string
          hospital_phone: string
          title: string
          summary: string
          city_id: number
          city_name: string
          rating: number
          comment_count: number
          view_count: number
          like_count: number
          thumbnail_url: string
          is_advertised: boolean
          is_recommended: boolean
          is_discounted: boolean
          price: number
          discount_price: number
          discount_rate: number
          categories: Json
          liked_at: string
          total_count: number
          has_next: boolean
        }[]
      }
      get_members_list: {
        Args: {
          search_text?: string
          gender_filter?: string
          provider_filter?: string
          city_filter?: number
          category_filter?: number
          page_number?: number
          items_per_page?: number
        }
        Returns: {
          total_count: number
          id: string
          email: string
          nickname: string
          gender: string
          phone: string
          avatar_url: string
          provider: string
          last_sign_in_at: string
          city_name: string
          categories: string[]
        }[]
      }
      get_my_comments: {
        Args: {
          p_user_id: string
          p_page_size?: number
          p_page?: number
        }
        Returns: {
          id: number
          content: string
          created_at: string
          review_id: number
          review_title: string
          treatment_id: number
          treatment_title: string
          total_count: number
          has_next_page: boolean
        }[]
      }
      get_my_reviews: {
        Args: {
          p_user_id: string
          p_page_size?: number
          p_page?: number
        }
        Returns: {
          id: number
          title: string
          content: string
          before_image: string
          after_image: string
          rating: number
          view_count: number
          like_count: number
          comment_count: number
          author_id: string
          author_name: string
          author_image: string
          created_at: string
          treatment_id: number
          treatment_name: string
          hospital_id: number
          hospital_name: string
          location: string
          categories: Json
          is_best: boolean
          is_google: boolean
          total_count: number
          has_next_page: boolean
        }[]
      }
      get_post_detail: {
        Args: {
          p_post_id: number
        }
        Returns: {
          id: number
          title: string
          content: string
          thumbnail_url: string
          created_at: string
          updated_at: string
          published_at: string
          view_count: number
          like_count: number
          comment_count: number
          author_id: string
          author_name: string
          author_avatar_url: string
          tags: Json
          prev_post: Json
          next_post: Json
        }[]
      }
      get_posts: {
        Args: {
          p_search?: string
          p_tag_ids?: number[]
          p_order_by?: string
          p_limit?: number
          p_offset?: number
        }
        Returns: {
          id: number
          title: string
          content: string
          thumbnail_url: string
          created_at: string
          updated_at: string
          published_at: string
          status: Database["public"]["Enums"]["post_status"]
          view_count: number
          like_count: number
          comment_count: number
          author_id: string
          slug: string
          meta_description: string
          tags: Json
          author_name: string
          author_avatar_url: string
          total_count: number
          has_more: boolean
        }[]
      }
      get_review_detail: {
        Args: {
          p_review_id: number
          p_user_id?: string
        }
        Returns: Json
      }
      get_reviews: {
        Args: {
          p_treatment_id?: number
          p_hospital_id?: number
          p_depth2_id?: number
          p_depth2_treatment_id?: number
          p_depth3_id?: number
          p_depth3_treatment_id?: number
          p_is_recommended?: boolean
          p_has_discount?: boolean
          p_is_member?: boolean
          p_is_ad?: boolean
          p_location?: string
          p_best_count?: number
          p_sort_by?: string
          p_limit?: number
          p_offset?: number
          p_min_price?: number
          p_max_price?: number
          p_is_verified?: boolean
          p_status?: string
          p_is_google?: boolean
        }
        Returns: {
          id: number
          title: string
          content: string
          before_image: string
          after_image: string
          rating: number
          view_count: number
          like_count: number
          comment_count: number
          author_id: string
          author_name: string
          author_image: string
          created_at: string
          treatment_id: number
          treatment_name: string
          hospital_id: number
          hospital_name: string
          location: string
          categories: Json
          is_best: boolean
          is_google: boolean
          is_verified: boolean
          status: string
          total_count: number
          has_more: boolean
        }[]
      }
      get_tags: {
        Args: {
          p_limit?: number
          p_order_by?: string
        }
        Returns: {
          id: number
          name: string
          slug: string
          post_count: number
        }[]
      }
      get_top_categories: {
        Args: {
          p_limit?: number
        }
        Returns: {
          category_id: number
          category_name: string
          total_views: number
        }[]
      }
      get_treatment_detail: {
        Args: {
          p_treatment_id: number
        }
        Returns: {
          id: number
          hospital_id: number
          hospital_name: string
          title: string
          summary: string
          detail_content: string
          city_id: number
          city_name: string
          thumbnail_url: string
          price: number
          discount_price: number
          discount_rate: number
          rating: number
          view_count: number
          like_count: number
          comment_count: number
          is_advertised: boolean
          is_recommended: boolean
          is_discounted: boolean
          created_at: string
          updated_at: string
          website: string
          facebook_url: string
          zalo_id: string
          phone: string
          categories: Json
        }[]
      }
      get_treatments: {
        Args: {
          p_hospital_id?: number
          p_depth2_category_id?: number
          p_depth3_category_id?: number
          p_is_advertised?: boolean
          p_is_recommended?: boolean
          p_city_id?: number
          p_is_discounted?: boolean
          p_price_from?: number
          p_price_to?: number
          p_sort_by?: string
          p_limit?: number
          p_offset?: number
          p_search_term?: string
          p_user_id?: string
        }
        Returns: {
          id: number
          hospital_id: number
          hospital_name: string
          hospital_phone: string
          hospital_facebook_url: string
          hospital_zalo_id: string
          title: string
          summary: string
          city_id: number
          city_name: string
          rating: number
          comment_count: number
          view_count: number
          like_count: number
          thumbnail_url: string
          detail_content: string
          is_advertised: boolean
          is_recommended: boolean
          is_discounted: boolean
          price: number
          discount_price: number
          discount_rate: number
          categories: Json
          created_at: string
          updated_at: string
          is_liked: boolean
          total_count: number
          has_next: boolean
        }[]
      }
      handle_user_preferred_category: {
        Args: {
          p_user_id: string
          p_depth2_id: number
          p_is_add: boolean
        }
        Returns: {
          success: boolean
          message: string
          categories: number[]
        }[]
      }
      mask_email: {
        Args: {
          email: string
        }
        Returns: string
      }
      toggle_hospital_like: {
        Args: {
          p_hospital_id: number
          p_user_id: string
        }
        Returns: {
          success: boolean
          like_count: number
          is_liked: boolean
        }[]
      }
      toggle_post_like: {
        Args: {
          p_post_id: number
          p_user_id: string
        }
        Returns: {
          success: boolean
          is_liked: boolean
          new_like_count: number
        }[]
      }
      toggle_review_like: {
        Args: {
          p_review_id: number
          p_user_id: string
        }
        Returns: {
          is_liked: boolean
          like_count: number
        }[]
      }
      toggle_treatment_like: {
        Args: {
          p_treatment_id: number
          p_user_id: string
        }
        Returns: {
          success: boolean
          like_count: number
          is_liked: boolean
        }[]
      }
      update_comment_status: {
        Args: {
          p_comment_id: number
          p_status: string
        }
        Returns: boolean
      }
      update_hospital_stats: {
        Args: {
          p_hospital_id: number
        }
        Returns: undefined
      }
      update_treatment_stats: {
        Args: {
          p_treatment_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      post_status: "draft" | "published" | "archived" | "deleted"
    }
    CompositeTypes: {
      treatment_category_group: {
        depth2_id: number | null
        depth2_name: string | null
        depth3_list: Json | null
      }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
