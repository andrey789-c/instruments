'use client';

import { useState, useCallback } from 'react';

/**
 * Правила валидации для одного поля
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  number?: boolean;
  min?: number;
  max?: number;
  match?: string; // Имя поля для сравнения (например, confirmPassword)
  custom?: (value: string, formData?: Record<string, string>) => string | null;
}

/**
 * Набор правил для формы
 */
export interface ValidationRules {
  [key: string]: ValidationRule;
}

/**
 * Хук для валидации форм
 * 
 * @example
 * const { errors, validate, clearError, validateField, setError } = useFormValidation();
 * 
 * const rules = {
 *   email: { required: true, email: true },
 *   password: { required: true, minLength: 6 }
 * };
 * 
 * if (validate(formData, rules)) {
 *   // Форма валидна
 * }
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Валидация одного поля
   */
  const validateField = useCallback((
    name: string,
    value: string,
    rule: ValidationRule,
    formData?: Record<string, string>
  ): string | null => {
    // Пропускаем валидацию для пустых необязательных полей
    if (!rule.required && !value.trim()) {
      return null;
    }

    // Required
    if (rule.required && !value.trim()) {
      return 'Это поле обязательно';
    }

    // Email
    if (rule.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Введите корректный email';
      }
    }

    // URL
    if (rule.url && value) {
      try {
        new URL(value);
      } catch {
        return 'Введите корректный URL';
      }
    }

    // Number
    if (rule.number && value) {
      if (isNaN(Number(value))) {
        return 'Введите число';
      }
    }

    // Min/Max (для чисел)
    if (rule.min !== undefined && value) {
      const num = Number(value);
      if (!isNaN(num) && num < rule.min) {
        return `Минимальное значение: ${rule.min}`;
      }
    }

    if (rule.max !== undefined && value) {
      const num = Number(value);
      if (!isNaN(num) && num > rule.max) {
        return `Максимальное значение: ${rule.max}`;
      }
    }

    // MinLength
    if (rule.minLength && value.length < rule.minLength) {
      return `Минимум ${rule.minLength} символов`;
    }

    // MaxLength
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Максимум ${rule.maxLength} символов`;
    }

    // Pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Неверный формат';
    }

    // Match (сравнение с другим полем)
    if (rule.match && formData) {
      const matchValue = formData[rule.match];
      if (value !== matchValue) {
        return 'Значения не совпадают';
      }
    }

    // Custom
    if (rule.custom) {
      return rule.custom(value, formData);
    }

    return null;
  }, []);

  /**
   * Валидация всей формы
   * @returns true если форма валидна, false если есть ошибки
   */
  const validate = useCallback((
    data: Record<string, string>,
    rules: ValidationRules
  ): boolean => {
    const newErrors: Record<string, string> = {};

    Object.keys(rules).forEach((field) => {
      const error = validateField(field, data[field] || '', rules[field], data);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  /**
   * Валидация одного поля формы (для валидации onChange)
   * @returns true если поле валидно
   */
  const validateSingleField = useCallback((
    name: string,
    value: string,
    rule: ValidationRule,
    formData?: Record<string, string>
  ): boolean => {
    const error = validateField(name, value, rule, formData);
    
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
      return false;
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      return true;
    }
  }, [validateField]);

  /**
   * Очистить ошибку конкретного поля
   */
  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Очистить все ошибки
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Установить ошибку вручную
   */
  const setError = useCallback((field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  /**
   * Установить несколько ошибок сразу
   */
  const setMultipleErrors = useCallback((newErrors: Record<string, string>) => {
    setErrors(newErrors);
  }, []);

  /**
   * Проверить есть ли ошибки
   */
  const hasErrors = useCallback((): boolean => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  /**
   * Получить ошибку конкретного поля
   */
  const getError = useCallback((field: string): string | undefined => {
    return errors[field];
  }, [errors]);

  return {
    errors,
    validate,
    validateField: validateSingleField,
    clearError,
    clearAllErrors,
    setError,
    setMultipleErrors,
    hasErrors,
    getError,
  };
};

/**
 * Готовые правила валидации для часто используемых полей
 */
export const commonRules = {
  email: {
    required: true,
    email: true,
  } as ValidationRule,

  password: {
    required: true,
    minLength: 6,
  } as ValidationRule,

  strongPassword: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (!/[A-Z]/.test(value)) {
        return 'Пароль должен содержать заглавную букву';
      }
      if (!/[a-z]/.test(value)) {
        return 'Пароль должен содержать строчную букву';
      }
      if (!/[0-9]/.test(value)) {
        return 'Пароль должен содержать цифру';
      }
      return null;
    },
  } as ValidationRule,

  phone: {
    required: true,
    pattern: /^[\d\s\+\-\(\)]+$/,
    minLength: 10,
  } as ValidationRule,

  url: {
    url: true,
  } as ValidationRule,

  required: {
    required: true,
  } as ValidationRule,

  number: {
    number: true,
  } as ValidationRule,
};