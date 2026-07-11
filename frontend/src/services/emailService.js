import emailjs from "@emailjs/browser";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function validateEmailJsConfig() {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS is not configured. Check the frontend environment variables.",
    );
  }
}

export async function sendContactEmail({ name, email, subject, message }) {
  validateEmailJsConfig();

  const templateParams = {
    from_name: name.trim(),
    from_email: email.trim(),
    subject: subject.trim() || "New portfolio contact request",
    message: message.trim(),
    reply_to: email.trim(),
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
    });

    return response;
  } catch (error) {
    console.error("EmailJS failed to send the contact message:", error);

    throw new Error(
      "Your message could not be sent right now. Please try again.",
    );
  }
}
