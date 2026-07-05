export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatar?: string | null;
  headline?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
}

export interface Instructor {
  id: string;
  name: string;
  avatar?: string | null;
  headline?: string | null;
  bio?: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  contentMd?: string | null;
  videoUrl?: string | null;
  durationMin: number;
  order: number;
  preview: boolean;
}

export interface Module {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  lessons: Lesson[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string | null;
    headline?: string | null;
  };
}

export interface CourseListItem {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string | null;
  thumbnail?: string | null;
  level: string;
  rating: number;
  reviewCount: number;
  enrollCount: number;
  premium: boolean;
  price: number;
  category?: Category | null;
  instructor: Instructor;
  totalLessons: number;
  totalDuration: number;
}

export interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  thumbnail?: string | null;
  previewVideo?: string | null;
  level: string;
  language: string;
  durationMin: number;
  price: number;
  premium: boolean;
  rating: number;
  reviewCount: number;
  enrollCount: number;
  whatYouLearn?: string | null;
  requirements?: string | null;
  tags?: string | null;
  category?: Category | null;
  instructor: Instructor;
  modules: Module[];
  reviews: Review[];
}

export interface Enrollment {
  id: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string | null;
  progressPct: number;
  lastAccessed?: string | null;
  course: CourseDetail;
  progressMap: Record<string, boolean>;
  totalLessons: number;
  completedLessons: number;
  progressPct: number;
  hasCertificate: boolean;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  issuedAt: string;
  course: {
    id: string;
    title: string;
    instructor: {
      name: string;
      headline?: string | null;
    };
  };
}

export type View =
  | { type: 'home' }
  | { type: 'course'; slug: string }
  | { type: 'learn'; courseId: string; lessonId?: string }
  | { type: 'dashboard' }
  | { type: 'certificate'; certificateId: string }
  | { type: 'quiz'; courseId: string };
