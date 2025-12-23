/**
 * Email template generators for Mailchimp Transactional
 */

interface LeadConfirmationData {
  firstName: string;
  lastName: string;
  serviceType: string;
  urgency: string;
  city: string;
  state: string;
}

interface ContractorAlertData {
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
}

interface LeadAcceptedData {
  homeownerName: string;
  contractorName: string;
  contractorPhone: string;
  contractorEmail: string;
  serviceType: string;
}

/**
 * Email template: New lead confirmation to homeowner
 */
export const generateLeadConfirmationEmail = (
  data: LeadConfirmationData
): { subject: string; html: string; text: string } => {
  const subject = `Your ${data.serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Request Received`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .highlight { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
        .checkmark { color: #10b981; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 28px;">Request Received!</h1>
      </div>
      <div class="content">
        <p>Hi ${data.firstName},</p>

        <p>Thank you for choosing Georgia Home Services! We've received your request for <strong>${data.serviceType.replace(/_/g, ' ')}</strong> in ${data.city}, ${data.state}.</p>

        <div class="highlight">
          <p style="margin: 0;"><strong>What happens next:</strong></p>
          <p style="margin: 10px 0 0 0;"><span class="checkmark">✓</span> Licensed professionals in your area will review your request</p>
          <p style="margin: 5px 0 0 0;"><span class="checkmark">✓</span> You'll receive ${data.urgency === 'emergency' ? 'immediate' : '2-4'} free quotes within ${data.urgency === 'emergency' ? '1 hour' : '24 hours'}</p>
          <p style="margin: 5px 0 0 0;"><span class="checkmark">✓</span> Compare options and choose the best fit for you</p>
        </div>

        <p><strong>Your Request Details:</strong></p>
        <ul>
          <li>Service: ${data.serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
          <li>Location: ${data.city}, ${data.state}</li>
          <li>Urgency: ${data.urgency.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
        </ul>

        <p style="margin-top: 30px;">If you have any questions, feel free to call us at <strong>(404) 555-1234</strong>.</p>

        <p>Best regards,<br>
        <strong>Georgia Home Services Team</strong></p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Georgia Home Services. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 12px;">You're receiving this because you submitted a service request on our website.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Hi ${data.firstName},

Thank you for choosing Georgia Home Services! We've received your request for ${data.serviceType.replace(/_/g, ' ')} in ${data.city}, ${data.state}.

What happens next:
- Licensed professionals in your area will review your request
- You'll receive ${data.urgency === 'emergency' ? 'immediate' : '2-4'} free quotes within ${data.urgency === 'emergency' ? '1 hour' : '24 hours'}
- Compare options and choose the best fit for you

Your Request Details:
- Service: ${data.serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
- Location: ${data.city}, ${data.state}
- Urgency: ${data.urgency.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}

If you have any questions, feel free to call us at (404) 555-1234.

Best regards,
Georgia Home Services Team

---
© ${new Date().getFullYear()} Georgia Home Services. All rights reserved.
  `.trim();

  return { subject, html, text };
};

/**
 * Email template: New lead alert to contractor
 */
export const generateContractorAlertEmail = (
  data: ContractorAlertData
): { subject: string; html: string; text: string } => {
  const subject = `🔥 New Lead: ${data.serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} in ${data.city || data.zip}`;

  let urgencyBadge = '';
  if (data.urgency === 'emergency') {
    urgencyBadge =
      '<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">🚨 EMERGENCY</span>';
  } else if (data.urgency === 'today') {
    urgencyBadge =
      '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">⚡ TODAY</span>';
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
        .info-box { background: #f3f4f6; border: 1px solid #d1d5db; padding: 20px; margin: 20px 0; border-radius: 6px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-label { font-weight: 600; color: #6b7280; }
        .info-value { color: #111827; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 28px;">🔔 New Lead Available!</h1>
      </div>
      <div class="content">
        <p>Hi ${data.contractorName},</p>

        ${urgencyBadge ? `<div style="margin: 20px 0;">${urgencyBadge}</div>` : ''}

        <p><strong>A new customer is looking for ${data.serviceType.replace(/_/g, ' ')} services in your area!</strong></p>

        <div class="info-box">
          <h3 style="margin-top: 0;">Customer Information</h3>
          <div class="info-row">
            <span class="info-label">Name:</span>
            <span class="info-value">${data.firstName} ${data.lastName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phone:</span>
            <span class="info-value"><a href="tel:${data.phone}">${data.phone}</a></span>
          </div>
          ${
            data.email
              ? `<div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value"><a href="mailto:${data.email}">${data.email}</a></span>
          </div>`
              : ''
          }
          <div class="info-row">
            <span class="info-label">Service:</span>
            <span class="info-value">${data.serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Urgency:</span>
            <span class="info-value">${data.urgency.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </div>
          ${
            data.address
              ? `<div class="info-row">
            <span class="info-label">Address:</span>
            <span class="info-value">${data.address}</span>
          </div>`
              : ''
          }
          <div class="info-row">
            <span class="info-label">Location:</span>
            <span class="info-value">${data.city ? `${data.city}, ` : ''}${data.state} ${data.zip}</span>
          </div>
          ${
            data.description
              ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <strong>Details:</strong>
            <p style="margin: 10px 0 0 0;">${data.description}</p>
          </div>`
              : ''
          }
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="tel:${data.phone}" class="button">📞 Call ${data.firstName} Now</a>
        </div>

        <p style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
          <strong>⏰ Act fast!</strong> This lead is also being sent to other qualified contractors in the area. Contact the customer quickly to secure the job.
        </p>

        <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
          Lead ID: ${data.leadId}
        </p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Georgia Home Services</p>
        <p style="margin-top: 10px; font-size: 12px;">You're receiving this because you're a contractor in our network.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
🔔 NEW LEAD AVAILABLE!

Hi ${data.contractorName},

A new customer is looking for ${data.serviceType.replace(/_/g, ' ')} services in your area!

Customer Information:
- Name: ${data.firstName} ${data.lastName}
- Phone: ${data.phone}
${data.email ? `- Email: ${data.email}` : ''}
- Service: ${data.serviceType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
- Urgency: ${data.urgency.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
${data.address ? `- Address: ${data.address}` : ''}
- Location: ${data.city ? `${data.city}, ` : ''}${data.state} ${data.zip}
${data.description ? `\nDetails:\n${data.description}` : ''}

⏰ ACT FAST! This lead is also being sent to other qualified contractors in the area.
Contact the customer quickly to secure the job.

Call ${data.firstName}: ${data.phone}

Lead ID: ${data.leadId}

---
© ${new Date().getFullYear()} Georgia Home Services
  `.trim();

  return { subject, html, text };
};

/**
 * Email template: Lead accepted notification to homeowner
 */
export const generateLeadAcceptedEmail = (
  data: LeadAcceptedData
): { subject: string; html: string; text: string } => {
  const subject = `✅ ${data.contractorName} is Ready to Help!`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-radius: 0 0 8px 8px; }
        .contractor-box { background: #ecfdf5; border: 2px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 28px;">✅ Great News!</h1>
      </div>
      <div class="content">
        <p>Hi ${data.homeownerName},</p>

        <p><strong>${data.contractorName}</strong> has accepted your request and is ready to help with your ${data.serviceType.replace(/_/g, ' ')} needs!</p>

        <div class="contractor-box">
          <h2 style="margin-top: 0; color: #059669;">${data.contractorName}</h2>
          <p style="margin: 15px 0;">
            <a href="tel:${data.contractorPhone}" class="button">📞 ${data.contractorPhone}</a>
            <a href="mailto:${data.contractorEmail}" class="button">✉️ ${data.contractorEmail}</a>
          </p>
        </div>

        <p><strong>What's next:</strong></p>
        <ul>
          <li>${data.contractorName} will contact you shortly to discuss your needs</li>
          <li>They'll schedule a convenient time for service or provide a quote</li>
          <li>Feel free to reach out to them directly using the contact info above</li>
        </ul>

        <p style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <strong>💡 Tip:</strong> Have any questions ready about the service, timeline, and pricing when you speak with ${data.contractorName}.
        </p>

        <p>Thank you for using Georgia Home Services!</p>

        <p>Best regards,<br>
        <strong>Georgia Home Services Team</strong></p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Georgia Home Services. All rights reserved.</p>
        <p style="margin-top: 10px; font-size: 12px;">Need help? Call us at (404) 555-1234</p>
      </div>
    </body>
    </html>
  `;

  const text = `
✅ GREAT NEWS!

Hi ${data.homeownerName},

${data.contractorName} has accepted your request and is ready to help with your ${data.serviceType.replace(/_/g, ' ')} needs!

Contractor Contact:
${data.contractorName}
Phone: ${data.contractorPhone}
Email: ${data.contractorEmail}

What's next:
- ${data.contractorName} will contact you shortly to discuss your needs
- They'll schedule a convenient time for service or provide a quote
- Feel free to reach out to them directly using the contact info above

💡 Tip: Have any questions ready about the service, timeline, and pricing when you speak with ${data.contractorName}.

Thank you for using Georgia Home Services!

Best regards,
Georgia Home Services Team

---
© ${new Date().getFullYear()} Georgia Home Services. All rights reserved.
Need help? Call us at (404) 555-1234
  `.trim();

  return { subject, html, text };
};
