import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { AudioService, StatusResponse } from '../../services/audio.service';

@Component({
  selector: 'app-progress',
  imports: [],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit, OnDestroy {
  @Input() separationId!: number;
  @Output() completed = new EventEmitter<StatusResponse>();
  @Output() failed = new EventEmitter<void>();

  status = signal('PENDING');
  statusDisplay = signal('Aguardando...');
  dots = signal('');

  private pollSub?: Subscription;
  private dotInterval?: ReturnType<typeof setInterval>;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    // animação dos pontinhos
    this.dotInterval = setInterval(() => {
      this.dots.update(d => d.length >= 3 ? '' : d + '.');
    }, 500);

    // polling
    this.pollSub = this.audioService.pollStatus(this.separationId).subscribe({
      next: (res) => {
        this.status.set(res.status);
        this.statusDisplay.set(res.status_display);

        if (res.status === 'COMPLETED') {
          this.completed.emit(res);
        } else if (res.status === 'FAILED') {
          this.failed.emit();
        }
      },
      error: () => this.failed.emit()
    });
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
    if (this.dotInterval) clearInterval(this.dotInterval);
  }

  getStageLabel(): string {
    switch (this.status()) {
      case 'PENDING': return 'Na fila de processamento';
      case 'PROCESSING': return 'IA separando as faixas';
      case 'COMPLETED': return 'Concluído!';
      case 'FAILED': return 'Erro no processamento';
      default: return 'Aguardando...';
    }
  }
}
