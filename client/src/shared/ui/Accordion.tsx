'use client'

import { useState } from 'react';

interface AccordionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export const Accordion = ({ title, content, defaultOpen = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-6 bg-transparent border-none cursor-pointer text-left transition-colors hover:text-blue-600"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">
          {title}
        </span>
        <svg
          className={`flex-shrink-0 transition-transform duration-300 text-gray-500 ${
            isOpen ? 'rotate-180' : ''
          }`}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <div className="pb-6">
          <p className="text-gray-600 leading-relaxed m-0">{content}</p>
        </div>
      </div>
    </div>
  );
};