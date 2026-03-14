import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { AudioService } from '../../services/audio.service';

@Component({
  selector: 'app-mixer',
  imports: [],
  templateUrl: './mixer.component.html',
  styleUrl: './mixer.component.scss'
})
export class MixerComponent {
  @Input() separationId!: number;
  @Input() stems: { key: string; label: string; icon: string; color: string }[] = [];
  @Output() close = new EventEmitter<void>();

  selectedTracks = signal<Set<string>>(new Set(['vocals', 'drums', 'bass', 'guitar']));
  isDownloading = signal(false);
  error = signal('');

  constructor(private audioService: AudioService) {}

  toggleTrack(key: string) {
    const current = new Set(this.selectedTracks());
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    this.selectedTracks.set(current);
  }

  isSelected(key: string): boolean {
    return this.selectedTracks().has(key);
  }

  download() {
    const tracks = Array.from(this.selectedTracks());
    if (tracks.length === 0) {
      this.error.set('Selecione pelo menos uma faixa.');
      return;
    }

    this.isDownloading.set(true);
    this.error.set('');

    this.audioService.downloadMix(this.separationId, tracks).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mix_custom_${this.separationId}.mp3`;
        a.click();
        URL.revokeObjectURL(url);
        this.isDownloading.set(false);
      },
      error: () => {
        this.error.set('Erro ao gerar o mix. Tente novamente.');
        this.isDownloading.set(false);
      }
    });
  }
}
