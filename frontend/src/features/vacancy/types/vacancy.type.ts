import { User } from "@/features/user/types/user.type";

export interface Vacancy {
  id: number;
  judul: string;
  deskripsi: string;
  file: string | null;
  link_pendaftaran: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: Omit<User, "email" | "role" | "created_at" | "updated_at">;
}
