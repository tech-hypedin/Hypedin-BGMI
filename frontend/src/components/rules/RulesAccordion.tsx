'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';

type RulesDataType = {
    id: string,
    title: string,
    type: string,
    items: string[]
}

/* Per-type accent class sets — kept as full literal strings so Tailwind can detect them. */
const POSITIVE = {
    rail: 'from-primary',
    box: 'border-primary/40 text-primary bg-primary/10',
    label: 'text-primary',
    icon: 'text-primary',
    hover: 'hover:border-primary/50',
};
const NEGATIVE = {
    rail: 'from-[#f9423a]',
    box: 'border-[#f9423a]/40 text-[#f9423a] bg-[#f9423a]/10',
    label: 'text-[#f9423a]',
    icon: 'text-[#f9423a]',
    hover: 'hover:border-[#f9423a]/50',
};

function RulesAccordion({ rulesData }: { rulesData: RulesDataType[] }) {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ 'DO_ENGAGEMENT': true, 'DONT_VIOLATIONS': true });

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    }

    return (
        <div className='space-y-8'>
            {rulesData.map((section) => {
                const isSectionOpen = expandedSections[section.id];
                const isPositive = section.type === 'DO';
                const s = isPositive ? POSITIVE : NEGATIVE;

                return (
                    <div key={section.id} className='border border-[#1f1f1f] bg-[#0e0e0e]/40 backdrop-blur-xs'>
                        {/* colored accent rail */}
                        <div className={`h-[3px] w-full bg-gradient-to-r ${s.rail} to-transparent`} />

                        <button onClick={() => toggleSection(section.id)} className='w-full flex items-center justify-between gap-4 p-5 md:p-6 hover:bg-[#141412] transition-colors cursor-pointer group text-left'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-11 h-11 shrink-0 border flex items-center justify-center transition-transform group-hover:scale-105 ${s.box}`}>
                                    {isPositive ? <ShieldCheck className='w-5 h-5' /> : <ShieldAlert className='w-5 h-5' />}
                                </div>
                                <div>
                                    <h2 className='text-lg md:text-2xl font-black text-white uppercase tracking-wider leading-none'>
                                        {section.title}
                                    </h2>
                                    <span className={`mt-2 block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] ${s.label}`}>
                                        {String(section.items.length).padStart(2, '0')} {isPositive ? 'Directives' : 'Violations'}
                                    </span>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: isSectionOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className='text-[#8C8C8C] group-hover:text-white shrink-0'
                            >
                                <ChevronDown className='w-6 h-6' />
                            </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                            {isSectionOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className='overflow-hidden'
                                >
                                    <div className='p-4 md:p-5 pt-0 grid sm:grid-cols-2 gap-3'>
                                        {section.items.map((rule, index) => (
                                            <div
                                                key={index}
                                                className={`group/item flex items-start gap-3 p-4 border border-[#1f1f1f] bg-[#0b0b0a] transition-all duration-200 hover:bg-[#141412] hover:-translate-y-0.5 ${s.hover}`}
                                            >
                                                <div className={`w-6 h-6 shrink-0 border border-[#1f1f1f] flex items-center justify-center transition-colors group-hover/item:border-current ${s.icon}`}>
                                                    {isPositive ? <Check className='w-3.5 h-3.5' /> : <X className='w-3.5 h-3.5' />}
                                                </div>
                                                <p className='text-sm text-white/85 font-semibold uppercase tracking-wide leading-snug'>
                                                    <span className='font-mono text-[#5f5950] mr-1.5'>{String(index + 1).padStart(2, '0')}</span>
                                                    {rule}
                                                </p>
                                            </div>
                                        ))}
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

export { RulesAccordion }
