import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Configure email transporter
// Using Gmail or your email service credentials
// Make sure to set EMAIL_USER and EMAIL_PASSWORD in .env
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

export const sendInvoiceEmail = async (
  customerEmail,
  job,
  payment,
  invoicePath,
) => {
  try {
    // Read the PDF file
    const invoiceBuffer = fs.readFileSync(invoicePath);

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@automend.com",
      to: customerEmail,
      subject: `AutoMend Invoice #${payment._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Service is Complete!</h2>
          <p>Dear ${job.customerId.name},</p>
          <p>Thank you for choosing AutoMend! Your vehicle repair service has been completed. Please find your invoice attached.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Invoice Summary</h3>
            <p><strong>Invoice Number:</strong> ${payment._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Service Date:</strong> ${new Date(payment.createdAt).toLocaleDateString("en-IN")}</p>
            <p><strong>Total Amount:</strong> <span style="font-size: 18px; color: #2c3e50; font-weight: bold;">₹${job.totalCost.toFixed(2)}</span></p>
          </div>

          <div style="margin: 20px 0;">
            <h3>Next Steps:</h3>
            <ol>
              <li>Review the attached invoice for detailed breakdown</li>
              <li>Proceed to payment using your preferred payment method</li>
              <li>You will receive a payment confirmation email once completed</li>
            </ol>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
            If you have any questions about your invoice or service, please contact us immediately.
            <br/>
            <strong>AutoMend Support</strong>
            <br/>
            Email: support@automend.com | Phone: +91-XXXX-XXXX-XX
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice_${payment._id}.pdf`,
          content: invoiceBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Invoice email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    // Don't throw - log and continue so bill submission isn't blocked by email failure
    throw error;
  }
};

export const sendPaymentConfirmationEmail = async (
  customerEmail,
  job,
  payment,
) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@automend.com",
      to: customerEmail,
      subject: `AutoMend Payment Confirmed - Invoice #${payment._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">Payment Received Successfully!</h2>
          <p>Dear ${job.customerId.name},</p>
          <p>Your payment has been processed and confirmed.</p>
          
          <div style="background-color: #ecf8f0; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #27ae60;">
            <h3 style="margin-top: 0; color: #27ae60;">Payment Details</h3>
            <p><strong>Invoice Number:</strong> ${payment._id.toString().slice(-8).toUpperCase()}</p>
            <p><strong>Amount Paid:</strong> <span style="font-size: 18px; color: #27ae60; font-weight: bold;">₹${payment.amount.toFixed(2)}</span></p>
            <p><strong>Payment Date:</strong> ${new Date(payment.paidAt || new Date()).toLocaleDateString("en-IN")}</p>
            <p><strong>Status:</strong> <span style="color: #27ae60; font-weight: bold;">Completed</span></p>
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
            Thank you for trusting AutoMend with your vehicle!
            <br/>
            <strong>AutoMend Support</strong>
            <br/>
            Email: support@automend.com | Phone: +91-XXXX-XXXX-XX
          </p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(
      "Payment confirmation email sent successfully:",
      result.messageId,
    );
    return result;
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    throw error;
  }
};
