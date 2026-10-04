import Link from 'next/link';

export const metadata = { title: 'Unauthorized | BGMI Campus MVP', robots: { index: false, follow: false } };

export default function UnauthorizedPage() {
    return (
        <main className='min-h-screen flex flex-col items-center justify-center text-center px-6 font-body'>
            <p className='font-heading text-6xl md:text-8xl text-primary leading-none'>403</p>
            <h1 className='mt-4 text-2xl md:text-3xl font-bold text-white uppercase tracking-wider'>Access Denied</h1>
            <p className='mt-3 text-muted-foreground max-w-md'>
                You don&apos;t have clearance for this sector. Log in with an authorised account, or return to base.
            </p>
            <div className='mt-8 flex gap-4'>
                <Link href='/login' className='inline-flex h-12 items-center px-8 bg-primary text-black font-bold uppercase tracking-widest hover:bg-[#ffb24d] transition-colors'>
                    Log In
                </Link>
                <Link href='/' className='inline-flex h-12 items-center px-8 border border-border text-white font-bold uppercase tracking-widest hover:border-primary transition-colors'>
                    Base
                </Link>
            </div>
        </main>
    );
}
