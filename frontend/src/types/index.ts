// Later: generate these from the Django OpenAPI schema (/api/schema/)
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  estimated_hours: number;
  is_free: boolean;
}

export interface CertificateVerification {
  valid: boolean;
  status: string;
  certificate_code: string;
  holder_name: string;
  course: string;
  issued_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  country: string;
  email_verified_at: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  lesson_type: string;
  position: number;
  is_required: boolean;
}

export interface Module {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

export interface CourseDetail extends Course {
  pass_mark: number;
  modules: Module[];
}