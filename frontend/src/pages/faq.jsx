import React, { useState } from 'react';

const faqData = [
  { id: 1, question: "What is Smart Education?", answer: "Smart Education is a platform offering various free courses, interactive discussions, an open community, doubt sessions, and an AI chatbot for support." },
  { id: 2, question: "How do I sign up for courses?", answer: "Simply create an account, browse available courses, and enroll in your preferred one. All courses are completely free." },
  { id: 3, question: "Are all courses really free?", answer: "Yes! All courses on our platform are free with no hidden charges." },
  { id: 4, question: "Do I get a certificate after completing a course?", answer: "Yes, after completing a course, you can download a free certificate of completion." },
  { id: 5, question: "How does the open community work?", answer: "The open community allows learners to ask questions, share knowledge, and interact with peers and experts." },
  { id: 6, question: "What if I have a doubt while studying?", answer: "You can post your doubt in the open community or ask the AI chatbot." },
  { id: 7, question: "How can the AI chatbot help me?", answer: "The AI chatbot assists with course recommendations, doubt resolution, and platform navigation." },
  { id: 8, question: "Can I download course materials?", answer: "Yes, many courses offer downloadable resources like PDFs, notes, and assignments." },
  { id: 9, question: "Do I need any prior knowledge to join a course?", answer: "No! We offer courses for beginners as well as advanced learners." },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-5 bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqData.map((faq, index) => (
          <div key={faq.id} className="bg-white p-5 rounded-lg shadow-md transition-shadow duration-300">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleAnswer(index)}
            >
              <h2 className="font-semibold text-lg">{faq.question}</h2>
              <span className="text-xl">{activeIndex === index ? "➖" : "➕"}</span>
            </div>
            <p
              className={`mt-2 text-gray-600 transition-all duration-300 ${
                activeIndex === index ? "block" : "hidden"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
