import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata = {
    title: 'Privacy Policy | BGMI Campus MVP',
    description: 'How the BGMI Campus MVP program collects, uses, and protects your information.',
};

const SECTIONS: { h: string; p: string[] }[] = [
    {
        h: '1. Introduction',
        p: [
            'The BGMI Campus MVP program ("the Program") is operated by partner agency HYPEDIN on behalf of the BGMI Campus initiative. This Privacy Policy explains what information we collect when you apply to or interact with the Program, how we use it, how long we keep it, and the choices you have.',
            'By submitting an application or support request, you consent to the practices described in this policy. If you do not agree, please do not submit your information.',
        ],
    },
    {
        h: '2. Information We Collect',
        p: [
            'When you submit the application or contact form, we collect the details you provide — which may include your name, email address, phone number, college or university, course and current year, your BGMI competitive rank, and your written responses to program questions.',
            'During the Program we may also collect information you submit to verify activity — such as screenshots, invite records, attendance proof, and mission submissions — along with submission timestamps.',
            'We automatically collect basic technical information (such as device, browser, and approximate usage data) when you use the site, to keep it secure and working correctly.',
        ],
    },
    {
        h: '3. How We Use Your Information',
        p: [
            'We use your information to review and process your application, communicate with you about the Program, run program activities, verify mission completion and allocate rewards, maintain leaderboards, prevent fraud and rule violations, and provide support.',
        ],
    },
    {
        h: '4. Media & Publicity',
        p: [
            'If selected as a Campus MVP, you may be invited to participate in interviews, testimonials, photo or video shoots, case studies, media features, press releases, social media campaigns, promotional content, or other marketing and public relations activities. By participating in the program, you grant KRAFTON India and its authorized partners the right to use your name, photograph, likeness, voice, college affiliation, quotes, and other related content for promotional, editorial, marketing, and publicity purposes across digital, print, broadcast, and other media channels.',
        ],
    },
    {
        h: '5. Communications',
        p: [
            'If you apply or participate, we may contact you about the Program via email, phone, WhatsApp, Discord, or in-app notifications — for example, regarding your application status, missions, announcements, and rewards.',
            'You can opt out of non-essential communications at any time by contacting us; some essential operational messages may still be sent while you are an active participant.',
        ],
    },
    {
        h: '6. Sharing & Disclosure',
        p: [
            'Your information is handled by HYPEDIN as the operating partner agency, and may be shared with the BGMI Campus initiative for the purposes of running the Program. We do not sell your personal information.',
            'We may share information with trusted service providers (such as hosting, communication, and form/data tools) who process it on our behalf and only as needed to operate the Program. We may also disclose information where required by law, or to protect the rights, safety, and integrity of the Program and its participants.',
        ],
    },
    {
        h: '7. Data Retention',
        p: [
            'We keep your personal information only as long as necessary to run the Program. Application and contact data is deleted within 3 months of the end of the program cycle — or within 3 months of your submission if you are not selected — unless a longer period is genuinely required by law or to resolve a dispute.',
            'You may request earlier deletion of your data at any time (see "Your Rights" below).',
        ],
    },
    {
        h: '8. Cookies & Analytics',
        p: [
            'The site may use cookies and similar technologies for basic functionality and to understand aggregate usage so we can improve the experience. You can control cookies through your browser settings; disabling them may affect some site features.',
        ],
    },
    {
        h: '9. Security',
        p: [
            'We take reasonable technical and organisational measures to protect your information against unauthorised access, loss, or misuse. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
        ],
    },
    {
        h: '10. Your Rights',
        p: [
            'Subject to applicable law, you may request access to, correction of, or deletion of your personal information, and you may withdraw consent or object to certain processing. To make a request, contact us using the details below; we will respond within a reasonable timeframe.',
        ],
    },
    {
        h: '11. Eligibility & Minors',
        p: [
            'The Program is intended for college and university students. If you are under the age of 18, you should only apply with the consent of a parent or guardian. We do not knowingly collect information from children outside the Program’s intended audience.',
        ],
    },
    {
        h: '12. Changes to This Policy',
        p: [
            'We may update this Privacy Policy from time to time. Material changes will be reflected on this page with an updated revision date.',
        ],
    },
    {
        h: '13. Contact Us',
        p: [
            'For any privacy questions or requests — including data deletion — reach out through the Contact page on this site, addressed to the BGMI Campus MVP team (operated by HYPEDIN).',
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <>
            <Navbar />
            <main className='min-h-screen text-foreground font-body'>
                <section className='relative pt-36 md:pt-44 pb-24 overflow-hidden'>
                    <div className='absolute inset-0 scanlines' aria-hidden='true' />
                    <div className='relative max-w-3xl mx-auto px-6 lg:px-8'>
                        <div className='inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 mb-6'>
                            <span className='relative flex h-1.5 w-1.5'>
                                <span className='animate-ping absolute inline-flex h-full w-full bg-primary opacity-60' />
                                <span className='relative inline-flex h-1.5 w-1.5 bg-primary' />
                            </span>
                            <span className='font-heading text-xs md:text-sm tracking-[0.12em] sm:tracking-[0.25em] text-primary uppercase'>Legal</span>
                        </div>

                        <h1 className='text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-[0.95]'>
                            Privacy <span className='text-primary'>Policy</span>
                        </h1>
                        <p className='mt-4 text-sm text-muted-foreground uppercase tracking-[0.2em]'>Last updated: June 2026</p>

                        <div className='mt-12 space-y-10'>
                            {SECTIONS.map((s) => (
                                <div key={s.h} className='space-y-3'>
                                    <h2 className='text-lg md:text-xl text-white'>{s.h}</h2>
                                    {s.p.map((para, i) => (
                                        <p key={i} className='text-sm md:text-base text-muted-foreground leading-relaxed'>{para}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}