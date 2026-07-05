'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Clock, BookOpen, Play, CheckCircle2 } from 'lucide-react';
import type { CourseListItem } from '@/lib/types';

interface CourseCardProps {
  course: CourseListItem;
  onClick: () => void;
}

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Lanjut',
};

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card
      className="course-card overflow-hidden cursor-pointer border border-border h-full flex flex-col"
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-teal-400" />
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <Badge variant="secondary" className="bg-white/90 text-foreground text-xs">
              {LEVEL_LABEL[course.level] || course.level}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            {course.premium ? (
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                Premium
              </Badge>
            ) : (
              <Badge className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                Gratis
              </Badge>
            )}
          </div>
          {/* Hover play overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/0 hover:bg-white/95 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
              <Play className="w-5 h-5 text-teal-700 fill-teal-700" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category */}
          {course.category && (
            <div className="text-xs text-teal-600 font-medium mb-1">
              {course.category.name}
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
            {course.title}
          </h3>

          {/* Short desc */}
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
            {course.shortDesc}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={course.instructor.avatar || undefined} />
              <AvatarFallback className="text-[10px] bg-teal-100 text-teal-700">
                {course.instructor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {course.instructor.name}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs mb-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{course.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({course.reviewCount})</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {course.enrollCount > 1000 ? `${(course.enrollCount / 1000).toFixed(1)}k` : course.enrollCount}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.totalDuration}m
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BookOpen className="w-3.5 h-3.5" />
              {course.totalLessons} pelajaran
            </div>
            <Badge variant="outline" className="text-teal-700 border-teal-200 bg-teal-50">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {course.premium ? 'Berbayar' : 'Gratis'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
