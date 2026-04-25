import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: number;
  email: string;
  enabled: boolean | null;
  registrationNumber?: string | null;
  role?: { id: number; name: string } | null;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly base = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getPendingUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.base}/admin/pending`);
  }

  approveUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.base}/admin/approve/${id}`, {});
  }
}
