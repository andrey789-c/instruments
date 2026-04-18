/**
 * Маска телефона: +7 (XXX) XXX XX XX
 */

export function formatPhoneMask(value: string): string {
  // Оставляем только цифры
  let digits = value.replace(/\D/g, '');

  // Если начинается с 8 — заменяем на 7
  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  }

  // Если не начинается с 7 — добавляем
  if (digits.length > 0 && !digits.startsWith('7')) {
    digits = '7' + digits;
  }

  // Ограничиваем 11 цифрами
  digits = digits.slice(0, 11);

  if (digits.length === 0) return '';

  let result = '+7';
  if (digits.length > 1) result += ' (' + digits.slice(1, 4);
  if (digits.length >= 4) result += ')';
  if (digits.length >= 5) result += ' ' + digits.slice(4, 7);
  if (digits.length >= 8) result += ' ' + digits.slice(7, 9);
  if (digits.length >= 10) result += ' ' + digits.slice(9, 11);

  return result;
}

/**
 * Возвращает только цифры из отформатированного номера
 */
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Проверяет, что номер полный (11 цифр, начинается с 7)
 */
export function isPhoneComplete(value: string): boolean {
  const digits = unformatPhone(value);
  return digits.length === 11 && digits.startsWith('7');
}
