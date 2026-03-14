import { Component, signal } from '@angular/core';
import { UploadComponent } from './components/upload/upload';
import { ProgressComponent } from './components/progress/progress';
import { StemsComponent } from './components/stems/stems';
import { StatusResponse } from './services/audio.service';

type AppState = 'upload' | 'processing' | 'completed' | 'failed';

@Component({
  selector: 'app-root',
  imports: [UploadComponent, ProgressComponent, StemsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  state = signal<AppState>('upload');
  separationId = signal<number | null>(null);
  statusData = signal<StatusResponse | null>(null);

  onUploaded(id: number) {
    this.separationId.set(id);
    this.state.set('processing');
  }

  onCompleted(data: StatusResponse) {
    this.statusData.set(data);
    this.state.set('completed');
  }

  onFailed() {
    this.state.set('failed');
  }

  reset() {
    this.state.set('upload');
    this.separationId.set(null);
    this.statusData.set(null);
  }
}
