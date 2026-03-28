import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';

import { environment } from 'src/environments/environment';
import { wsPermissions } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtPayload: any;
  clientId = environment.clientId;
  oauthUrl = environment.oauthUrl;
  authProxyUrl = environment.authProxyUrl;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.loadToken();
  }

  public async logout(): Promise<any> {
    try {
      const headers = this.formHeaders();
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        this.login();
        return Promise.resolve();
      }

      const payload = new HttpParams().append('token', refreshToken);

      await this.http.post<any>(`${this.authProxyUrl}/revoke`, payload, { headers }).toPromise();

      this.cleanAccessToken();
      this.login();
    } catch (err) {
      console.log('Error when performing logout.', err);
      return Promise.reject();
    }
  }

  public login() {
    const state = this.generateRandomString(40);
    const codeVerifier = this.generateRandomString(128);

    localStorage.setItem('state', state);
    localStorage.setItem('codeVerifier', codeVerifier);

    const codeChallenge = CryptoJS.SHA256(codeVerifier)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const redirectURI = encodeURIComponent(environment.oauthCallbackUrl);

    const scope = 'READ WRITE';
    const responseType = 'code';
    const challengeMethod = 'S256';

    const params = [
      'state=' + state,
      'scope=' + scope,
      'client_id=' + this.clientId,
      'redirect_uri=' + redirectURI,
      'response_type=' + responseType,
      'code_challenge=' + codeChallenge,
      'code_challenge_method=' + challengeMethod,
    ];
    window.location.href = `${this.oauthUrl}/authorize?${params.join('&')}`;
  }

  public async getNewAccessTokenWithCode(code: string, state: string): Promise<any> {
    const currentState = localStorage.getItem('state');

    if (currentState !== state) {
      return Promise.resolve();
    }

    const codeVerifier = localStorage.getItem('codeVerifier')!;

    const payload = new HttpParams()
      .append('code', code)
      .append('state', state)
      .append('code_verifier', codeVerifier)
      .append('grant_type', 'authorization_code')
      .append('redirect_uri', environment.oauthCallbackUrl);

    const headers = this.formHeaders();

    try {
      const res = await this.http.post<any>(`${this.authProxyUrl}/token`, payload, { headers }).toPromise();
      this.storeToken(res['access_token']);
      this.storeRefreshToken(res['refresh_token']);

      localStorage.removeItem('state');
      localStorage.removeItem('codeVerifier');
      return await Promise.resolve();
    } catch (res) {
      console.error('Error generating token with code.', res);
      return await Promise.reject();
    }
  }

  public async renewAccessToken(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) return Promise.resolve();

      const payload = new HttpParams()
        .append('client_id', this.clientId)
        .append('grant_type', 'refresh_token')
        .append('refresh_token', refreshToken);

      const headers = this.formHeaders();

      const res = await this.http.post<any>(`${this.authProxyUrl}/token`, payload, { headers }).toPromise();
      this.storeToken(res['access_token']);
      this.storeRefreshToken(res['refresh_token']);
    } catch (err) {
      console.log('Error renewing token.', err);
      this.login();
      return Promise.reject();
    }
  }

  public getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  public cleanAccessToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('state');
    localStorage.removeItem('codeVerifier');
    localStorage.removeItem('refresh_token');
    this.jwtPayload = null;
  }

  public isAccessTokenInvalid() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  public youHavePermission(permission: string) {
    const authorities = this.jwtPayload?.authorities;
    if (authorities) {
      return (this.jwtPayload && authorities.includes(wsPermissions.ROLE_MASTER)) || authorities.includes(permission);
    }
    return false;
  }

  public hasAnyPermission(roles: string[]) {
    for (const role of roles) {
      if (this.youHavePermission(role)) {
        return true;
      }
    }
    return false;
  }

  private formHeaders() {
    return new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
  }

  private storeToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private storeRefreshToken(refreshToken: string) {
    localStorage.setItem('refresh_token', refreshToken);
  }

  private loadToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.storeToken(token);
    }
  }

  private generateRandomString(size: number) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < size; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
