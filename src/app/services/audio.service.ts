import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';

export interface UploadResponse {
  success: boolean;
  separation_id: number;
  title: string;
  status: string;
  status_display: string;
}

export interface StatusResponse {
  separation_id: number;
  title: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  status_display: string;
  stems?: {
    vocals: string;
    drums: string;
    bass: string;
    guitar: string;
    piano: string;
    other: string;
  };
  error_message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  // Ajuste: Removida a barra daqui para evitar duplicidade, 
  // mas garantindo que o caminho final SEMPRE tenha a barra.
  private apiUrl = 'https://audioproject-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  // POST /api/upload/
  uploadAudio(file: File, title: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('original_audio', file);
    formData.append('title', title || file.name.replace(/\.[^/.]+$/, ''));
    // Garanta a barra no final: /upload/
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/`, formData);
  }

  // POST /api/upload/youtube/
  uploadYoutube(youtubeUrl: string, title: string): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/youtube/`, {
      youtube_url: youtubeUrl,
      title: title || ''
    });
  }

  // GET /api/status/{id}/
  checkStatus(separationId: number): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/status/${separationId}/`);
  }

  // Polling automático
  pollStatus(separationId: number): Observable<StatusResponse> {
    return interval(5000).pipe(
      switchMap(() => this.checkStatus(separationId)),
      takeWhile(
        (res) => res.status !== 'COMPLETED' && res.status !== 'FAILED',
        true
      )
    );
  }

  // POST /api/mix/{id}/
  downloadMix(separationId: number, tracks: string[]): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/mix/${separationId}/`,
      { tracks },
      { responseType: 'blob' }
    );
  }
}
