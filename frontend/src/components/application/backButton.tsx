import Link from 'next/link';
import { MoveLeft } from 'lucide-react';

export function BackButton() {
	return (
    	<Link href='/' className='flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-heading tracking-widest uppercase text-sm group'>
      		<MoveLeft className='w-4 h-4 transition-transform group-hover:-translate-x-1' />
      		Return to Base
    	</Link>
  	);
}