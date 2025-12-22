'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AddressComponents {
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (components: AddressComponents) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const AddressAutocomplete = ({
  id,
  name,
  value,
  onChange,
  onSelect,
  placeholder = '123 Main Street',
  required,
  className,
  error,
  ...rest
}: AddressAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  // Load Google Places API if key is available
  useEffect(() => {
    if (!apiKey || typeof window === 'undefined') return;

    // Check if script already loaded
    if (window.google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }

    const scriptId = 'google-places-autocomplete';
    if (document.getElementById(scriptId)) {
      // Script is loading, wait for it
      const checkGoogle = setInterval(() => {
        if (window.google?.maps?.places) {
          setIsGoogleLoaded(true);
          clearInterval(checkGoogle);
        }
      }, 100);
      return () => clearInterval(checkGoogle);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    document.head.appendChild(script);
  }, [apiKey]);

  // Initialize autocomplete when Google is loaded
  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current || !apiKey) return;
    if (autocompleteRef.current) return; // Already initialized

    try {
      if (!window.google?.maps?.places) return;
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'formatted_address'],
          types: ['address'],
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.address_components || !onSelect) return;

        const components: AddressComponents = {
          address: place.formatted_address || value,
          city: '',
          state: '',
          zip: '',
        };

        // Parse address components
        place.address_components.forEach(component => {
          const componentTypes = component.types;
          if (componentTypes.includes('locality')) {
            components.city = component.long_name;
          } else if (componentTypes.includes('administrative_area_level_1')) {
            components.state = component.short_name;
          } else if (componentTypes.includes('postal_code')) {
            components.zip = component.long_name;
          }
        });

        // Update the input value
        if (inputRef.current) {
          inputRef.current.value = components.address;
          // Trigger onChange event
          const syntheticEvent = {
            target: { value: components.address },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(syntheticEvent);
        }

        onSelect(components);
      });

      autocompleteRef.current = autocomplete;
    } catch (err) {
      console.warn('Google Places Autocomplete initialization failed:', err);
    }
  }, [isGoogleLoaded, apiKey, value, onChange, onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={cn('input', error && 'input-error', className)}
      autoComplete="street-address"
      {...rest}
    />
  );
};
