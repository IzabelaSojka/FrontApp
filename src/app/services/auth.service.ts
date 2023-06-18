import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';
import {JwtHelperService} from '@auth0/angular-jwt';
//const jwt = require('jsonwebtoken');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7022/api/';
  private userPayload:any;

  constructor(
    private http: HttpClient,
    private router: Router
    ) { 
      this.userPayload = this.decodeToken();
    }

  login(credentials: any) {
    return this.http.post<LoginResponse>(`/api/login`, credentials);
  }

  register(user: any) {
    return this.http.post(`/api/register`, user);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggIn(): boolean{
    return !!localStorage.getItem('token');
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue);
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken');
  }

  decodeToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelper.decodeToken(token);
  }

  getEmailaddressFromToken(){
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      const emailAddress = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      console.log('Adres e-mail:', emailAddress);
      return emailAddress;
    }
    return null;
  }

  getNameIdentifierFromToken(){
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      const nameIdentifier = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      console.log('NameIdentifier: ', nameIdentifier);
      return nameIdentifier;
    }
    return null;
  }

  getRoleFromToken(){
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      const roleUser = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('Role: ', roleUser);
      return roleUser;
    }
    return null;
  }
}

export interface LoginResponse{
  accessToken: string;
  refreshToken: string;
}

export interface TokenDecode{
  role: number;
  emailaddress: string;
  nameidentifier: number;
}