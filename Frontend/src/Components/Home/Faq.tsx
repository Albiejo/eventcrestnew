import React, { useState } from 'react';


interface FAQ {
  question: string;
  answer: string;
}

const HomePageFaq: React.FC = () => {

  const faqs: FAQ[] = [
    {
      question: 'How good are your vendors?',
      answer: 'Our Vendors are of top notch quality. They are the best in the world..',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We only charge a token amount for customers and thats not refundable',
    },
    {
      question: 'Can I be a vendor at your platform?',
      answer: 'You can be a vendor very easily . Just signup and create your account as a vendor!',
    },

  ];

  // State to keep track of which FAQ answer is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Function to toggle open/close state of FAQ answer
  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-wrap items-start justify-center">
      {/* FAQ Section */}
      <div className="w-full md:w-1/2 px-16 pt-10">
        <div className="max-w-md">
          <h1 className="text-3xl font-semibold mb-6" style={{ fontFamily: 'playfair display' }}>Frequently Asked Questions</h1>
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4 border rounded-lg" >
              <button
                className="flex justify-between items-center w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                onClick={() => toggleAnswer(index)}
              >
                <span className="font-medium text-lg"style={{ fontFamily: 'playfair display' }}>{faq.question}</span>
                <svg
                  className={`w-4 h-4 ${openIndex === index ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={openIndex === index ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="p-4 bg-gray-100">
                  <p style={{ fontFamily: 'playfair display' }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* Image Section */}
      <div className="w-1/2 md:w-1/2 px-4 ">
        <img src="https://img.freepik.com/premium-vector/faq-banner-icon-flat-style_157943-22.jpg" alt="FAQ Banner" className="w-full" />
      </div>
    </div>
  );
    
};

export default HomePageFaq;
