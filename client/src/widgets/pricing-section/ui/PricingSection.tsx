'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/src/shared/api';
import { pricingPlans } from '../config/pricing';

export const PricingSection: React.FC = () => {
  const router = useRouter();

  const handlePlanSelect = () => {
    if (authApi.isAuthenticated()) {
      router.push('/dashboard');
      return;
    }
    router.push('/auth/register');
  };

  const plan = pricingPlans[1]; // платный тариф

  return (
    <section className="py-20 px-5 bg-gradient-to-br from-gray-50 to-gray-100" id="price">
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

        {/* Full-width pricing block */}
        <div className="bg-white rounded-2xl p-10 shadow-sm">

          {/* Plan name + price */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 pb-10 border-b border-gray-100">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-base">{plan.description}</p>
            </div>
            <div className="flex items-end gap-2 shrink-0">
              <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
              <span className="text-gray-400 text-lg mb-1">/ мес</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handlePlanSelect}
            className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white text-base font-semibold rounded-xl hover:bg-gray-700 transition-colors"
          >
            Начать
          </button>
        </div>

        {/* Free tier note */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Также доступен <span className="font-medium text-gray-700">бесплатный тариф</span> — регистрируйтесь и начинайте без каких-либо вложений.
        </p>

      </div>
    </section>
  );
};