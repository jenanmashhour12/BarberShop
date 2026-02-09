import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';  
import { ApiService, Service, Salon } from '../../../../core/api.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServicesComponent implements OnInit {
  salonId: number | null = null;
  services: Service[] = [];
  salons: Salon[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    
    this.api.getSalons().subscribe(s => {
      this.salons = s;
      
      if (s.length > 0) {
        this.salonId = s[0].id;
        this.loadServices();
      }
    });
  }

  onSalonChange() {
    this.loadServices();
  }

loadServices() {
  if (this.salonId) {
    this.api.services(this.salonId).subscribe(s => this.services = s);
  } else {
    this.services = [];
  }
}



deleteService(id: number) {
  this.openDeleteConfirm(id); 
}


serviceToDelete: number | null = null;

openDeleteConfirm(id: number) {
  this.serviceToDelete = id;
}

confirmDelete() {
  if (this.serviceToDelete !== null) {
    this.api.deleteService(this.serviceToDelete).subscribe(() => {
      this.services = this.services.filter(s => s.id !== this.serviceToDelete);
      this.serviceToDelete = null; 
    });
  }
}

cancelDelete() {
  this.serviceToDelete = null;
}


  editingService: Service | null = null;  

openEditModal(service: Service) {
  this.editingService = { ...service };
  document.body.classList.add('modal-open');
}

closeEditModal() {
  this.editingService = null;
  document.body.classList.remove('modal-open');
}


saveEdit() {
  if (!this.editingService) return;

  this.api.updateService(this.editingService.id, this.editingService).subscribe({
    next: (updated) => {
      this.services = this.services.map(s =>
        s.id === updated.id ? updated : s
      );
      this.closeEditModal();
    },
    error: (err) => console.error("Update failed:", err)
  });
}

newService: Service | null = null;


openAddModal() {
  this.newService = {
    id: 0,  
    salonId: this.salonId!,
    serviceName: '',
    description: '',
    price: 0,
    defaultDuration: 0,
    imageUrl: ''
  };
  document.body.classList.add('modal-open');
}


closeAddModal() {
  this.newService = null;
  document.body.classList.remove('modal-open');
}


saveNewService() {
  if (!this.newService) return;

  this.api.createService(this.newService).subscribe({
    next: (created) => {
      this.services.push(created); 
      this.closeAddModal();
    },
    error: (err) => console.error("Create failed:", err)
  });
}

}
