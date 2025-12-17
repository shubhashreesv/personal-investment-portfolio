import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'How do I add investments to my portfolio?',
      answer:
        "You can add investments by clicking the 'Add Investment' button on your dashboard and filling in the required information.",
    },
    {
      question: 'How often are stock prices updated?',
      answer:
        'Stock prices are updated in real-time during market hours using reliable financial data providers.',
    },
    {
      question: 'Can I export my portfolio data?',
      answer:
        "Yes, you can export your portfolio data in various formats from the Settings page. Just click on the 'Export Portfolio Data' button.",
    },
    {
      question: 'How do I set up price alerts?',
      answer:
        'You can set up price alerts for your investments from the Settings page. Choose your preferred notification method and set your target prices.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-teal-600 mb-10 text-center tracking-wide">
        Frequently Asked Questions
      </h2>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-teal-700 mb-3">
              {faq.question}
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
