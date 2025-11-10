import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

export interface SocialMediaPublishRequest {
  productId: string;
  platforms: ('facebook' | 'instagram' | 'whatsapp')[];
  message: string;
  imageUrls: string[];
  scheduledTime?: Date;
}

export interface SocialMediaPublishResult {
  success: boolean;
  platforms: {
    platform: string;
    success: boolean;
    postId?: string;
    postUrl?: string;
    errorMessage?: string;
  }[];
}

export interface AdCampaignRequest {
  productId: string;
  platform: 'facebook' | 'instagram';
  campaignName: string;
  budget: number;
  durationDays: number;
  targetAudience: string;
  adCopy: string;
}

export interface SocialMediaAnalytics {
  facebook: {
    totalPosts: number;
    totalReach: number;
    totalEngagement: number;
    totalClicks: number;
  };
  instagram: {
    totalPosts: number;
    totalReach: number;
    totalEngagement: number;
  };
  whatsapp: {
    totalMessagesSent: number;
    totalMessagesDelivered: number;
    totalMessagesRead: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.apiUrl = this.config.get('apiBaseUrl') + '/social';
  }

  publishToSocialMedia(request: SocialMediaPublishRequest): Observable<SocialMediaPublishResult> {
    return this.http.post<SocialMediaPublishResult>(`${this.apiUrl}/publish`, request);
  }

  createAdCampaign(request: AdCampaignRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/ads/create`, request);
  }

  syncToFacebookShops(productId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/facebook/shops/sync`, { productId });
  }

  sendWhatsAppMessage(phoneNumber: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/whatsapp/send`, { phoneNumber, message });
  }

  sendWhatsAppBroadcast(phoneNumbers: string[], message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/whatsapp/broadcast`, { phoneNumbers, message });
  }

  getAnalytics(startDate: Date, endDate: Date): Observable<SocialMediaAnalytics> {
    return this.http.get<SocialMediaAnalytics>(`${this.apiUrl}/analytics`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  connectFacebook(accessToken: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/facebook/connect`, { accessToken });
  }

  connectInstagram(accessToken: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/instagram/connect`, { accessToken });
  }

  connectWhatsApp(config: any): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/whatsapp/connect`, config);
  }
}
