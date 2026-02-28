export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limitations: string[];
  popular?: boolean;
  additionalCosts?: {
    admin: number;
    user: number;
  };
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Бесплатный',
    price: 0,
    period: 'навсегда',
    description: 'Для знакомства с сервисом',
    features: [
      '1 таблица',
      'Только владелец (вы)',
      'Базовые типы полей',
      'Экспорт в Excel',
    ],
    limitations: [
      'Без добавления пользователей',
      'Ограничено 1 таблицей',
    ],
  },
  {
    id: 'basic',
    name: 'Базовый',
    price: 600,
    period: 'в месяц',
    description: 'Для малого бизнеса',
    popular: true,
    features: [
      'До 5 таблиц',
      'Неограниченное кол-во записей',
      'Все типы полей',
      'Экспорт в Excel',
      'Уведомления в Telegram',
      'История изменений',
    ],
    limitations: [],
    additionalCosts: {
      admin: 200,
      user: 100,
    },
  },
  {
    id: 'pro',
    name: 'Продвинутый',
    price: 2000,
    period: 'в месяц',
    description: 'Для растущих команд',
    features: [
      '∞ Неограниченное кол-во таблиц',
      'Неограниченное кол-во записей',
      'Все типы полей',
      'Приоритетная поддержка',
      'Расширенная аналитика',
      'API доступ (скоро)',
      'Кастомные автоматизации',
    ],
    limitations: [],
    additionalCosts: {
      admin: 200,
      user: 100,
    },
  },
];