'use client';

import { Filter } from 'lucide-react';

type Filters = {
  status: string;
  service_type: string;
  date_range: string;
};

type Props = {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
};

export const LeadFilters = ({ filters, onFilterChange }: Props) => {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">New</option>
            <option value="viewed">Viewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="no_response">No Response</option>
          </select>
        </div>

        {/* Service Type Filter */}
        <div>
          <label
            htmlFor="service_type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Service Type
          </label>
          <select
            id="service_type"
            value={filters.service_type}
            onChange={(e) => updateFilter('service_type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Services</option>
            <option value="hvac_repair">HVAC Repair</option>
            <option value="hvac_install">HVAC Install</option>
            <option value="hvac_maintenance">HVAC Maintenance</option>
            <option value="plumbing_emergency">Plumbing Emergency</option>
            <option value="plumbing_repair">Plumbing Repair</option>
            <option value="plumbing_install">Plumbing Install</option>
            <option value="water_heater">Water Heater</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label
            htmlFor="date_range"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date Range
          </label>
          <select
            id="date_range"
            value={filters.date_range}
            onChange={(e) => updateFilter('date_range', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>
    </div>
  );
};
