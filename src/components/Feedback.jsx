import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Sarah Johnson',
    title: 'Marketing Manager',
    feedback:
      'TripTix has made my daily commute so much easier. The drivers are professional and the buses are always clean.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqiGDWxu58BS_M9_hloRMYzZ_f7LMEs8a6qA&s',
  },
  {
    name: 'Michael Smith',
    title: 'Software Engineer',
    feedback:
      'Reliable, safe, and comfortable. TripTix is my go-to transportation every day!',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqiGDWxu58BS_M9_hloRMYzZ_f7LMEs8a6qA&s',
  },
  {
    name: 'Ava Williams',
    title: 'College Student',
    feedback:
      'Booking is super simple and the buses are always on time. Love using TripTix!',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqiGDWxu58BS_M9_hloRMYzZ_f7LMEs8a6qA&s',
  },
  {
    name: 'Daniel Lee',
    title: 'Project Manager',
    feedback:
      'Great customer service and well-maintained vehicles. Highly recommended!',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqiGDWxu58BS_M9_hloRMYzZ_f7LMEs8a6qA&s',
  },
];

const Feedback = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="w-full px-4 py-16 bg-[#f5fefa] flex justify-center">
      <div className="max-w-4xl w-full text-center bg-white rounded-xl border border-transparent shadow-lg p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="flex mb-4">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg mx-0.5" />
                ))}
            </div>

            <p className="text-lg italic text-gray-800 max-w-2xl mb-6">
              “{testimonials[current].feedback}”
            </p>

            <div className="flex items-center gap-3">
              <img
                src={testimonials[current].image}
                alt={testimonials[current].name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-gray-900">{testimonials[current].name}</p>
                <p className="text-sm text-gray-500">{testimonials[current].title}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-6 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === current ? 'bg-green-400' : 'bg-gray-300'
              }`}
            ></button>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border text-gray-500 hover:bg-gray-100 cursor-pointer"
        >
          <FaArrowLeft className="mx-auto" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full border text-gray-500 hover:bg-gray-100 cursor-pointer"
        >
          <FaArrowRight className="mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default Feedback;
