import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl = 'https://interminable-louisa-disjointedly.ngrok-free.dev/api';

  // 🔑 A CARTEIRADA DO NGROK (Pula a tela de bloqueio)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'ngrok-skip-browser-warning': 'true' // Isso diz pro Ngrok não enviar a tela de HTML
    });
  }

  constructor(private http: HttpClient) {}

  uploadAudio(file: File, title: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('original_audio', file);
    formData.append('title', title || file.name.replace(/\.[^/.]+$/, ''));
    
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/`, formData, {
      headers: this.getHeaders()
    });
  }

  uploadYoutube(youtubeUrl: string, title: string): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/youtube/`, {
      youtube_url: youtubeUrl,
      title: title || ''
    }, {
      headers: this.getHeaders()
    });
  }

  checkStatus(separationId: number): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/status/${separationId}/`, {
      headers: this.getHeaders()
    });
  }

  pollStatus(separationId: number): Observable<StatusResponse> {
    return interval(5000).pipe(
      switchMap(() => this.checkStatus(separationId)),
      takeWhile(
        (res) => res.status !== 'COMPLETED' && res.status !== 'FAILED',
        true
      )
    );
  }

  downloadMix(separationId: number, tracks: string[]): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/mix/${separationId}/`,
      { tracks },
      { 
        responseType: 'blob',
        headers: this.getHeaders()
      }
    );
  }
}
