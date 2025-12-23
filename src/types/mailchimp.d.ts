declare module '@mailchimp/mailchimp_transactional' {
  interface MessageRecipient {
    email: string;
    name?: string;
    type: 'to' | 'cc' | 'bcc';
  }

  interface Message {
    html?: string;
    text?: string;
    subject: string;
    from_email: string;
    from_name?: string;
    to: MessageRecipient[];
    track_opens?: boolean;
    track_clicks?: boolean;
    auto_text?: boolean;
    inline_css?: boolean;
  }

  interface SendMessageRequest {
    message: Message;
  }

  interface SendMessageResponse {
    email: string;
    status: 'sent' | 'queued' | 'rejected' | 'invalid';
    reject_reason?: string;
    _id: string;
  }

  interface MessagesApi {
    send(request: SendMessageRequest): Promise<SendMessageResponse[]>;
  }

  interface MailchimpClient {
    messages: MessagesApi;
  }

  function Mailchimp(apiKey: string): MailchimpClient;

  export = Mailchimp;
}
