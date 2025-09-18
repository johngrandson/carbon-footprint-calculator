import { type Metadata } from 'next';
import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';
import { Homepage } from '@workspace/ui/components/homepage';

const SITE_CONFIG = {
  title: 'Sinai Carbon Footprint Calculator',
  description: 'Calculate your personal carbon footprint and discover actionable ways to reduce your environmental impact.',
  keywords: [
    'carbon footprint',
    'environmental impact',
    'sustainability',
    'climate change',
    'calculator'
  ],
  logo: {
    src: '/sinai-logo.png',
    alt: 'Sinai logo',
    width: 120,
    height: 25,
  }
} as const;

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords]
};

type LogoImageProps = Omit<ImageProps, 'src'> & {
  src: string;
};

const LogoImage = ({ src, ...rest }: LogoImageProps) => (
  <Image {...rest} src={src} className="img" />
);

export default function HomePage(): React.JSX.Element {
  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      {/* 3D Earth Background */}
      <Homepage className="absolute inset-0 z-0" />

      {/* Simple overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-white/10 dark:bg-gray-100/10" />

      {/* Header with Logo */}
      <header className="relative z-20 mt-10 flex-shrink-0">
        <div className="flex justify-center">
          <LogoImage
            src={SITE_CONFIG.logo.src}
            alt={SITE_CONFIG.logo.alt}
            width={SITE_CONFIG.logo.width}
            height={SITE_CONFIG.logo.height}
            priority
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 flex-1 flex items-center justify-center px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How big is your environmental footprint?
          </h1>

          <p className="mx-auto mt-4 mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Our world is in crisis - from climate change to the pollution in our
            oceans and devastation of our forests. It's up to all of us to fix
            it. Take your first step with our environmental footprint
            calculator.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/quiz">
              <Button
                size="lg"
                className="w-full sm:w-auto"
              >
                Start Assessment
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
