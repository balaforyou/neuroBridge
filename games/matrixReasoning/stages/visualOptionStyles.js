export function getOptionButtonClassList(isVisualStage) {
    const baseClasses = "h-14 border-2 rounded-xl flex items-center justify-center text-base font-bold transition duration-150 focus:outline-none disabled:opacity-40 disabled:pointer-events-none";

    if (isVisualStage) {
        return `${baseClasses} bg-slate-100 border-slate-300 hover:bg-slate-200 focus:ring-2 focus:ring-indigo-500 shadow-sm`;
    }

    return `${baseClasses} bg-slate-900 border-slate-800 hover:border-indigo-500 active:bg-indigo-950 text-slate-100`;
}
