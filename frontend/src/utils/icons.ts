import {
  Briefcase,
  Palette,
  Home,
  BookOpen,
  Heart,
  Trophy,
  ShoppingBag,
  Music,
  Dumbbell,
  Coffee,
  Code,
  Camera,
} from 'lucide-react';

export const iconOptions = [
  { value: 'briefcase', label: '仕事' },
  { value: 'palette', label: '趣味' },
  { value: 'home', label: 'ホーム' },
  { value: 'book', label: '勉強' },
  { value: 'heart', label: '健康' },
  { value: 'trophy', label: '目標' },
  { value: 'shopping', label: '買い物' },
  { value: 'music', label: '音楽' },
  { value: 'dumbbell', label: '運動' },
  { value: 'coffee', label: '休憩' },
  { value: 'code', label: 'コード' },
  { value: 'camera', label: '写真' },
];

export function getProfileIcon(icon: string) {
  const icons: Record<string, typeof Briefcase> = {
    briefcase: Briefcase,
    palette: Palette,
    home: Home,
    book: BookOpen,
    heart: Heart,
    trophy: Trophy,
    shopping: ShoppingBag,
    music: Music,
    dumbbell: Dumbbell,
    coffee: Coffee,
    code: Code,
    camera: Camera,
  };
  return icons[icon] || Briefcase;
}
