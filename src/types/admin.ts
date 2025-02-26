export interface Admin {
  id: string;  // UUID는 string으로 매핑
  email: string;
  name: string | null;  // text는 null 가능
  role: string | null;
  last_sign_in_at: string | null;  // timestamp는 string으로 매핑, null 가능
  created_at: string | null;
  phone: string | null;
  // 필요한 다른 필드 추가
} 