// Google Maps type declarations
declare global {
  interface Window {
    google?: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: {
              componentRestrictions?: { country?: string };
              fields?: string[];
              types?: string[];
            }
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => {
              address_components?: Array<{
                long_name: string;
                short_name: string;
                types: string[];
              }>;
              formatted_address?: string;
            };
          };
        };
      };
    };
  }
}

export {};


