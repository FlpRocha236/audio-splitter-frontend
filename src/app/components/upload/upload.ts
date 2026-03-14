import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';

type UploadMode = 'file' | 'youtube';

@Component({
  selector: 'app-upload',
  imports: [FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  @Output() uploaded = new EventEmitter<number>();

  mode = signal<UploadMode>('file');
  title = signal('');
  selectedFile = signal<File | null>(null);
  youtubeUrl = signal('');
  isDragging = signal(false);
  isLoading = signal(false);
  error = signal('');

  constructor(private audioService: AudioService) {}

  setMode(m: UploadMode) {
    this.mode.set(m);
    this.error.set('');
    this.selectedFile.set(null);
    this.youtubeUrl.set('');
    this.title.set('');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.setFile(file);
  }

  setFile(file: File) {
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/mp4'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(mp3|wav|flac|ogg|m4a)$/i)) {
      this.error.set('Formato não suportado. Use MP3, WAV, FLAC ou OGG.');
      return;
    }
    this.error.set('');
    this.selectedFile.set(file);
    if (!this.title()) {
      this.title.set(file.name.replace(/\.[^/.]+$/, ''));
    }
  }

  removeFile() {
    this.selectedFile.set(null);
    this.title.set('');
  }

  formatSize(bytes: number): string {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  isValidYoutubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  upload() {
    this.isLoading.set(true);
    this.error.set('');

    if (this.mode() === 'file') {
      const file = this.selectedFile();
      if (!file) { this.isLoading.set(false); return; }

      this.audioService.uploadAudio(file, this.title()).subscribe({
        next: (res) => { this.isLoading.set(false); this.uploaded.emit(res.separation_id); },
        error: () => { this.isLoading.set(false); this.error.set('Erro ao enviar o arquivo.'); }
      });

    } else {
      const url = this.youtubeUrl();
      if (!this.isValidYoutubeUrl(url)) {
        this.isLoading.set(false);
        this.error.set('URL do YouTube inválida.');
        return;
      }

      this.audioService.uploadYoutube(url, this.title()).subscribe({
        next: (res) => { this.isLoading.set(false); this.uploaded.emit(res.separation_id); },
        error: () => { this.isLoading.set(false); this.error.set('Erro ao processar link do YouTube.'); }
      });
    }
  }
}
