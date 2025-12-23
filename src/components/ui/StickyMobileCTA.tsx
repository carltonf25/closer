'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { ScrollToTopButton } from './ScrollToTopButton';
import { cn } from '@/lib/utils';

export const StickyMobileCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="container-marketing py-3">
          <div className="flex items-center gap-3">
            {/* Call Button */}
            <a
              href="tel:+14045551234"
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>

            {/* Get Quotes Button */}
            <ScrollToTopButton className="flex-1 btn-primary">
              Get Free Quotes
            </ScrollToTopButton>
          </div>
        </div>
      </div>
    </div>
  );
};
