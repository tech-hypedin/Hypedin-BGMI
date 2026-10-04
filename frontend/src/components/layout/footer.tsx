import React from 'react';
import { Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const socials = [{
  logo: <Twitter size={20}/>,
  link: 'https://x.com/BGMI_Official',
}, {
  logo: <Instagram size={20}/>,
  link: 'https://www.instagram.com/battlegroundsmobilein_official/',
}, {
  logo: <Youtube size={20}/>,
  link: 'https://www.youtube.com/@BattlegroundsMobile_IN'
}];

const details = [{
  text: 'ABOUT PROGRAM',
  path: '/#program'
}, {
  text: 'RULES & DIRECTIVES',
  path: '/rules'
}, {
  text: 'INTEL FAQ',
  path: '/faq'
}];

const navigation = [{
  text: 'APPLY NOW',
  path: '/application'
}, {
  text: 'CONTACT US',
  path: '/contact'
}, {
  text: 'PRIVACY POLICY',
  path: '/privacy'
}];

export function Footer() {
  return (
    <footer className='bg-[#090907] border-t border-[#1f1f1f] pt-32 pb-16 font-body'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-10 sm:gap-16 mb-16 sm:mb-24'>
          <div className='md:col-span-2'>
            <Link href='/' className='flex items-center gap-4 mb-8'>
              <div className='w-10 h-10 flex items-center justify-center pubg-btn'>
                <Image src='/bgmi-logo-white.webp' height={100} width={100} alt='BGMI Logo' />
              </div>
              <span className='text-xl font-bold text-white tracking-tighter uppercase font-heading'>BGMI CAMPUS MVP</span>
            </Link>
            <p className='text-[#8C8C8C] max-w-xs sm:max-w-sm leading-relaxed mb-10 font-normal uppercase tracking-tight'>
              ESTABLISHING THE ELITE SECTOR FOR ESPORTS LEADERSHIP. JOIN THE OFFICIAL RECRUITMENT PIPELINE AND DEPLOY YOUR INFLUENCE.
            </p>
            <div className='flex gap-4'>
              {socials.map((s, i) => (
                <Link key={i} href={s.link} target='_blank' replace className='w-12 h-12 border border-[#1f1f1f] flex items-center justify-center hover:bg-primary hover:border-primary text-white hover:text-black transition-all'>
                  {s.logo}
                </Link>
              ))}
            </div>
          </div>
        
          <div>
            <h4 className='text-white font-bold mb-8 uppercase tracking-[0.2em] text-lg font-heading'>OPERATIONS</h4>
            <ul className='space-y-4'>
              {details.map(item => (
                <li key={item.path}><Link href={item.path} replace className='text-[#8C8C8C] hover:text-primary transition-colors text-sm font-bold tracking-wider md:tracking-widest uppercase'>{item.text}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='text-white font-bold mb-8 uppercase tracking-[0.2em] text-lg font-heading'>NAVIGATION</h4>
            <ul className='space-y-4'>
              {navigation.map(item => (
                <li key={item.path}><Link href={item.path} className='text-[#8C8C8C] hover:text-primary transition-colors text-sm font-bold tracking-wider md:tracking-widest uppercase'>{item.text}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className='pt-10 border-t border-[#1f1f1f]'>
          <p className='text-center text-[10px] md:text-xs font-bold text-[#8C8C8C] uppercase tracking-[0.3em]'>
            BGMI Campus MVP is being run by partner agency <span className='text-primary font-black'>HYPEDIN</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
