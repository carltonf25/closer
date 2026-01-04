'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  getBadLeadReports,
  approveRefund,
  rejectRefund,
} from '@/actions/admin-actions';

type BadLeadReport = {
  id: string;
  created_at: string;
  billed: boolean;
  billed_at: string | null;
  price: number;
  feedback: string | null;
  outcome: string;
  contractors: {
    id: string;
    company_name: string;
    email: string;
  };
  leads: {
    id: string;
    service_type: string;
    urgency: string;
    city: string;
    state: string;
  };
};

export default function RefundsPage() {
  const [reports, setReports] = useState<BadLeadReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await getBadLeadReports();
      setReports(data as BadLeadReport[]);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (deliveryId: string, feedback: string) => {
    setProcessingId(deliveryId);
    const result = await approveRefund({ deliveryId, reason: feedback });

    if (result.success) {
      await loadReports();
    } else {
      alert(result.message || 'Failed to approve refund');
    }
    setProcessingId(null);
  };

  const handleReject = async (deliveryId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setProcessingId(deliveryId);
    const result = await rejectRefund({ deliveryId, reason });

    if (result.success) {
      await loadReports();
    } else {
      alert(result.message || 'Failed to reject refund');
    }
    setProcessingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Bad Lead Reports - Refund Review
      </h1>

      {reports.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">No pending refund requests</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map(report => (
            <div
              key={report.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {report.contractors.company_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {report.contractors.email}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {report.leads.service_type} • {report.leads.city},{' '}
                    {report.leads.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${report.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {report.billed_at
                      ? new Date(report.billed_at).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">
                      Report Details
                    </p>
                    <p className="text-sm text-yellow-800">{report.feedback}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleReject(report.id)}
                  disabled={processingId === report.id}
                  className="px-4 py-2 text-red-700 font-semibold hover:bg-red-50 rounded-lg disabled:opacity-50"
                >
                  <XCircle className="inline h-5 w-5 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() =>
                    handleApprove(report.id, report.feedback || '')
                  }
                  disabled={processingId === report.id}
                  className="px-4 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 rounded-lg disabled:opacity-50"
                >
                  <CheckCircle className="inline h-5 w-5 mr-2" />
                  Approve Refund
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
