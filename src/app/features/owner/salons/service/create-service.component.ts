// src/app/features/owner/salons/create-service/create-service.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Salon, Service } from '../../../../core/api.service';

@Component({
  selector: 'app-create-service',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit {

  form: FormGroup;
  submitting = false;
  message = '';
  salons: Salon[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      salonId: [null, Validators.required],
      serviceName: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      defaultDuration: [30, [Validators.required, Validators.min(5)]],
      imageUrl: ['']
    });
  }

  /* ================= INIT ================= */

  ngOnInit(): void {
    this.loadSalons();
  }

  /* ================= LOAD SALONS ================= */

  loadSalons(): void {
    this.api.getSalons().subscribe({
      next: (salons: Salon[]) => {
        this.salons = salons;
      },
      error: (err: any) => {
        console.error('Failed to load salons', err);
        this.message = 'Failed to load salons';
      }
    });
  }

  /* ================= SUBMIT ================= */

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;

    this.api.createService(this.form.value).subscribe({
      next: (_service: Service) => {
        this.submitting = false;
        this.message = 'Service created successfully';

        this.router.navigate([
          '/owner/salons',
          this.form.value.salonId,
          'services'
        ]);
      },
      error: (err: any) => {
        this.submitting = false;
        this.message = err?.error?.message || 'Failed to create service';
      }
    });
  }
}
