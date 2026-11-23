/** Shared Tailwind class strings so buttons and inputs look identical everywhere. */
const base =
  'min-h-11 inline-flex items-center justify-center gap-2 rounded-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2';

export const btnPrimary = `${base} px-5 bg-teal-800 text-white hover:bg-teal-900`;
export const btnOutline = `${base} px-5 border border-slate-300 hover:bg-slate-50 disabled:opacity-50`;
export const btnBrandOutline = `${base} px-5 border border-teal-800 text-teal-800 hover:bg-teal-50`;
export const btnText = `${base} text-teal-800 hover:underline`;

export const field =
  'min-h-11 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700';