import type { Metadata } from "next";
import localFont from "next/font/local";
import { Chakra_Petch, Teko } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import Providers from '@/app/providers';
import { Atmosphere } from '@/components/layout/atmosphere';
import "./globals.css";

const krafton = localFont({
	src: "./fonts/krafton-headline.ttf",
	variable: "--font-heading",
	display: "swap",
	declarations: [{ prop: "size-adjust", value: "82%" }],
});

const chakra = Chakra_Petch({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

const teko = Teko({
	variable: "--font-teko",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
	title: {
		default: "BGMI Campus MVP — Official Campus Ambassador Program",
		template: "%s | BGMI Campus MVP",
	},
	description:
		"Become the official face of BGMI on your campus. Host tournaments, build your community, and climb from Bronze to Conqueror.",
	icons: { icon: "/bgmi-logo.webp" },
	openGraph: {
		title: "BGMI Campus MVP — Official Campus Ambassador Program",
		description:
			"Become the official face of BGMI on your campus. Host tournaments, build your community, and climb from Bronze to Conqueror.",
		siteName: "BGMI Campus MVP",
		type: "website",
		locale: "en_IN",
		images: [{ url: "/squad-lineup.webp", width: 1200, height: 630, alt: "BGMI Campus MVP" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "BGMI Campus MVP — Official Campus Ambassador Program",
		description: "Become the official face of BGMI on your campus.",
		images: ["/squad-lineup.webp"],
	},
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
	return (
    	<html lang="en" className="dark">
      		<body className={`${krafton.variable} ${chakra.variable} ${teko.variable} font-body antialiased selection:bg-primary/30 selection:text-primary`}>
        		<Atmosphere />
        		<Providers>
          			<Toaster position="top-right"
            		toastOptions={{
            		  	className: 'font-body border border-[#1f1f1f] bg-[#090907] text-white rounded-none',
            		  	style: {
            		  		background: '#090907',
            		  		color: '#fff',
            		  		border: '1px solid #1f1f1f',
            		  		borderRadius: '0px',
            		  	},
            		  	success: {
            		  		duration: 5000,
            		  		iconTheme: {
            		  			primary: '#F59E0B',
            		  			secondary: '#000',
            		  		},
            		  	},
            		  	error: {
            		  	  	duration: 6000,
            		  	  	iconTheme: {
            		  	    	primary: '#EF4444',
            		  	    	secondary: '#000',
            		  	  	},
            		  	},
            		}}/>
          			{ children }
        		</Providers>
      		</body>
    	</html>
  	);
}
