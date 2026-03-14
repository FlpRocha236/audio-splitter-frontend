import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { StatusResponse } from '../../services/audio.service';
import { MixerComponent } from '../mixer/mixer';

@Component({
  selector: 'app-stems',
  imports: [MixerComponent],
  templateUrl: './stems.component.html',
  styleUrl: './stems.component.scss'
})
export class StemsComponent {
  @Input() statusData!: StatusResponse;
  @Output() reset = new EventEmitter<void>();

  showMixer = signal(false);

  stems = [
    { key: 'vocals', label: 'Voz',     icon: '♪', color: '#e8c76a' },
    { key: 'drums',  label: 'Bateria',  icon: '◉', color: '#5de0c5' },
    { key: 'bass',   label: 'Baixo',    icon: '◈', color: '#7f9cf5' },
    { key: 'guitar', label: 'Guitarra', icon: '⌇', color: '#e87060' },
    { key: 'piano',  label: 'Piano',    icon: '⊞', color: '#c084fc' },
    { key: 'other',  label: 'Outros',   icon: '◎', color: '#94a3b8' },
  ];

  getStemUrl(key: string): string {
    return (this.statusData.stems as any)?.[key] || '';
  }
}
