export type HospitalDetail = {
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
  categories: {
    depth2: {
      id: string;
      label: string;
    };
    depth3: {
      id: string;
      label: string;
    }[];
  }[];
  is_google?: boolean;
  is_advertised?: boolean;
  is_recommended?: boolean;
  is_member?: boolean;
  updated_at: string;
} 