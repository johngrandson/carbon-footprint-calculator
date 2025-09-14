import * as React from 'react';
import { type Metadata } from 'next';
import Image, { type ImageProps } from 'next/image';

import { Button } from '@workspace/ui/components/button';

export const metadata: Metadata = {
  title: 'Sinai Carbon Footprint Calculator',
  description:
    'Calculate your personal carbon footprint and discover actionable ways to reduce your environmental impact.',
  keywords: [
    'carbon footprint',
    'environmental impact',
    'sustainability',
    'climate change',
    'calculator'
  ]
};

type Props = Omit<ImageProps, 'src'> & {
  src: string;
};

const ThemeImage = (props: Props) => {
  const { src, ...rest } = props;

  return (
    <>
      <Image
        {...rest}
        src={src}
        className="img"
      />
    </>
  );
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-4">
            <ThemeImage
              src="/sinai-logo.png"
              alt="Sinai logo"
              width={180}
              height={38}
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            How big is your environmental footprint?
          </h1>

          <p className="mx-auto mt-4 mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Our world is in crisis - from climate change to the pollution in our
            oceans and devastation of our forests. It's up to all of us to fix
            it. Take your first step with our environmental footprint
            calculator.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto uppercase"
              >
                Start Assessment
              </Button>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="w-full sm:w-auto uppercase"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
