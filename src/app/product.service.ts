import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { product, productResponse } from './models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
private http=inject(HttpClient);
private apiUrl='https://dummyjson.com/products';

// GET
getproducts():Observable<productResponse>{
  return this.http.get<productResponse>(`${this.apiUrl}?limit=30`);
}
// POST
addProduct(product:Partial<product>):Observable<product>{
  return this.http.post<product>(`${this.apiUrl}/add`,product);
}
// PUT
updateProduct(id:number,product:Partial<product>):Observable<product>{
  return this.http.put<product>(`${this.apiUrl}/${id}`,product);
}
// DELETE
deleteProduct(id:number):Observable<product>{
  return this.http.delete<product>(`${this.apiUrl}/${id}`);
}
}
