/**
 * Free OTP Service Implementation
 * Supports both SMS and Email verification with clear separation
 */

interface OTPResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface OTPVerification {
  contact: string;
  otp: string;
  timestamp: number;
  attempts: number;
  method: 'sms' | 'email';
}

// In-memory storage for demo (use Redis/database in production)
const otpStorage = new Map<string, OTPVerification>();

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP with expiration (5 minutes)
 */
export function storeOTP(contact: string, otp: string, method: 'sms' | 'email'): void {
  otpStorage.set(contact, {
    contact,
    otp,
    timestamp: Date.now(),
    attempts: 0,
    method
  });
  
  console.log(`🔐 OTP stored for ${contact}: ${otp} (${method})`);
  
  // Auto-cleanup after 5 minutes
  setTimeout(() => {
    otpStorage.delete(contact);
    console.log(`🗑️ OTP expired and removed for ${contact}`);
  }, 5 * 60 * 1000);
}

/**
 * Verify OTP
 */
export function verifyOTP(contact: string, inputOtp: string): { success: boolean; error?: string; method?: 'sms' | 'email' } {
  console.log(`🔍 Verifying OTP for ${contact}: ${inputOtp}`);
  
  const stored = otpStorage.get(contact);
  
  if (!stored) {
    console.log(`❌ No OTP found for ${contact}`);
    return { success: false, error: 'Verification code expired or not found' };
  }
  
  console.log(`📋 Stored OTP: ${stored.otp}, Input: ${inputOtp}, Attempts: ${stored.attempts}`);
  
  // Check if expired (5 minutes)
  if (Date.now() - stored.timestamp > 5 * 60 * 1000) {
    otpStorage.delete(contact);
    console.log(`⏰ OTP expired for ${contact}`);
    return { success: false, error: 'Verification code expired' };
  }
  
  // Check attempts (max 3)
  if (stored.attempts >= 3) {
    otpStorage.delete(contact);
    console.log(`🚫 Too many attempts for ${contact}`);
    return { success: false, error: 'Too many attempts. Please request a new code.' };
  }
  
  // Increment attempts
  stored.attempts++;
  
  if (stored.otp === inputOtp) {
    const method = stored.method;
    otpStorage.delete(contact);
    console.log(`✅ OTP verified successfully for ${contact}`);
    return { success: true, method };
  }
  
  console.log(`❌ Invalid OTP for ${contact}. Attempts: ${stored.attempts}`);
  return { success: false, error: 'Invalid verification code' };
}

/**
 * Free SMS Service: TextBelt (1 SMS per day per IP)
 */
export async function sendSMSTextBelt(phone: string, message: string): Promise<OTPResponse> {
  try {
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        message: message,
        key: 'textbelt', // Free key
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { success: true, message: 'SMS sent successfully via TextBelt' };
    } else {
      return { success: false, error: data.error || 'Failed to send SMS via TextBelt' };
    }
  } catch (error) {
    return { success: false, error: 'Network error sending SMS' };
  }
}

/**
 * Fallback SMS Service: Console Log (for development)
 */
export async function sendSMSConsole(phone: string, message: string): Promise<OTPResponse> {
  console.log(`📱 SMS to ${phone}: ${message}`);
  
  // For development, also show in alert
  if (typeof window !== 'undefined') {
    alert(`📱 SMS Demo\n\nTo: ${phone}\nMessage: ${message}\n\n(In production, this would be sent via SMS service)`);
  }
  
  return { success: true, message: 'SMS logged to console (development mode)' };
}

/**
 * Main SMS sending function with fallbacks
 */
export async function sendOTPSMS(phone: string): Promise<OTPResponse> {
  const otp = generateOTP();
  const message = `Your AgriConnect verification code is: ${otp}. Valid for 5 minutes.`;
  
  // Store OTP with SMS method
  storeOTP(phone, otp, 'sms');
  
  // Try services in order of preference
  const services = [
    () => sendSMSTextBelt(phone, message),
    () => sendSMSConsole(phone, message), // Fallback for development
  ];
  
  for (const service of services) {
    try {
      const result = await service();
      if (result.success) {
        return result;
      }
      console.warn('SMS service failed:', result.error);
    } catch (error) {
      console.warn('SMS service error:', error);
    }
  }
  
  return { success: false, error: 'SMS service unavailable. Please try email verification.' };
}

/**
 * Custom Email OTP (NOT using Supabase magic links)
 */
export async function sendOTPEmail(email: string): Promise<OTPResponse> {
  const otp = generateOTP();
  
  // Store OTP with email method
  storeOTP(email, otp, 'email');
  
  try {
    // For development, we'll use console/alert
    // In production, you'd use a proper email service like SendGrid, Mailgun, etc.
    console.log(`📧 Email to ${email}: Your AgriConnect verification code is ${otp}`);
    
    if (typeof window !== 'undefined') {
      alert(`📧 Email Demo\n\nTo: ${email}\nSubject: Your AgriConnect Verification Code\n\nYour verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\n(In production, this would be sent via email service)`);
    }
    
    return { 
      success: true, 
      message: 'Email verification code sent (check console/alert for demo)' 
    };
  } catch (error) {
    return { success: false, error: 'Failed to send email verification code' };
  }
}

/**
 * Production Email Service (using SendGrid as example)
 */
export async function sendEmailViaSendGrid(email: string, otp: string): Promise<OTPResponse> {
  try {
    // This would be your actual SendGrid implementation
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: email }],
          subject: 'Your AgriConnect Verification Code',
        }],
        from: { email: 'noreply@agriconnect.com' },
        content: [{
          type: 'text/html',
          value: `
            <h2>Your AgriConnect Verification Code</h2>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          `,
        }],
      }),
    });

    if (response.ok) {
      return { success: true, message: 'Email sent successfully via SendGrid' };
    } else {
      return { success: false, error: 'Failed to send email via SendGrid' };
    }
  } catch (error) {
    return { success: false, error: 'SendGrid service error' };
  }
}

/**
 * Production Email Service (using Mailgun as example)
 */
export async function sendEmailViaMailgun(email: string, otp: string): Promise<OTPResponse> {
  try {
    const formData = new FormData();
    formData.append('from', 'AgriConnect <noreply@agriconnect.com>');
    formData.append('to', email);
    formData.append('subject', 'Your AgriConnect Verification Code');
    formData.append('html', `
      <h2>Your AgriConnect Verification Code</h2>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
    `);

    const response = await fetch(`https://api.mailgun.net/v3/${process.env.EXPO_PUBLIC_MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`api:${process.env.EXPO_PUBLIC_MAILGUN_API_KEY}`)}`,
      },
      body: formData,
    });

    if (response.ok) {
      return { success: true, message: 'Email sent successfully via Mailgun' };
    } else {
      return { success: false, error: 'Failed to send email via Mailgun' };
    }
  } catch (error) {
    return { success: false, error: 'Mailgun service error' };
  }
}