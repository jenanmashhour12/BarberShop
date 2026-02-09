// src/app/features/owner/salons/bookings/bookings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService, Salon, DaySlot } from '../../../../core/api.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  salons: Salon[] = [];
  form!: FormGroup;
  registerForm!: FormGroup;

  selectedDate: Date | null = null;
  selectedDateStr = '';
  slots: DaySlot[] = [];

  loading = false;
  message = '';

  
  selectedSlot: DaySlot | null = null;
  editingSlot: DaySlot | null = null;
  showRegisterModal = false;
  slotToDelete: DaySlot | null = null;
  showRecurringError = false;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      salonId: this.fb.control<number | null>(null)
    });

    this.registerForm = this.fb.group({
      startTime: ['09:00', Validators.required],
      endTime: ['17:00', Validators.required],
      durationMin: [30, [Validators.required, Validators.min(15)]],
    });
  }

  ngOnInit() {
    this.api.getSalons().subscribe(s => this.salons = s);
  }
  
  onDaySelected(d: Date) {
    this.selectedDate = d;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    this.selectedDateStr = `${year}-${month}-${day}`;
    this.fetchSlots();
  }

  fetchSlots() {
    const salonId = this.form.value.salonId;
    if (!salonId || !this.selectedDateStr) {
      this.message = 'Please select a salon and a date.';
      this.slots = [];
      return;
    }

    this.loading = true;
    this.message = '';

    this.api.getSlots(salonId, this.selectedDateStr).subscribe({
      next: (rows) => {
        this.slots = rows;
        if (!rows.length) this.message = 'No slots for this date.';
        this.loading = false;
      },
      error: (err) => {
        this.slots = [];
        this.loading = false;
        console.error('Error loading slots:', err);
        const errorMsg = err?.error?.message || err?.message || 'Failed to load slots.';
        if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
          this.message = 'No slots found. Please register time slots first using the "Register Time Slots" button.';
        } else {
          this.message = errorMsg;
        }
      }
    });
  }

  badgeClass(s: string) {
    return {
      AVAILABLE: 'badge available',
      BOOKED: 'badge booked',
      CLOSED: 'badge closed'
    }[s] || 'badge';
  }

  // view details
  openDetails(slot: DaySlot) {
    this.selectedSlot = slot;
  }

  closeDetails() {
    this.selectedSlot = null;
  }

  // edit slot
  openEditModal(slot: DaySlot) {
    this.editingSlot = { ...slot };
  }

  closeEditModal() {
    this.editingSlot = null;
  }

  saveEdit() {
    if (!this.editingSlot) return;
    
    this.api.updateSlot(this.editingSlot.slotId, {
      startTime: this.editingSlot.startTime,
      endTime: this.editingSlot.endTime,
      status: this.editingSlot.status
    }).subscribe({
      next: () => {
        this.message = 'Slot updated successfully!';
        this.closeEditModal();
        this.fetchSlots();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Failed to update slot.';
      }
    });
  }

  // delete slot
  deleteSlot(slot: DaySlot) {
    this.slotToDelete = slot;
  }

  confirmDelete() {
    if (!this.slotToDelete) return;

    this.api.deleteSlot(this.slotToDelete.slotId).subscribe({
      next: () => {
        this.message = 'Slot deleted successfully!';
        this.slotToDelete = null;
        this.fetchSlots();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Failed to delete slot.';
        this.slotToDelete = null;
      }
    });
  }

  cancelDelete() {
    this.slotToDelete = null;
  }

  // register new slots
  openRegisterModal() {
    const salonId = this.form.value.salonId;
    if (!salonId || !this.selectedDateStr) {
      alert('Please select a salon and a date first.');
      return;
    }
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
    this.registerForm.reset({
      startTime: '09:00',
      endTime: '17:00',
      durationMin: 30
    });
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const salonId = this.form.value.salonId;
    const payload = {
      salonId,
      slotDate: this.selectedDateStr,
      ...this.registerForm.value
    };

    this.api.registerSlots(payload).subscribe({
      next: () => {
        this.message = 'Time slots registered successfully!';
        this.closeRegisterModal();
        this.fetchSlots();
      },
      error: (err) => {
        this.message = err?.error?.message || 'Failed to register slots.';
      }
    });
  }
}