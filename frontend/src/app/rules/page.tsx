import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { RulesAccordion } from '@/components/rules/RulesAccordion';
import staticRulesData from '../../../public/data/rules.json';

export const metadata = {
    title: 'Directives | BGMI Campus Star Rules',
    description: 'Code of conduct rules and engagement regulations for active campus ambassadors.',
}

function RulesPage() {
    return (
        <>
            <Navbar />

            <div className='min-h-screen text-foreground font-body select-none pt-32 pb-24'>
                <div className='max-w-5xl mx-auto px-4 lg:px-8 space-y-12'>
          
                    <div className='space-y-4 border-b border-[#1f1f1f] pb-8'>
                        <div className='inline-flex items-center gap-3 px-6 py-2 border-l-4 border-primary bg-primary/10'>
                            <span className='w-2 h-2 bg-primary animate-pulse' />
                            <span className='text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.3em] text-primary'>RULES OF CONDUCT</span>
                        </div>
                        <h1 className='text-4xl sm:text-5xl md:text-7xl font-black leading-none text-white uppercase tracking-tight'>
                            RULES & <span className='text-primary italic'>REGS.</span>
                        </h1>
                        <p className='text-sm sm:text-base md:text-xl text-[#8C8C8C] max-w-2xl font-medium uppercase tracking-tight'>
                            Strict compliance with the standard operating parameters compiled below is required to maintain leaderboard validity.
                        </p>
                    </div>

                    <RulesAccordion rulesData={staticRulesData} />

                </div>
            </div>

            <Footer/>
        </>
    );
}

export default RulesPage;