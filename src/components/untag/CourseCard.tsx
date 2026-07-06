'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Clock, BookOpen, Play, CheckCircle2 } from 'lucide-react';
import type { CourseListItem } from '@/lib/types';
import { TiltCard } from './animations';

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
    <TiltCard maxTilt={10} scale={1.03} className="h-full cursor-pointer" glare>
      <Card
        onClick={onClick}
        className="overflow-hidden border border-navy-100/50 h-full flex flex-col rounded-3xl bg-white shadow-[0_4px_16px_rgba(10,22,40,0.04)] hover:shadow-[0_24px_64px_-16px_rgba(10,22,40,0.18)] transition-shadow"
      >
        <CardContent className="p-0 flex flex-col h-full">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-navy-100">
            {course.thumbnail ? (
              <motion.img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-100 to-blue-100 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-navy-300" />
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 via-transparent to-transparent" />

            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-navy-900 text-xs rounded-full px-2.5 py-1 shadow-sm">
                {LEVEL_LABEL[course.level] || course.level}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              {course.premium ? (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-full px-2.5 py-1 shadow-sm">
                  Premium
                </Badge>
              ) : (
                <Badge className="bg-navy-900/90 backdrop-blur-md hover:bg-navy-900 text-white text-xs rounded-full px-2.5 py-1 shadow-sm">
                  Gratis
                </Badge>
              )}
            </div>

            {/* Hover play button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-navy-950/30"
            >
              <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                <Play className="w-6 h-6 text-navy-900 fill-navy-900 ml-0.5" />
              </div>
            </motion.div>
          </div>

          {/* Body */}
          <div className="p-5 flex flex-col flex-1">
            {/* Category */}
            {course.category && (
              <div className="text-xs text-navy-700 font-semibold mb-1.5 uppercase tracking-wide">
                {course.category.name}
              </div>
            )}

            {/* Title */}
            <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
              {course.title}
            </h3>

            {/* Short desc */}
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">
              {course.shortDesc}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6 ring-1 ring-navy-100">
                <AvatarImage src={course.instructor.avatar || undefined} />
                <AvatarFallback className="text-[10px] bg-navy-100 text-navy-700">
                  {course.instructor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {course.instructor.name}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs mb-3 pt-3 border-t border-navy-100">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-foreground">{course.rating.toFixed(1)}</span>
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
              <Badge variant="outline" className="text-navy-700 border-navy-200 bg-navy-50 rounded-full">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {course.premium ? 'Berbayar' : 'Gratis'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}
