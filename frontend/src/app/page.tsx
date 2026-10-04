import { Navbar } from '../components/layout/navbar';
import { Hero } from '../components/sections/hero';
import { PhraseMarquee } from '../components/sections/phrase-marquee';
import { Overview } from '../components/sections/overView';
import { WhyJoin } from '../components/sections/why-join';
import { Role } from '../components/sections/role';
import { Missions } from '../components/sections/missions';
import { RankLadder } from '../components/sections/rank-ladder';
import { Perks } from '../components/sections/perks';
import { Cta } from '../components/sections/cta';
import { Footer } from '../components/layout/footer';
import BackgroundMusic from '@/components/ui/backgroundMusic';

export default function Home() {
	return (
		<main className="flex flex-col min-h-screen">
			<Navbar />
			<Hero />
			<BackgroundMusic/>
			<PhraseMarquee />
			<div id="program">
				<Overview />
			</div>
			<div id="why-join">
				<WhyJoin />
			</div>
			<div id="role">
				<Role />
			</div>
			<div id="missions">
				<Missions />
			</div>
			<div id="ranks">
				<RankLadder />
			</div>
			<div id="perks">
				<Perks />
			</div>
			<Cta />
			<Footer />
		</main>
	);
}