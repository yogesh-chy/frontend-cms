export const env = {
  NEXT_PUBLIC_DJANGO_API_URL: process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000",
  DJANGO_API_URL: process.env.DJANGO_API_URL || "http://127.0.0.1:8000",
  NODE_ENV: process.env.NODE_ENV || "development",
};
