'use client';

import { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Calendar,
  Home,
  AlertCircle,
} from 'lucide-react';

type Lead = {
  id: string;
  created_at: string;
  service_type: string;
  urgency: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  description: string | null;
};

type LeadDelivery = {
  id: string;
  created_at: string;
  sent_at: string;
  viewed_at: string | null;
  responded_at: string | null;
  outcome: string;
  is_exclusive: boolean;
  price: number;
  lead: Lead;
};

type Props = {
  delivery: LeadDelivery;
  onUpdate: () => void;
};

const formatServiceType = (serviceType: string) => {
  return serviceType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatUrgency = (urgency: string) => {
  const urgencyMap: Record<string, { label: string; color: string }> = {
    emergency: { label: 'Emergency', color: 'text-red-600 bg-red-50' },
    today: { label: 'Today', color: 'text-orange-600 bg-orange-50' },
    this_week: { label: 'This Week', color: 'text-yellow-600 bg-yellow-50' },
    flexible: { label: 'Flexible', color: 'text-green-600 bg-green-50' },
  };
  return urgencyMap[urgency] || { label: urgency, color: 'text-gray-600' };
};

const getStatusBadge = (outcome: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'New', color: 'bg-blue-100 text-blue-800' },
    viewed: { label: 'Viewed', color: 'bg-yellow-100 text-yellow-800' },
    accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
    no_response: { label: 'No Response', color: 'bg-gray-100 text-gray-800' },
  };
  return statusMap[outcome] || { label: outcome, color: 'bg-gray-100' };
};

export const LeadCard = ({ delivery, onUpdate }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { lead } = delivery;

  if (!lead) {
    return null;
  }

  const urgencyInfo = formatUrgency(lead.urgency);
  const statusBadge = getStatusBadge(delivery.outcome);
  const timeAgo = new Date(delivery.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      {/* Card Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {lead.first_name} {lead.last_name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}
              >
                {statusBadge.label}
              </span>
              {delivery.is_exclusive && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  Exclusive
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Home className="h-4 w-4 mr-2" />
                {formatServiceType(lead.service_type)}
              </div>
              <div className="flex items-center">
                <Clock className={`h-4 w-4 mr-2 ${urgencyInfo.color}`} />
                <span className={urgencyInfo.color}>{urgencyInfo.label}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {lead.city}, {lead.state}
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {timeAgo}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Lead Price</div>
              <div className="text-xl font-bold text-gray-900">
                ${delivery.price.toFixed(2)}
              </div>
            </div>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
                {lead.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </div>
                )}
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <div>{lead.address}</div>
                    <div className="text-gray-600">
                      {lead.city}, {lead.state} {lead.zip}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Service Details
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Property Type:</span>{' '}
                  <span className="font-medium capitalize">
                    {lead.property_type}
                  </span>
                </div>
                {lead.description && (
                  <div>
                    <span className="text-gray-600">Description:</span>
                    <p className="mt-1 text-gray-700">{lead.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
            {delivery.outcome === 'pending' && (
              <>
                <button
                  type="button"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Accept Lead
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Reject
                </button>
              </>
            )}
            {delivery.outcome === 'accepted' && (
              <button
                type="button"
                className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition"
              >
                Mark as Contacted
              </button>
            )}
          </div>

          {delivery.outcome === 'pending' && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Respond quickly!</p>
                  <p>
                    {delivery.is_exclusive
                      ? "This is an exclusive lead - only you received it. The customer is waiting for your call."
                      : 'This lead was sent to multiple contractors. The first to respond usually wins the job.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
