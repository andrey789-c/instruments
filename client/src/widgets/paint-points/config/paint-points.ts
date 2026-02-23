interface PainCard {
  id: number;
  emoji: string;
  title: string;
  description: string;
  accent: string; // tailwind border/glow color
}

export const PAIN_CARDS: PainCard[] = [
  {
    id: 1,
    emoji: "💥",
    title: "Excel ломается и теряется",
    description:
      "Файл повреждён, коллега перезаписал данные, резервная копия недельной давности — знакомо? Каждая такая ситуация стоит часов работы и нервов.",
    accent: "border-red-500/40 hover:border-red-500/80 hover:shadow-red-500/10",
  },
  {
    id: 2,
    emoji: "💸",
    title: "CRM — дорого и сложно",
    description:
      "Корпоративные системы созданы для корпораций. Месяц внедрения, обучение персонала и ежемесячный счёт — непозволительная роскошь для малого бизнеса.",
    accent:
      "border-amber-500/40 hover:border-amber-500/80 hover:shadow-amber-500/10",
  },
  {
    id: 3,
    emoji: "📦",
    title: "Сотрудники путаются в остатках",
    description:
      "Один говорит «есть на складе», другой уже продал. Клиент разочарован, репутация страдает. Без единого источника правды хаос неизбежен.",
    accent:
      "border-orange-500/40 hover:border-orange-500/80 hover:shadow-orange-500/10",
  },
  {
    id: 4,
    emoji: "🕳️",
    title: "Нет истории изменений",
    description:
      "Кто и когда изменил цену? Почему пропала позиция? Без аудита невозможно разобраться в ошибках и предотвратить злоупотребления.",
    accent:
      "border-rose-500/40 hover:border-rose-500/80 hover:shadow-rose-500/10",
  },
];