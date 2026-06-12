import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const { customer_name, pet_name, comment, rating } = testimonial;

  // Generate stars array
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between overflow-hidden">
      {/* Decorative Quote Icon */}
      <div className="absolute -top-3 -right-3 text-slate-100/60 pointer-events-none transform rotate-12">
        <Quote size={80} className="fill-slate-100 stroke-none" />
      </div>

      <div>
        {/* Rating Stars */}
        <div className="flex gap-0.5 text-amber-400 mb-4 relative z-10">
          {stars.map((filled, idx) => (
            <Star
              key={idx}
              size={16}
              className={filled ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
            />
          ))}
        </div>

        {/* Comment */}
        <p className="text-sm text-slate-600 leading-relaxed font-normal relative z-10 italic">
          "{comment}"
        </p>
      </div>

      {/* Author details */}
      <div className="mt-6 pt-4 border-t border-slate-100 relative z-10">
        <h4 className="text-sm font-bold text-slate-900 font-sans">{customer_name}</h4>
        <p className="text-xs text-teal-600 font-semibold mt-0.5">Pemilik {pet_name}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
