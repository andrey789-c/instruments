import { 
  Table2, 
  Shield, 
  Clock, 
  Search, 
  Download, 
  Smartphone 
} from "lucide-react";

export const FEATURES = [
  {
    icon: Table2,
    title: "Гибкие таблицы",
    description: "Создавайте кастомные поля под любые задачи — текст, числа, даты, чекбоксы.",
    color: "bg-violet-500",
    lightBg: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    icon: Shield,
    title: "Ролевой доступ",
    description: "Владелец, Админ или Работник — настройте права для каждого сотрудника.",
    color: "bg-[#FF6B35]",
    lightBg: "bg-[#FF6B35]/10",
    borderColor: "border-[#FF6B35]/20",
  },
  {
    icon: Clock,
    title: "История изменений",
    description: "Видьте, кто и когда менял данные. Откатывайте ошибки одним кликом.",
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    icon: Search,
    title: "Фильтры и поиск",
    description: "Мгновенно находите нужные записи среди тысяч строк. Сохраняйте фильтры.",
    color: "bg-sky-500",
    lightBg: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  {
    icon: Download,
    title: "Экспорт данных",
    description: "Выгружайте таблицы в Excel или CSV для отчётов и анализа.",
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    icon: Smartphone,
    title: "Работа с телефона",
    description: "Полный функционал в мобильной версии — управляйте бизнесом из любой точки.",
    color: "bg-pink-500",
    lightBg: "bg-pink-50",
    borderColor: "border-pink-200",
  },
];