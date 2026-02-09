import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ApiService, DaySlot } from '../../core/api.service';

/* ================= TYPES ================= */

interface Reservation {
  id: number;
  customerName: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed';
  chair: 'Chair 1' | 'Chair 2';
}

@Component({
  selector: 'app-moving-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moving-window.component.html',
  styleUrls: ['./moving-window.component.scss']
})
export class MovingWindowComponent implements OnInit, OnDestroy {

  /* ================= CONFIG ================= */

  salonId = 1;
  selectedDate = this.today();

  loading = false;
  error = '';

  /* ================= DATA ================= */

  reservations: Reservation[] = [];
  chair1Reservations: Reservation[] = [];
  chair2Reservations: Reservation[] = [];

  pollSub!: Subscription;

  /* ================= UI STATE ================= */

  quickAddOpen = false;
  editOpen = false;

  quickAddChair: 'Chair 1' | 'Chair 2' = 'Chair 1';
  quickAddIndex = 0;

  quickAddForm = {
    customerName: '',
    startLocal: '',
    endLocal: ''
  };

  editForm = {
    customerName: '',
    startLocal: '',
    endLocal: ''
  };

  allowedMinLocal: string | null = null;
  allowedMaxLocal: string | null = null;

  /* ================= VIEW ================= */

  @ViewChild('carousel') carousel!: ElementRef<HTMLElement>;
  @ViewChild('carousel2') carousel2!: ElementRef<HTMLElement>;

  constructor(private api: ApiService) {}

  /* ================= LIFECYCLE ================= */

  ngOnInit() {
    this.load();
    this.pollSub = interval(30000).subscribe(() => this.load());
  }

  ngOnDestroy() {
    this.pollSub?.unsubscribe();
  }

  /* ================= LOAD ================= */

  load() {
    this.loading = true;
    this.error = '';

    this.api.getSlots(this.salonId, this.selectedDate).subscribe({
      next: (slots: DaySlot[]) => {
        const mapped = this.mapSlots(slots);

        this.chair1Reservations = mapped.filter(r => r.chair === 'Chair 1');
        this.chair2Reservations = mapped.filter(r => r.chair === 'Chair 2');
        this.reservations = mapped;

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load reservations';
        this.loading = false;
      }
    });
  }

  /* ================= MAP BACKEND → UI ================= */

  private mapSlots(slots: DaySlot[]): Reservation[] {
    return slots
      .filter(s => s.status === 'BOOKED' && s.bookingId)
      .map((s, index) => ({
        id: s.bookingId!,
        customerName: s.customerName ?? 'Unknown',
        startTime: `${this.selectedDate}T${s.startTime}`,
        endTime: `${this.selectedDate}T${s.endTime}`,
        status: 'active',
        // مؤقت لحد ما نربط الكراسي من الباك
        chair: index % 2 === 0 ? 'Chair 1' : 'Chair 2'
      }));
  }

  /* ================= QUICK ADD ================= */

  openQuickAdd(chair: 'Chair 1' | 'Chair 2', index: number) {
    this.quickAddChair = chair;
    this.quickAddIndex = index;
    this.quickAddOpen = true;
  }

  closeQuickAdd() {
    this.quickAddOpen = false;
  }

  submitQuickAdd() {
    // placeholder
    this.closeQuickAdd();
  }

  /* ================= EDIT ================= */

  openEdit(_res: Reservation, _chair: 'Chair 1' | 'Chair 2', _index: number) {
    this.editOpen = true;
  }

  closeEdit() {
    this.editOpen = false;
  }

  saveEdit() {
    // placeholder
    this.closeEdit();
  }

  /* ================= UI HELPERS ================= */

  getTimeRange(r: Reservation): string {
    return `${this.hhmm(new Date(r.startTime))} - ${this.hhmm(new Date(r.endTime))}`;
  }

  getProgress(res: Reservation): number {
    const now = Date.now();
    const start = new Date(res.startTime).getTime();
    const end = new Date(res.endTime).getTime();

    if (now <= start) return 0;
    if (now >= end) return 100;
    return ((now - start) / (end - start)) * 100;
  }

  isActiveInChair(res: Reservation, list: Reservation[]): boolean {
    if (list.length === 0) return false;
    return list[0].id === res.id;
  }

  /* ================= SCROLL ================= */

  scrollLeft() {
    this.carousel?.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel?.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft2() {
    this.carousel2?.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight2() {
    this.carousel2?.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  /* ================= DATE HELPERS ================= */

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

  private hhmm(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
