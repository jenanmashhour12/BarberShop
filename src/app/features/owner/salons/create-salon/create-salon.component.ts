// src/app/features/owner/salons/create-salon/create-salon.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-salon',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-salon.component.html',
  styleUrls: ['./create-salon.component.scss']
})
export class CreateSalonComponent {

  submitting = false;
  message = '';

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      salonName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      active: [true]
    });
  }
  

  /** ✅ SAFE ACCESS FOR TEMPLATE */
  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.submitting = true;
  
    const payload = { ownerUserId: 1, ...this.form.value };
  
    this.api.createSalon(payload).subscribe({
      next: () => {
        this.submitting = false;
  
        this.snack.open(
          'Salon created successfully',
          'OK',
          {
            duration: 3500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['center-snackbar']
          }
        );
        
  
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 800);
      },
      error: (err: any) => {
        this.submitting = false;
  
        this.snack.open(
          err?.error?.message || 'Failed to create salon !!',
          'Close',
          { duration: 4000 }
        );
      }
    });
  }
  
}
