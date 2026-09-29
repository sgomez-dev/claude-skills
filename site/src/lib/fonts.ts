import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google';

export const bricolage = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '800'], variable: '--font-bricolage', display: 'swap', preload: true });
export const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['italic'], variable: '--font-instrument', display: 'swap', preload: true });
export const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-jetbrains', display: 'swap', preload: true });
