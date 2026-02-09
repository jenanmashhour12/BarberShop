import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormArray
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService, Salon, Slot, Service} from '../../../../core/api.service';


type DOW =
  'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'|'Sunday';

@Component({
  selector: 'app-register-available-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-available.component.html',
  styleUrls: ['./register-available.component.scss']
})
export class RegisterAvailableBookingComponent implements OnInit {

  salons: Salon[] = [];
  submitting = false;
  message = '';

  
  days: DOW[] = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  form!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
 
  this.api.getSalons().subscribe((s: Salon[]) => {
    this.salons = s;
  });

  this.form = this.fb.group({
    salonId: [null, [Validators.required]],
    startTime: ['10:00', [Validators.required]],
    endTime:   ['18:00', [Validators.required]],
    durationMin: [30, [Validators.required, Validators.min(5), Validators.max(480)]],
    days: this.fb.array(this.days.map(() => false)) // 7 checkboxes
  });
}

  get f() { return this.form.controls; }
  get daysArray() { return this.form.get('days') as FormArray; }

  private toMinutes(t: string): number {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  }
  private toHHmm(m: number): string {
    const h = Math.floor(m / 60).toString().padStart(2, '0');
    const mm = (m % 60).toString().padStart(2, '0');
    return `${h}:${mm}`;
  }

  
  private buildSlots(): Array<Omit<Slot,'id'>> {
    const salonId = this.f['salonId'].value as number;
    const startMin = this.toMinutes(this.f['startTime'].value);
    const endMin   = this.toMinutes(this.f['endTime'].value);
    const duration = Number(this.f['durationMin'].value);

    
    const selectedDays: DOW[] = this.daysArray.value
      .map((checked: boolean, i: number) => (checked ? this.days[i] : null))
      .filter(Boolean);

    const out: Array<Omit<Slot,'id'>> = [];
    if (!salonId || selectedDays.length === 0) return out;
    if (endMin <= startMin || duration <= 0) return out;

    for (const day of selectedDays) {
      for (let t = startMin; t + duration <= endMin; t += duration) {
        const st = this.toHHmm(t);
        const et = this.toHHmm(t + duration);
        out.push({
          salonId,
          dayOfWeek: day,
          startTime: st,
          endTime: et,
          status: 'AVAILABLE'
        });
      }
    }
    return out;
  }

  submit(): void {
    this.message = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payloads = this.buildSlots();
    if (payloads.length === 0) {
      this.message = 'Nothing to create. Check times/days.';
      return;
    }

    this.submitting = true;
    forkJoin(payloads.map(p => this.api.createSlot(p))).subscribe({
      next: () => {
        this.submitting = false;
        this.message = `Created ${payloads.length} slots successfully.`;
      },
      error: (err) => {
        this.submitting = false;
        this.message = err?.error?.message || 'Failed to create slots.';
      }
    });

    
  }
}
