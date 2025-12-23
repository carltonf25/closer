import Mailchimp from '@mailchimp/mailchimp_transactional';

// Initialize Mailchimp Transactional client
const mailchimp = Mailchimp(process.env.MAILCHIMP_API_KEY || '');

export default mailchimp;
