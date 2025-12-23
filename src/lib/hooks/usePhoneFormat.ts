import { useState, useCallback } from 'react';

/**
 * Hook for formatting phone numbers as user types
 * Formats to: (XXX) XXX-XXXX
 */
export function usePhoneFormat() {
  const [value, setValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');

  const formatPhoneNumber = useCallback((input: string): string => {
    // Remove all non-digit characters
    const cleaned = input.replace(/\D/g, '');

    // Limit to 10 digits (US phone numbers)
    const limited = cleaned.slice(0, 10);

    // Format based on length
    if (limited.length === 0) {
      return '';
    }
    if (limited.length <= 3) {
      return `(${limited}`;
    }
    if (limited.length <= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    }
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const formatted = formatPhoneNumber(input);
      setDisplayValue(formatted);
      // Store the cleaned value for form submission
      setValue(input.replace(/\D/g, ''));
    },
    [formatPhoneNumber]
  );

  const handleBlur = useCallback(() => {
    // Ensure full format on blur if we have digits
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 10) {
      setDisplayValue(formatPhoneNumber(cleaned));
    }
  }, [value, formatPhoneNumber]);

  return {
    value, // Clean numeric value for form submission
    displayValue, // Formatted display value
    handleChange,
    handleBlur,
    setValue: (val: string) => {
      const cleaned = val.replace(/\D/g, '');
      setValue(cleaned);
      setDisplayValue(formatPhoneNumber(cleaned));
    },
  };
}


