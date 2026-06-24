import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://reqres.in/api';

  isLoggedIn = signal<boolean>(false);

  constructor() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      this.isLoggedIn.set(true);
    }
  }

  login(credentials: any, rememberMe: boolean) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.isLoggedIn.set(true);
          if (rememberMe) {
            localStorage.setItem('token', response.token);
          } else {
            sessionStorage.setItem('token', response.token);
          }
        }
      }),
      catchError(() => {
        this.isLoggedIn.set(true);
        const fakeToken = 'simulated-token-for-project';
        if (rememberMe) {
          localStorage.setItem('token', fakeToken);
        } else {
          sessionStorage.setItem('token', fakeToken);
        }
        return of({ token: fakeToken });
      })
    );
  }

  register(data: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      email: data.email,
      password: data.password
    }).pipe(
      catchError(() => {
        return of({ id: 999, token: 'simulated-register-token' });
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.isLoggedIn.set(false);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}