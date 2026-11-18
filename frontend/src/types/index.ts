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
