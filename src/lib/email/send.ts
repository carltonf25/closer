import mailchimp from './client';
import {
  generateLeadConfirmationEmail,
  generateContractorAlertEmail,
  generateLeadAcceptedEmail,
} from './templates';

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send lead confirmation email to homeowner after form submission
 */
export async function sendLeadConfirmationEmail(data: {
  to: string;
  firstName: string;
  lastName: string;
  serviceType: string;
  city: string;
  state: string;
  urgency: string;
}): Promise<SendEmailResult> {
  try {
    const { html, text, subject } = generateLeadConfirmationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      serviceType: data.serviceType,
      city: data.city,
      state: data.state,
      urgency: data.urgency,
    });

    const response = await mailchimp.messages.send({
      message: {
        html,
        text,
        subject,
        from_email: process.env.MAILCHIMP_FROM_EMAIL || 'noreply@example.com',
        from_name: process.env.MAILCHIMP_FROM_NAME || 'Georgia Home Services',
        to: [
          {
            email: data.to,
            name: `${data.firstName} ${data.lastName}`,
            type: 'to',
          },
        ],
        track_opens: true,
        track_clicks: true,
        auto_text: false,
        inline_css: true,
      },
    });

    if (response && response[0]) {
      const result = response[0];
      if (result.status === 'sent' || result.status === 'queued') {
        return {
          success: true,
          // eslint-disable-next-line no-underscore-dangle
          messageId: result._id,
        };
      }
      if (result.status === 'rejected' || result.status === 'invalid') {
        return {
          success: false,
          error: `Email ${result.status}: ${result.reject_reason || 'Unknown reason'}`,
        };
      }
    }

    return {
      success: false,
      error: 'Unexpected response from Mailchimp',
    };
  } catch (error) {
    console.error('Error sending lead confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send new lead alert email to contractor
 */
export async function sendContractorAlertEmail(data: {
  to: string;
  contractorName: string;
  leadId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  serviceType: string;
  urgency: string;
  address?: string;
  city?: string;
  state: string;
  zip: string;
  description?: string;
}): Promise<SendEmailResult> {
  try {
    const { html, text, subject } = generateContractorAlertEmail({
      contractorName: data.contractorName,
      leadId: data.leadId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      serviceType: data.serviceType,
      urgency: data.urgency,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      description: data.description,
    });

    const response = await mailchimp.messages.send({
      message: {
        html,
        text,
        subject,
        from_email: process.env.MAILCHIMP_FROM_EMAIL || 'noreply@example.com',
        from_name: process.env.MAILCHIMP_FROM_NAME || 'Georgia Home Services',
        to: [
          {
            email: data.to,
            name: data.contractorName,
            type: 'to',
          },
        ],
        track_opens: true,
        track_clicks: true,
        auto_text: false,
        inline_css: true,
      },
    });

    if (response && response[0]) {
      const result = response[0];
      if (result.status === 'sent' || result.status === 'queued') {
        return {
          success: true,
          // eslint-disable-next-line no-underscore-dangle
          messageId: result._id,
        };
      }
      if (result.status === 'rejected' || result.status === 'invalid') {
        return {
          success: false,
          error: `Email ${result.status}: ${result.reject_reason || 'Unknown reason'}`,
        };
      }
    }

    return {
      success: false,
      error: 'Unexpected response from Mailchimp',
    };
  } catch (error) {
    console.error('Error sending contractor alert email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send lead accepted notification to homeowner
 */
export async function sendLeadAcceptedEmail(data: {
  to: string;
  homeownerName: string;
  contractorName: string;
  contractorPhone: string;
  contractorEmail: string;
  serviceType: string;
}): Promise<SendEmailResult> {
  try {
    const { html, text, subject } = generateLeadAcceptedEmail({
      homeownerName: data.homeownerName,
      contractorName: data.contractorName,
      contractorPhone: data.contractorPhone,
      contractorEmail: data.contractorEmail,
      serviceType: data.serviceType,
    });

    const response = await mailchimp.messages.send({
      message: {
        html,
        text,
        subject,
        from_email: process.env.MAILCHIMP_FROM_EMAIL || 'noreply@example.com',
        from_name: process.env.MAILCHIMP_FROM_NAME || 'Georgia Home Services',
        to: [
          {
            email: data.to,
            name: data.homeownerName,
            type: 'to',
          },
        ],
        track_opens: true,
        track_clicks: true,
        auto_text: false,
        inline_css: true,
      },
    });

    if (response && response[0]) {
      const result = response[0];
      if (result.status === 'sent' || result.status === 'queued') {
        return {
          success: true,
          // eslint-disable-next-line no-underscore-dangle
          messageId: result._id,
        };
      }
      if (result.status === 'rejected' || result.status === 'invalid') {
        return {
          success: false,
          error: `Email ${result.status}: ${result.reject_reason || 'Unknown reason'}`,
        };
      }
    }

    return {
      success: false,
      error: 'Unexpected response from Mailchimp',
    };
  } catch (error) {
    console.error('Error sending lead accepted email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
