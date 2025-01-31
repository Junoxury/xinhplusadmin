
export interface HospitalDetail {
  id: number;
  hospital_name: string;
  city_id: number;
  business_hours: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  facebook_url: string;
  youtube_url: string;
  tiktok_url: string;
  instagram_url: string;
  zalo_id: string;
  description: string;
  thumbnail_url: string;
  detail_content: string;
  latitude: number;
  longitude: number;
  is_advertised: boolean;
  is_recommended: boolean;
  is_member: boolean;
  has_discount: boolean;
  view_count: number;
  like_count: number;
  average_rating: number;
  city_name: string;
  city_name_vi: string;
  city_name_ko: string;
  categories: {
    depth2: {
      id: number;
      label: string;
    };
    depth3: Array<{
      id: number;
      label: string;
      parent_id: number;
    }>;
  }[];
  created_at: string;
  updated_at: string;
} 