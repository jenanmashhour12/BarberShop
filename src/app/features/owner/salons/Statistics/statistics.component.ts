// src/app/features/owner/salons/Statistics/statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService, Salon } from '../../../../core/api.service';


interface Statistics {
  dailyBookings: number;
  weeklyBookings: number;
  monthlyBookings: number;
  mostRequestedTimes: Array<{
    timeSlot: string;
    count: number;
  }>;
}

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  salons: Salon[] = [];
  form!: FormGroup;
  statistics: Statistics | null = null;
  loading = false;
  message = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    this.form = this.fb.group({
      salonId: this.fb.control<number | null>(null),
      startDate: [this.formatDate(startOfWeek)],
      endDate: [this.formatDate(today)]
    });
  }

  ngOnInit() {
    this.api.getSalons().subscribe(s => {
      this.salons = s;
      if (s.length > 0) {
        this.form.patchValue({ salonId: s[0].id });
        this.loadStatistics();
      }
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadStatistics() {
    const salonId = this.form.value.salonId;
    if (!salonId) {
      this.message = 'Please select a salon.';
      return;
    }

    this.loading = true;
    this.message = '';

    const params = {
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate
    };

    this.api.getStatistics(salonId, params).subscribe({
      next: (data) => {
        this.statistics = data;
        this.loading = false;
        if (!data.mostRequestedTimes || data.mostRequestedTimes.length === 0) {
          this.message = 'No data available for the selected period.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'Failed to load statistics.';
        this.statistics = null;
      }
    });
  }

  onFilterChange() {
    this.loadStatistics();
  }

  setDateRange(range: 'today' | 'week' | 'month') {
    const today = new Date();
    let startDate: Date;

    switch (range) {
      case 'today':
        startDate = new Date(today);
        break;
      case 'week':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
    }

    this.form.patchValue({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(today)
    });

    this.loadStatistics();
  }
}