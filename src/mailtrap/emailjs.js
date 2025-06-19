
  

import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { MailtrapClients, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const res = await MailtrapClients.send({
      from: sender,
      to: recipient,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });
    console.log(res);
  } catch (error) {
    console.log("error while sending email", error);
    throw new Error("email verification failed");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    await MailtrapClients.send({
      from: sender,
      to: recipient,
      template_uuid: "8c04a8f6-0054-4885-8fad-050842659e2e",
      template_variables: {
        company_info_name: "learning platform",
        name,
        company_info_address: "Lagos Nigeria",
        company_info_city: "Lagos",
        company_info_zip_code: "1000102",
        company_info_country: "Nigeria",
      },
    });
  } catch (error) {
    console.log("error");
  }
};

export const sendForgottenPasswordEmail = async (email, resetToken) => {
  const recipient = [{ email }];

  try {
    const res = await MailtrapClients.send({
      from: sender,
      to: recipient,
      subject: "reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetToken),
      category: "password reset",
    });
    console.log(res, "ok");
  } catch (error) {
    console.log("error while sending email", error);
    throw new Error("email verification failed");
  }
};

export const sendResetPasswordSuccess = async (email) => {
  const recipient = [{ email }];

  try {
    const res = await MailtrapClients.send({
      from: sender,
      to: recipient,
      subject: "Password Reset successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "password reset",
    });
    console.log(res, "ok");
  } catch (error) {
    console.log("error while sending email", error);
    throw new Error("email verification failed");
  }
};