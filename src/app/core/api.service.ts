import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:8080/api';

/* ================= INTERFACES ================= */

export interface Salon {
  id: number;
  ownerUserId: number;
  salonName: string;
  phone?: string | null;
  address?: string | null;
  active: boolean;
}

export interface Slot {
  id: number;
  salonId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CLOSED';
}

export interface DaySlot {
  slotId: number;
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CLOSED';
  bookingId?: number;
  customerName?: string;
  customerPhone?: string;
  serviceId?: number;
  serviceName?: string;
  serviceDescription?: string;
  servicePrice?: number;
}

export interface Service {
  id: number;
  salonId: number;
  serviceName: string;
  description?: string | null;
  price: number;
  defaultDuration: number;
  imageUrl?: string | null; 
}


export interface Statistics {
  dailyBookings: number;
  weeklyBookings: number;
  monthlyBookings: number;
  mostRequestedTimes: { timeSlot: string; count: number }[];
}

/* ================= SERVICE ================= */

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  /* ===== SALONS ===== */

  getSalons(): Observable<Salon[]> {
    return this.http.get<Salon[]>(`${API}/public/salons`);
  }


  /* ===== SLOTS ===== */
// ====== BACKWARD COMPATIBILITY ======

/* ===================== DAY SLOTS / BOOKINGS VIEW ===================== */

getSlots(salonId: number, date: string): Observable<DaySlot[]> {
  return this.http.get<DaySlot[]>(`${API}/bookings/slots`, {
    params: {
      salonId: salonId.toString(),
      date
    }
  });
}
updateSlot(id: number, payload: any) {
  return this.http.put(`${API}/owner/slots/${id}`, payload);
}

deleteSlot(id: number) {
  return this.http.delete(`${API}/owner/slots/${id}`);
}

registerSlots(payload: any) {
  return this.http.post(`${API}/owner/slots/batch`, payload);
}

createSalon(payload: any) {
  return this.http.post(`${API}/public/salons`, payload);
}

services(salonId: number) {
  return this.getServices(salonId);
}


  getServices(salonId: number): Observable<Service[]> {
    return this.http.get<Service[]>(`${API}/salons/${salonId}/services`);
  }

  createService(payload: any): Observable<Service> {
    return this.http.post<Service>(`${API}/services`, payload);
  }

  updateService(id: number, payload: any): Observable<Service> {
    return this.http.put<Service>(`${API}/services/${id}`, payload);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/services/${id}`);
  }

  /* ===== STATISTICS ===== */

  getStatistics(
    salonId: number,
    params?: { startDate?: string; endDate?: string }
  ): Observable<Statistics> {
    let p = new HttpParams().set('salonId', salonId);
    if (params?.startDate) p = p.set('startDate', params.startDate);
    if (params?.endDate) p = p.set('endDate', params.endDate);
    return this.http.get<Statistics>(`${API}/owner/statistics`, { params: p });
  }
}
