
import { Accordion } from '@/src/shared/ui';
import { faqData } from '../config/faq';



export const Faq = () => {
  return (
    <section className="py-20 px-4 bg-white" id='faq'>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Часто задаваемые вопросы
          </h2>
          <p className="text-xl text-gray-600">
            Ответы на самые популярные вопросы о TabloFlow
          </p>
        </div>

        <div className="mb-12">
          {faqData.map((item, index) => (
            <Accordion
              key={index}
              title={item.question}
              content={item.answer}
              defaultOpen={index === 0}
            />
          ))}
        </div>

        <div className="text-center p-8 bg-gray-50 rounded-xl">
          <p className="text-lg text-gray-700 mb-4">
            Не нашли ответ на свой вопрос?
          </p>
          <a 
            href="mailto:support@tabloflow.com" 
            className="inline-block text-blue-600 font-semibold hover:text-blue-800 transition-colors hover:underline"
          >
            Напишите нам
          </a>
        </div>
      </div>
    </section>
  );
};