import {
  BookOpen,
  Stethoscope,
  HandHeart,
  Home,
  Scissors,
  LifeBuoy,
  Heart,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Quote,
  CalendarDays,
  Users,
  ShieldCheck,
  Landmark,
} from "lucide-react";

const icons = {
  BookOpen,
  Stethoscope,
  HandHeart,
  Home,
  Scissors,
  LifeBuoy,
  Heart,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  Quote,
  CalendarDays,
  Users,
  ShieldCheck,
  Landmark,
};

export default function Icon({ name, className, strokeWidth = 1.75 }) {
  const Cmp = icons[name] ?? Heart;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
