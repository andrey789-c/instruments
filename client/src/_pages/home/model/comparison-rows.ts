export interface IComparisonRow {
  feature: string
  us: string
  crm: string
}

export const COMPARISON_ROWS = [
  {
    feature: "Цена",
    us: "от 990 ₽ / мес",
    crm: "от 8 000 ₽ / мес",
  },
  {
    feature: "Время внедрения",
    us: "1 день",
    crm: "2–6 недель",
  },
  {
    feature: "Обучение сотрудников",
    us: "Не нужно — всё интуитивно",
    crm: "3–10 дней тренингов",
  },
  {
    feature: "Нужные функции",
    us: "Только то, что важно вам",
    crm: "Сотни функций, 80% — лишние",
  },
  {
    feature: "Поддержка",
    us: "Живой чат, ответ за 5 мин",
    crm: "Тикет-система, дни ожидания",
  },
];