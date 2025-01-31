/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',  // 테스트용 이미지
      'storage.googleapis.com',  // Supabase Storage 도메인
      'localhost'  // 로컬 개발용
    ],
  },
}

module.exports = nextConfig 