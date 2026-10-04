'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className='min-h-screen flex flex-col items-center justify-center text-center px-6 font-body'>
            <p className='font-heading text-6xl md:text-8xl text-primary leading-none'>ERROR</p>
            <h1 className='mt-4 text-2xl md:text-3xl font-bold text-white uppercase tracking-wider'>Signal Interrupted</h1>
            <p className='mt-3 text-muted-foreground max-w-md'>
                Something went wrong on our end. You can retry, or head back to base.
            </p>
            {error?.digest && (
                <p className='mt-2 text-xs text-muted-foreground/60 font-mono'>REF: {error.digest}</p>
            )}
            <div className='mt-8 flex gap-4'>
                <button onClick={() => reset()} className='inline-flex h-12 items-center px-8 bg-primary text-black font-bold uppercase tracking-widest hover:bg-[#ffb24d] transition-colors'>
                    Retry
                </button>
                <Link href='/' className='inline-flex h-12 items-center px-8 border border-border text-white font-bold uppercase tracking-widest hover:border-primary transition-colors'>
                    Base
                </Link>
            </div>
        </main>
    );
}