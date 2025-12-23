import Mailchimp from '@mailchimp/mailchimp_transactional';

// Lazy initialization to avoid issues with Next.js serverless environment
let mailchimpClient: ReturnType<typeof Mailchimp> | null = null;

function getMailchimpClient() {
  if (!mailchimpClient) {
    mailchimpClient = Mailchimp(process.env.MAILCHIMP_API_KEY || '');
  }
  return mailchimpClient;
}

export default getMailchimpClient;
