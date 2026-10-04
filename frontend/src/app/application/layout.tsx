import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';

export const metadata: Metadata = {
	title: 'BGMI Campus | Partner Application',
	description: 'Apply for the BGMI Campus Partner Program',
}

export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
	return (
    	<main className='min-h-screen flex flex-col'>
    	  	<Navbar />
    	  	<div className={cx(
    	  	  	'flex-1 w-full mx-auto',
    	  	  	'pt-28 pb-8 md:pt-36 md:pb-12',
    	  	  	'px-4 sm:px-6 lg:px-8',
    	  	  	'max-w-7xl'
    	  	)}>
    	    	<section className='w-full h-full'>
    	       		{children}
    	    	</section>
    	  	</div>
    	</main>
  	);
}

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}