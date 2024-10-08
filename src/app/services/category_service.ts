import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'https://two024-messidepaul-back.onrender.com'; // URL base de la API HOSTEADA
  //private baseLocalUrl = 'http://127.0.0.1:8000'; 

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  getCategories(): Observable<{ categories: Category[]; message: string }> {
    return this.http.get<{ categories: Category[]; message: string }>(`${this.baseUrl}/categories`);
  }

  // Obtener una categoría por ID
  getCategoryById(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${categoryId}`);
  }

  // Crear nueva categoría
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/register-category`, category);
  }  

  // Actualizar el nombre de una categoría
  updateCategoryName(categoryId: string, newName: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/categories/name/${categoryId}/${newName}`, {});
  }

  // Eliminar una categoría
  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${categoryId}`);
  }
}
