import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-upload',
  imports: [FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  @Output() uploaded = new EventEmitter<number>();

  title = signal('');
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);
  isLoading = signal(false);
  error = signal('');

  constructor(private audioService: AudioService) {}

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

  upload() {
    const file = this.selectedFile();
    if (!file) return;

    this.isLoading.set(true);
    this.error.set('');

    this.audioService.uploadAudio(file, this.title()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.uploaded.emit(res.separation_id);
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Erro ao enviar o arquivo. Verifique a conexão com o servidor.');
      }
    });
  }
}
