import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'teal', subtitle }) => {
  const colorSchemes = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  const currentScheme = colorSchemes[color] || colorSchemes.teal;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h4 className="mt-2 text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
            {value}
          </h4>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`rounded-xl border p-3 ${currentScheme} shrink-0 shadow-inner`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
