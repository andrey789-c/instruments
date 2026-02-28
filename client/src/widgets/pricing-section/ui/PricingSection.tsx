'use client'

import React from 'react';
import { pricingPlans } from '../config/pricing';
import { PricingCard } from './PricingCard';

export const PricingSection: React.FC = () => {
  const handlePlanSelect = (planId: string) => {
    // TODO: Интеграция с роутером или модалкой регистрации
    console.log('Selected plan:', planId);
    
    // Временное решение - скролл к форме регистрации
    const registerSection = document.getElementById('register');
    if (registerSection) {
      registerSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(`Вы выбрали план: ${planId}. Регистрация в разработке!`);
    }
  };

  return (
    <section className="py-20 px-5 bg-gradient-to-br from-gray-50 to-gray-100" id="pricing">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Прозрачные тарифы
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Выберите подходящий план. Без скрытых платежей, без комиссий за транзакции.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};