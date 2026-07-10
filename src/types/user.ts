export interface Application {
  id: number | string;
  name: string;
  email: string;
  course: string;
  status: string;
  phone?: string;
  password?: string;
}

export interface UserProfile {
  id: number | string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  is_approved: boolean;
  phone?: string;
}
