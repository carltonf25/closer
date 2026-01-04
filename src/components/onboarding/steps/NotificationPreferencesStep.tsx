'use client';

import { useState, useEffect } from 'react';
import { usePhoneFormat } from '@/lib/hooks/usePhoneFormat';
import { Mail, Phone, Bell } from 'lucide-react';

type Props = {
  email: string;
  phone: string;
  onUpdate: (data: {
    notification_email: string;
    notification_phone: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
};

export const NotificationPreferencesStep = ({
  email,
  phone,
  onUpdate,
  onNext,
  onBack,
}: Props) => {
  const [notificationEmail, setNotificationEmail] = useState(email);
  const phoneFormat = usePhoneFormat();
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});

  // Initialize phone value
  useEffect(() => {
    if (phone) {
      phoneFormat.setValue(phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  const handleNext = () => {
    // Validate
    const newErrors: { email?: string; phone?: string } = {};

    if (!notificationEmail || !notificationEmail.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanPhone = phoneFormat.value || '';
    if (!cleanPhone || cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update parent
    onUpdate({
      notification_email: notificationEmail,
      notification_phone: cleanPhone,
    });

    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Notification Preferences
        </h2>
        <p className="text-gray-600">
          Where should we send you notifications when new leads arrive? You can
          update these settings later.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
        <Bell className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">
            Instant Lead Notifications
          </h4>
          <p className="text-sm text-blue-800">
            Get notified immediately when a new lead matching your service area
            arrives. The faster you respond, the better your chances of winning
            the job.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="notification_email"
            className="flex items-center text-sm font-medium text-gray-700 mb-2"
          >
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            Notification Email
          </label>
          <input
            type="email"
            id="notification_email"
            value={notificationEmail}
            onChange={e => {
              setNotificationEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            We&apos;ll send lead alerts and important updates to this email
          </p>
        </div>

        <div>
          <label
            htmlFor="notification_phone"
            className="flex items-center text-sm font-medium text-gray-700 mb-2"
          >
            <Phone className="h-4 w-4 mr-2 text-gray-500" />
            Notification Phone Number
          </label>
          <input
            type="tel"
            id="notification_phone"
            value={phoneFormat.displayValue}
            onChange={e => {
              phoneFormat.handleChange(e);
              setErrors(prev => ({ ...prev, phone: undefined }));
            }}
            onBlur={phoneFormat.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="(555) 555-5555"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            For Pro and Elite tiers, we&apos;ll send SMS alerts for urgent leads
          </p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Why fast response matters
        </h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Most homeowners contact multiple contractors</li>
          <li>• The first to respond often wins the job</li>
          <li>• Shared leads are sent to 2-3 contractors simultaneously</li>
          <li>• Quick response = higher conversion rate</li>
        </ul>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
