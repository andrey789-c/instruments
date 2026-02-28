import React from 'react';
import { PricingPlan } from '../config/pricing';


interface PricingCardProps {
  plan: PricingPlan;
  onSelect: (planId: string) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelect }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  return (
    <div
      className={`
        relative flex flex-col h-full
        bg-white rounded-2xl p-8 
        shadow-lg hover:shadow-2xl
        transition-all duration-300 hover:-translate-y-2
        ${plan.popular ? 'border-4 border-blue-600 scale-105' : 'border border-gray-100'}
      `}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          🔥 Популярный
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-sm text-gray-500">{plan.description}</p>
      </div>

      {/* Price Block */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-5xl font-bold text-gray-900">{formatPrice(plan.price)}</span>
          {plan.price > 0 && <span className="text-2xl text-gray-500">₽</span>}
        </div>
        <p className="text-gray-500">{plan.period}</p>

        {plan.additionalCosts && (
          <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg leading-relaxed">
            <strong className="text-gray-700">+ Дополнительно:</strong>
            <br />
            Каждый админ: <strong className="text-gray-800">+{plan.additionalCosts.admin}₽/мес</strong>
            <br />
            Каждый пользователь: <strong className="text-gray-800">+{plan.additionalCosts.user}₽/мес</strong>
          </div>
        )}
      </div>

      {/* Features List */}
      <ul className="flex-grow mb-8 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-gray-700 border-b border-gray-100 pb-3 last:border-0">
            <span className="text-green-500 text-lg flex-shrink-0 mt-0.5">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
        {plan.limitations.map((limitation, index) => (
          <li key={`limit-${index}`} className="flex items-start gap-3 text-red-500 border-b border-gray-100 pb-3 last:border-0">
            <span className="text-lg flex-shrink-0 mt-0.5">✗</span>
            <span className="text-sm">{limitation}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan.id)}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold uppercase tracking-wide text-base
          transition-all duration-300 hover:-translate-y-1
          ${
            plan.popular
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40'
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white'
          }
        `}
      >
        {plan.price === 0 ? 'Начать бесплатно' : 'Выбрать план'}
      </button>
    </div>
  );
};