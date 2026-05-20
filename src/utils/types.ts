export interface HealthArticle {
  id: number;
  heading: string;
  details: string;
  link: string;
  image: string;
  author: string;
}

export type VideoCategory = 'yoga' | 'strength' | 'cardio' | 'tutorial';
export type VideoLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface HealthVideo {
  id: number;
  title: string;
  description: string;
  uri: string;
  thumbnail: string;
  category: VideoCategory;
  duration: string;
  instructor: string;
  level: VideoLevel;
}