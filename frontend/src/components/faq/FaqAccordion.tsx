'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ShieldAlert, Award, Zap, Target, Plus, type LucideIcon } from 'lucide-react';

const iconMap = {
    Target: Target,
    Award: Award,
    Zap: Zap,
    ShieldAlert: ShieldAlert,
} as const;

type IconKey = keyof typeof iconMap;

type QuestionType = {
    id: string,
    question?: string,
    text?: string,
    answer: string
};

export type CategoryType = {
    category: string,
    icon: IconKey,
    questions: QuestionType[]
};

export function FaqAccordion({ categories }: { categories: CategoryType[] }) {
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
        categories.reduce((acc, cat) => ({ ...acc, [cat.category]: true }), {} as Record<string, boolean>)
    );
    const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

    const toggleCategory = (categoryName: string) => {
        setExpandedCategories(prev => ({ ...prev, [categoryName]: !prev[categoryName] }));
    }

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
    }

    return (
        <div className='space-y-6'>
            {categories.map((cat, catIdx) => {
                const CategoryIcon: LucideIcon = iconMap[cat.icon] || HelpCircle;
                const isCategoryOpen = expandedCategories[cat.category] ?? true;

                return (
                    <div key={catIdx} className='border border-[#1f1f1f] bg-[#0e0e0e]/40 backdrop-blur-xs'>
                        {/* accent rail */}
                        <div className='h-[3px] w-full bg-gradient-to-r from-primary to-transparent' />

                        <button onClick={() => toggleCategory(cat.category)} className='w-full flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-[#141412] transition-colors cursor-pointer group text-left'>
                            <div className='flex items-center gap-4'>
                                <div className='w-11 h-11 shrink-0 border border-primary/40 bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-105'>
                                    <CategoryIcon className='w-5 h-5' />
                                </div>
                                <div>
                                    <h2 className='text-lg md:text-2xl font-black text-white uppercase tracking-wider leading-none'>
                                        {cat.category}
                                    </h2>
                                    <span className='mt-2 block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-primary'>
                                        {String(cat.questions.length).padStart(2, '0')} Queries
                                    </span>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className='text-[#8C8C8C] group-hover:text-white shrink-0'
                            >
                                <ChevronDown className='w-6 h-6' />
                            </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                            {isCategoryOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className='overflow-hidden'
                                >
                                    <div className='p-4 md:p-5 pt-0 space-y-2.5'>
                                        {cat.questions.map((q) => {
                                            const isQuestionOpen = expandedQuestions[q.id];
                                            const questionText = q.question ?? q.text ?? '';

                                            return (
                                                <div
                                                    key={q.id}
                                                    className={`border bg-[#0b0b0a] transition-colors ${isQuestionOpen ? 'border-primary/40' : 'border-[#1f1f1f] hover:border-primary/30'}`}
                                                >
                                                    <button onClick={() => toggleQuestion(q.id)} className='w-full flex items-start justify-between gap-3 text-left p-4 cursor-pointer group'>
                                                        <span className='flex items-start gap-2.5 text-sm md:text-base text-white/90 font-bold uppercase tracking-wide leading-snug group-hover:text-white transition-colors'>
                                                            <span className='font-mono text-primary/70 text-xs mt-0.5 shrink-0'>{q.id}</span>
                                                            {questionText}
                                                        </span>
                                                        <span className={`w-7 h-7 shrink-0 border flex items-center justify-center transition-all duration-300 ${isQuestionOpen ? 'border-primary/50 bg-primary/10 text-primary rotate-45' : 'border-[#1f1f1f] text-[#8C8C8C] group-hover:text-primary group-hover:border-primary/40'}`}>
                                                            <Plus className='w-4 h-4' />
                                                        </span>
                                                    </button>

                                                    <AnimatePresence initial={false}>
                                                        {isQuestionOpen && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                                                className='overflow-hidden'
                                                            >
                                                                <div className='mx-4 mb-4 pl-4 pr-4 py-3 bg-black/40 border-l-2 border-primary text-[#9a938c] font-medium text-sm leading-relaxed tracking-wide uppercase'>
                                                                    {q.answer}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
