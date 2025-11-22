import { getApiUrl } from './env';
import { logError } from './logger';

const API_BASE_URL = getApiUrl();

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResponse {
  message: string;
  success: boolean;
  inquiryId?: string;
}

/**
 * Submit contact form inquiry
 * Public endpoint - no authentication required
 */
export async function submitContactInquiry(
  data: ContactFormData
): Promise<ContactSubmissionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/contact-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Failed with status ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    logError(error, 'Submit contact inquiry');
    throw error;
  }
}

/**
 * NOTE: This is a template implementation.
 * For a real school setup, the backend API endpoint '/public/contact-inquiry' 
 * needs to be implemented to:
 * - Store inquiries in the database
 * - Send email notifications to administrators
 * - Send confirmation email to the inquirer
 * - Track inquiry status and follow-ups
 */
