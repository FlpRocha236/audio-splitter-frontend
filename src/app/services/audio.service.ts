import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile, tap } from 'rxjs';

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
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // POST /api/upload/ — envia o arquivo de áudio
  uploadAudio(file: File, title: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('original_audio', file);
    formData.append('title', title || file.name.replace(/\.[^/.]+$/, ''));
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload/`, formData);
  }

  uploadYoutube(youtubeUrl: string, title: string): Observable<UploadResponse> {
  return this.http.post<UploadResponse>(`${this.apiUrl}/upload/youtube/`, {
    youtube_url: youtubeUrl,
    title: title || ''
  });
}

  // GET /api/status/{id}/ — verifica o status do processamento
  checkStatus(separationId: number): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/status/${separationId}/`);
  }

  // Polling automático a cada 5 segundos até COMPLETED ou FAILED
  pollStatus(separationId: number): Observable<StatusResponse> {
    return interval(5000).pipe(
      switchMap(() => this.checkStatus(separationId)),
      takeWhile(
        (res) => res.status !== 'COMPLETED' && res.status !== 'FAILED',
        true // emite o último valor (COMPLETED ou FAILED) antes de parar
      )
    );
  }

  // POST /api/mix/{id}/ — baixa o mix com as faixas selecionadas
  downloadMix(separationId: number, tracks: string[]): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/mix/${separationId}/`,
      { tracks },
      { responseType: 'blob' }
    );
  }
}


