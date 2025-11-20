export interface WorkImage {
	src: string;
	alt: string;
	type: 'image' | 'video';
}

export interface WorkCase {
	id: string;
	company: string;
	companyLogo?: string; // Optional: if present, show logo instead of text
	logoSize?: number; // Optional: max-height in pixels for the logo (default: 60)
	companyDescription: string;
	projectDescription: string;
	role?: string;
	year?: string;
	images: WorkImage[];
	imageLayout: '1+1+1' | '1+2' | '1.5+1.5' | '2+1' | '1';
	link?: string; // Optional: link to view more
	inlineImages?: { src: string; alt: string }[]; // Optional: images to display within description
	tweetUrl?: string; // Optional: Twitter/X tweet URL to embed
}

export const workCases: WorkCase[] = [
	{
		id: 'summer-health',
		company: 'Summer Health',
		companyLogo: '/images/cases/logo_summerhealth.svg',
		logoSize: 50,
		companyDescription: '24/7 pediatric care via messaging, 2022 - Present',
		projectDescription:
			'Parents shouldn\'t have to panic-search symptoms at 2am or wait days to get answers about a sick kid. That was the problem to solve.\n\nI joined as the founding designer and now lead the design team. I\'ve shaped everything from the warm, human brand to the core messaging, medical records flow, design system, and all ongoing product work.\n\nThe goal has always been the same: turn "should I be worried?" into a calm, instant conversation with a real pediatrician.',
		images: [
			{ src: '/images/cases/case_summerhealth_1.png', alt: 'Summer Health app', type: 'image' },
			{ src: '/images/cases/case_summerhealth_2.png', alt: 'Summer Health interface', type: 'image' },
			{ src: '/images/cases/case_summerhealth_3.png', alt: 'Summer Health features', type: 'image' }
		],
		imageLayout: '1+1+1'
	},
	{
		id: 'loom',
		company: 'Loom',
		companyLogo: '/images/cases/logo_loom.svg',
		logoSize: 30,
		companyDescription: 'Async video messaging platform, 2023',
		projectDescription:
			'Their design system, Lens, had grown messy and hard to maintain. Designers were spending more time fighting the system than shipping work.\n\nOver a 10-week contract, I rebuilt it from the ground up: refreshed the foundations (color, type), reorganized components with proper variables, created reusable patterns and templates, and documented everything clearly in Loom. The result was a system the team could actually rely on—faster, consistent, and far easier to use.',
		images: [
			{ src: '/images/cases/case_loom.png', alt: 'Loom design system', type: 'image' }
		],
		imageLayout: '1'
	},
	{
		id: 'forward-operators',
		company: 'Forward Operators',
		companyDescription: 'AI consulting helping businesses figure out where AI actually fits, 2023',
		projectDescription:
			'ChatGPT showed the tech was powerful, but the experience was just a blank text box. The challenge was to show what happens when you actually design around the AI instead of simply exposing it.\n\nI defined the UX and visual principles that turned a plain prompt into something that feels alive. The interface stayed minimal, while motion (in collaboration with animator <a href="https://www.hannaedghill.com" target="_blank" rel="noopener noreferrer">Hanna Edghill</a>) gave it personality. And the whole thing was designed to work naturally for both voice and text.',
		images: [
			{ src: '/images/cases/case_forwardoperators_1.gif', alt: 'Forward Operators interface', type: 'image' },
			{ src: '/images/cases/case_forwardoperators_2.gif', alt: 'Forward Operators interaction', type: 'image' },
			{ src: '/images/cases/case_forwardoperators_3.gif', alt: 'Forward Operators voice interface', type: 'image' }
		],
		imageLayout: '1+1+1'
	},
	{
		id: 'titan',
		company: 'TITAN',
		companyLogo: '/images/cases/logo_titan.svg',
		logoSize: 30,
		companyDescription: 'Space experimentation platform for businesses, 2021-2022',
		projectDescription:
			'The challenge was simple to state but hard to solve: make running experiments in space feel as straightforward as running them on Earth.\n\nDesigning tools that actually work in orbit comes with a new set of challenges—limited bandwidth, unusual environments, and interfaces that need to hold up far from Earth.\n\nAs Head of User Experience, I led the work on a design system that made those constraints feel simple, turning complex space operations into something customers could confidently use on the ground and in orbit. (Details are limited due to NDA.)',
		inlineImages: [
			{ src: '/images/cases/case_titan_3.webp', alt: 'TITAN in space' }
		],
		images: [
			{ src: '/images/cases/case_titan_1.webp', alt: 'TITAN platform', type: 'image' },
			{ src: '/images/cases/case_titan_2.gif', alt: 'TITAN interface', type: 'image' }
		],
		imageLayout: '1+2'
	},
	{
		id: 'zakka',
		company: 'Żabka',
		companyLogo: '/images/cases/logo_zabka.svg',
		logoSize: 60,
		companyDescription: 'Polish convenience store chain (7,000+ locations) expanding to home delivery, 2020-2021',
		projectDescription:
			'Online grocery shopping should feel as quick and natural as grabbing chips off the shelf. That was the challenge.\n\nOver nine months with Ueno, I led the product design work: mapped every flow, designed the full shopping experience, and built a comprehensive design system ready for handoff. The project didn\'t launch, but the foundation was solid and complete.',
		images: [
			{ src: '/images/cases/case-zabka-1.webm', alt: 'Żabka app interface', type: 'video' },
			{ src: '/images/cases/case-zabka-2.webm', alt: 'Żabka shopping experience', type: 'video' },
			{ src: '/images/cases/case-zabka-3.webm', alt: 'Żabka checkout flow', type: 'video' }
		],
		imageLayout: '1+1+1'
	},
	{
		id: 'personalized',
		company: 'Herman Miller',
		companyLogo: '/images/cases/logo_hermanmiller.svg',
		logoSize: 60,
		companyDescription: 'Office furniture and workspace solutions, 2019-2020',
		projectDescription:
			'Office layouts were already failing before the pandemic. Teams needed spaces that supported focus, collaboration, and hybrid work—but most companies didn\'t know where to start. That was the challenge.\n\nAs Design Director at SuperFriendly, I led the strategy and built a tool that asked companies about their work patterns and turned those answers into tailored office recommendations. It launched successfully… and then the pandemic arrived and changed everything overnight.',
		images: [
			{ src: '/images/cases/case_hermanmiller_1.webm', alt: 'Herman Miller workspace tool', type: 'video' },
			{ src: '/images/cases/case_hermanmiller_2.webm', alt: 'Herman Miller office recommendations', type: 'video' }
		],
		imageLayout: '1.5+1.5'
	},
	{
		id: 'chassi',
		company: 'Toast',
		companyLogo: '/images/cases/logo_toast.svg',
		logoSize: 40,
		companyDescription: 'Point-of-sale system for restaurants and cafes, 2019',
		projectDescription:
			'Restaurants don\'t want marketing—they want useful ideas. Toast needed a way to drive traffic and email signups through content that felt genuinely helpful, not promotional.\n\nWorking with SuperFriendly, I helped build an online publication from the ground up: researched what operators actually cared about, created a design system to keep everything consistent, and shaped the UX so readers could quickly get to the content they needed. The result beat Toast\'s goals for both traffic and signups.',
		images: [
			{ src: '/images/cases/case_toast_1.webm', alt: 'Toast publication', type: 'video' },
			{ src: '/images/cases/case_toast_2.webp', alt: 'Toast content system', type: 'image' }
		],
		imageLayout: '1.5+1.5'
	}
];

export const clientLogos = [
	{ name: 'Google', logo: '/images/logos/google.svg' },
	{ name: 'Loom', logo: '/images/logos/loom.svg' },
	{ name: 'Intercom', logo: '/images/logos/intercom.svg' },
	{ name: 'Spotify', logo: '/images/logos/spotify.svg' },
	{ name: 'Teamtailor', logo: '/images/logos/teamtailor.svg' },
	{ name: 'IKEA', logo: '/images/logos/ikea.svg' },
	{ name: 'UNRVLD', logo: '/images/logos/unrvld.svg' },
	{ name: 'Nintendo', logo: '/images/logos/nintendo.svg' },
	{ name: 'Herman Miller', logo: '/images/logos/herman-miller.svg' },
	{ name: 'Mantle', logo: '/images/logos/mantle.svg' },
	{ name: 'Livit', logo: '/images/logos/livit.svg' },
	{ name: 'LIFVS', logo: '/images/logos/lifvs.svg' },
	{ name: 'Volvo', logo: '/images/logos/volvo.svg' },
	{ name: 'Soundtrap', logo: '/images/logos/soundtrap.svg' },
	{ name: 'ASUS', logo: '/images/logos/asus.svg' }
];
