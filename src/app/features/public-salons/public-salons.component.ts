import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';

interface ReservationMini {
  id: string;
  customerName: string;
  status: 'active' | 'completed';
}

@Component({
  standalone: true,
  selector: 'app-public-salons',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatIconModule,
  ],
  templateUrl: './public-salons.component.html',
  styleUrls: ['./public-salons.component.scss'],
})
export class PublicSalonsComponent {
  isCollapsed: boolean = false; 

  miniActiveReservations: ReservationMini[] = [
    { id: 'abc', customerName: 'Ali', status: 'active' },
    { id: 'def', customerName: 'Ahmad', status: 'active' },
    { id: 'ghi', customerName: 'Mohammad', status: 'active' },
    { id: 'jkl', customerName: 'Omar', status: 'active' },
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  logout() {
    console.log('Logout function called! Implement your Spring Boot call here.');
  }
}




