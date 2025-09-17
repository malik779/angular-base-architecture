import { Injectable } from '@angular/core';

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenStoreService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly EXPIRES_AT_KEY = 'expires_at';
  private readonly TOKEN_TYPE_KEY = 'token_type';

  // In-memory storage for access token (more secure)
  private _accessToken: string | null = null;
  private _tokenType: string = 'Bearer';

  constructor() {
    // Load tokens from secure storage on service initialization
    this.loadTokensFromStorage();
  }

  setTokens(tokenData: TokenData): void {
    this._accessToken = tokenData.accessToken;
    this._tokenType = tokenData.tokenType || 'Bearer';

    // Store refresh token and metadata in localStorage
    if (tokenData.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refreshToken);
    }
    
    if (tokenData.expiresAt) {
      localStorage.setItem(this.EXPIRES_AT_KEY, tokenData.expiresAt.toString());
    }
    
    localStorage.setItem(this.TOKEN_TYPE_KEY, this._tokenType);
  }

  getAccessToken(): string | null {
    return this._accessToken;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getTokenType(): string {
    return this._tokenType;
  }

  getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `${this._tokenType} ${token}` : null;
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT_KEY);
    if (!expiresAt) {
      return true;
    }

    const expirationTime = parseInt(expiresAt, 10);
    const currentTime = Date.now();
    
    // Add 5 minute buffer to prevent edge cases
    return currentTime >= (expirationTime - 300000);
  }

  clearTokens(): void {
    this._accessToken = null;
    this._tokenType = 'Bearer';
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.EXPIRES_AT_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
  }

  hasValidToken(): boolean {
    return !!(this._accessToken && !this.isTokenExpired());
  }

  private loadTokensFromStorage(): void {
    // Only load token type and metadata from localStorage
    // Access token should be obtained from secure source (like HTTP-only cookie)
    const tokenType = localStorage.getItem(this.TOKEN_TYPE_KEY);
    if (tokenType) {
      this._tokenType = tokenType;
    }
  }

  // Method to set access token from secure source (e.g., HTTP-only cookie)
  setAccessTokenFromSecureSource(token: string): void {
    this._accessToken = token;
  }
}