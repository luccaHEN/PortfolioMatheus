export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image_url?: string;
  video_url?: string;
  github_url?: string;
  live_url?: string;
  category: string;
  project_date: string;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  title: string;
  institution: string;
  hours: number;
  date: string;
  image_url?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}