'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { QuickLeadForm } from '@/components/forms/QuickLeadForm';

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      // and popup hasn't been shown yet
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Add delay before enabling exit intent (don't annoy immediate visitors)
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000); // Wait 5 seconds before activating

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={() => setIsVisible(false)}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⏰ Wait! Don't Leave Empty-Handed
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Get Your Free Quote in 60 Seconds
              </h2>
              <p className="text-gray-600 text-lg">
                Join 5,000+ Georgia homeowners who found trusted HVAC and plumbing
                pros through our service. No obligation, completely free.
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Same-Day Service</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>100% Free Quotes</span>
              </div>
            </div>

            {/* Form */}
            <QuickLeadForm />
          </div>
        </div>
      </div>
    </>
  );
}
