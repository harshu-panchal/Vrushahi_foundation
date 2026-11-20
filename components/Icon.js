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
  Wallet,
  Building2,
  Receipt,
  ListChecks,
  History,
  CalendarRange,
  Plus,
  Pencil,
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
  Wallet,
  Building2,
  Receipt,
  ListChecks,
  History,
  CalendarRange,
  Plus,
  Pencil,
};

/**
 * The icon names an admin may choose from. Content stored in the database
 * holds one of these strings; anything else falls back to `Heart` below, so
 * a bad value degrades to an icon rather than a crash.
 */
export const ICON_NAMES = Object.keys(icons);

export default function Icon({ name, className, strokeWidth = 1.75 }) {
  const Cmp = icons[name] ?? Heart;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
