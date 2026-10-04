import Link from 'next/link';

export const metadata = { title: 'Not Found | BGMI Campus MVP' };

export default function NotFound() {
    return (
        <main className='min-h-screen flex flex-col items-center justify-center text-center px-6 font-body'>
            <p className='font-heading text-7xl md:text-9xl text-primary leading-none'>404</p>
            <h1 className='mt-4 text-2xl md:text-3xl font-bold text-white uppercase tracking-wider'>Sector Not Found</h1>
            <p className='mt-3 text-muted-foreground max-w-md'>
                This coordinate doesn&apos;t exist on the map. Head back to base.
            </p>
            <Link href='/' className='mt-8 inline-flex h-12 items-center px-8 bg-primary text-black font-bold uppercase tracking-widest hover:bg-[#ffb24d] transition-colors'>
                Return to Base
            </Link>
        </main>
    );
}
