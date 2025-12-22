/**
 * Analytics utility for form tracking
 * Supports PostHog and Mixpanel (or can be extended for other providers)
 */

type AnalyticsProvider = 'posthog' | 'mixpanel' | 'none';

interface FormEvent {
  event: string;
  properties?: Record<string, unknown>;
}

// Detect which analytics provider is available
function getProvider(): AnalyticsProvider {
  if (typeof window === 'undefined') return 'none';

  if (window.posthog) {
    return 'posthog';
  }
  if (window.mixpanel) {
    return 'mixpanel';
  }
  return 'none';
}

// Track a form event
export function trackFormEvent(event: FormEvent): void {
  if (typeof window === 'undefined') return;

  const provider = getProvider();
  const { event: eventName, properties = {} } = event;

  switch (provider) {
    case 'posthog':
      window.posthog?.capture(eventName, properties);
      break;
    case 'mixpanel':
      window.mixpanel?.track(eventName, properties);
      break;
    case 'none':
      // Fallback: log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', eventName, properties);
      }
      break;
    default:
      // Type safety - should never reach here
      break;
  }
}

// Track form view
export function trackFormView(formType: 'quick' | 'full', page?: string): void {
  trackFormEvent({
    event: 'form_viewed',
    properties: {
      form_type: formType,
      page_url:
        page || (typeof window !== 'undefined' ? window.location.href : ''),
      timestamp: new Date().toISOString(),
    },
  });
}

// Track form start (user begins filling)
export function trackFormStart(formType: 'quick' | 'full'): void {
  trackFormEvent({
    event: 'form_started',
    properties: {
      form_type: formType,
    },
  });
}

// Track form step (for multi-step forms)
export function trackFormStep(step: number, formType: 'quick' | 'full'): void {
  trackFormEvent({
    event: 'form_step',
    properties: {
      form_type: formType,
      step,
    },
  });
}

// Track form submission
export function trackFormSubmit(
  formType: 'quick' | 'full',
  success: boolean,
  errors?: Record<string, string[]>
): void {
  trackFormEvent({
    event: success ? 'form_submitted' : 'form_submission_failed',
    properties: {
      form_type: formType,
      success,
      error_count: errors ? Object.keys(errors).length : 0,
      errors: errors || {},
    },
  });
}

// Track form field interaction
export function trackFieldInteraction(
  fieldName: string,
  formType: 'quick' | 'full'
): void {
  trackFormEvent({
    event: 'form_field_interaction',
    properties: {
      form_type: formType,
      field_name: fieldName,
    },
  });
}

// Type declarations for analytics providers
declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
    mixpanel?: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}
