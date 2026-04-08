export interface Book {
  id: string;
  title: string;
  author: string | null;
  review: string | null;
  score: number | null;
  created_at: string;
  updated_at: string;
}

export interface BookPayload {
  title: string;
  author?: string;
  review?: string;
  score?: number;
}
