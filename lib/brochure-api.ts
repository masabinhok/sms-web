import { getApiUrl } from './env';
import { logError } from './logger';

const API_BASE_URL = getApiUrl();

export interface ScheduleVisitData {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  numberOfVisitors?: number;
  message?: string;
}

export interface ScheduleVisitResponse {
  message: string;
  success: boolean;
  visitId?: string;
}

/**
 * Schedule a campus visit
 * Public endpoint - no authentication required
 */
export async function scheduleVisit(
  data: ScheduleVisitData
): Promise<ScheduleVisitResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/schedule-visit`, {
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
    logError(error, 'Schedule visit');
    throw error;
  }
}

/**
 * Request brochure download
 * Tracks download requests for analytics
 */
export async function requestBrochureDownload(
  email: string,
  name?: string
): Promise<{ success: boolean; downloadUrl: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/brochure-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      throw new Error('Failed to process brochure request');
    }

    return response.json();
  } catch (error) {
    logError(error, 'Request brochure download');
    throw error;
  }
}

/**
 * Direct download of school brochure
 * Returns the PDF file path
 */
export function getBrochureDownloadUrl(): string {
  // For template: return placeholder PDF
  // For real deployment: return actual brochure URL from CDN/static files
  return '/downloads/school-brochure.pdf';
}

/**
 * NOTE: This is a template implementation.
 * For a real school setup:
 * 
 * Schedule Visit:
 * - Backend endpoint '/public/schedule-visit' stores visit requests
 * - Sends confirmation email to visitor
 * - Notifies school admin with visit details
 * - Integrates with school calendar system
 * 
 * Brochure Download:
 * - Create a professional PDF brochure with school information
 * - Host it on CDN or in /public/downloads/ folder
 * - Track downloads for analytics
 * - Email brochure link to requesters
 */
