import { Navbar } from '@/components/layout/navbar';
import { FaqAccordion, type CategoryType } from '@/components/faq/FaqAccordion';
import { Footer } from '@/components/layout/footer';
import faqData from '../../../public/data/faq.json';

export const metadata = {
  title: 'Intel Base | BGMI Campus Royale FAQs',
  description: 'Review tactical parameters, deployment responsibilities, and ranking reward pipelines.',
};

export default function FAQPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen text-foreground font-body select-none pt-32 pb-24">
                <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-12">
                    <div className="space-y-4 border-b border-[#1f1f1f] pb-8">
                        <div className="inline-flex items-center gap-3 px-6 py-2 border-l-4 border-primary bg-primary/10">
                            <span className="w-2 h-2 bg-primary animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.1em] sm:tracking-[0.3em] text-primary">INTEL VECTOR • DATABASE</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-none text-white uppercase tracking-tight">
                            KNOWLEDGE <span className="text-primary italic">BASE.</span>
                        </h1>
                        <p className="text-sm sm:text-base md:text-xl text-[#8C8C8C] max-w-2xl font-medium uppercase tracking-tight">
                            Review deployment parameters, query operational protocols, and understand your reward distribution channels.
                        </p>
                    </div>

                    <FaqAccordion categories={faqData as CategoryType[]} />

                </div>
            </div>
            <Footer/>
        </>
    );
}