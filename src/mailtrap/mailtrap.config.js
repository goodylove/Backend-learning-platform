import  { MailtrapClient } from "mailtrap"


export const MailtrapClients = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY,
  endpoint: process.env.MAILTRAP_ENDPOINT   
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "learning platform",
};
