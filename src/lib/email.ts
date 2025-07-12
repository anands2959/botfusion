import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

// Generate a random 6-digit OTP code
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Save OTP to database
export async function saveOTP(userId: string, code: string) {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 10); // OTP expires in 10 minutes

  // Check if OTP already exists for this user
  const existingOTP = await prisma.otpCode.findUnique({
    where: { userId },
  });

  if (existingOTP) {
    // Update existing OTP
    return prisma.otpCode.update({
      where: { userId },
      data: {
        code,
        expires: expiryTime,
      },
    });
  } else {
    // Create new OTP
    return prisma.otpCode.create({
      data: {
        userId,
        code,
        expires: expiryTime,
      },
    });
  }
}

// Verify OTP code
export async function verifyOTP(userId: string, code: string): Promise<boolean> {
  const otpRecord = await prisma.otpCode.findUnique({
    where: { userId },
  });

  if (!otpRecord) {
    return false;
  }

  // Check if OTP is expired
  if (otpRecord.expires < new Date()) {
    return false;
  }

  // Check if OTP matches
  return otpRecord.code === code;
}

// Send verification email with OTP
export async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email for BotFusion',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Verify your email for BotFusion</h2>
        <p>Thank you for signing up! Please use the following verification code to complete your registration:</p>
        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this email, you can safely ignore it.</p>
        <p>Thanks,<br>The BotFusion Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Send password reset email with OTP
export async function sendPasswordResetEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your BotFusion password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Reset your BotFusion password</h2>
        <p>We received a request to reset your password. Please use the following verification code to continue with the password reset process:</p>
        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <h1 style="font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this password reset, you can safely ignore this email. Your account is still secure.</p>
        <p>Thanks,<br>The BotFusion Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Send contact form email
export async function sendContactFormEmail(name: string, email: string, subject: string, message: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.CONTACT_EMAIL || process.env.EMAIL_FROM, // Send to contact email or fall back to sender email
    replyTo: email, // Set reply-to as the sender's email
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p>This message was sent from the BotFusion contact form.</p>
      </div>
    `,
  };

  console.log('Sending contact form email with options:', {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject
  });
  
  return transporter.sendMail(mailOptions);
}