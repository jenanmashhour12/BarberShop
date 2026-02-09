
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService, Salon } from '../../../../core/api.service'; 

@Component({
  selector: 'app-moving-window',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moving-window.component.html',
  styleUrls: ['./moving-window.component.scss'],
})
export class MovingWindowComponent { }
