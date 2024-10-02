import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'https://two024-messidepaul-back.onrender.com';  // URL del backend
  //private baseLocalUrl = 'http://127.0.0.1:8000';
  constructor(private http: HttpClient) { }

  async onRegister(order: Order): Promise<any | null> { // Cambia el tipo de retorno a `any`
    try {
        const response = await this.http.post(`${this.baseUrl}/register-order`, order).toPromise();
        console.log("RESPONSE", response); // Imprime la respuesta completa
        return response;  // Devuelves la respuesta completa
    } catch (error: any) {
        console.error('Error durante el registro:', error);
        return null;
    }
}
  async addOrderItems(orderId: string, newItems: any[]): Promise<boolean> {
    try {
      await this.http.put(`${this.baseUrl}/orders/order-items/${orderId}`, { new_order_items: newItems }).toPromise();
      return true;
    } catch (error: any) {
      console.error('Error adding order items:', error);
      return false;
    }
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${orderId}`);
  }

  getOrders(): Observable<Order>{
    return this.http.get<Order>(`${this.baseUrl}/orders`);
  }

}