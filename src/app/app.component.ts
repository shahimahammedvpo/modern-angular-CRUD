import { Component, importProvidersFrom, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './product.service';
import { finalize } from 'rxjs';
import { product } from './models/product';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule,CurrencyPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  private productService=inject(ProductService);
products:product[]=[];
title='';
price:number|null=null;
selectedProductId:number|null=null;

isLoading=false;
errorMessage='';
successMessage='';

ngOnInit(): void {
  this.loadProducts();
}

//GET products 
loadProducts():void{
this.isLoading=true;
this.errorMessage='';
this.productService.getproducts()
.pipe(
  finalize(()=>this.isLoading=false)
)
.subscribe({
  next:(response)=>{
    this.products=response.products;
  },
  error:()=>{
    this.errorMessage='failed to load products'
  }

});
}

// POST products
 saveProduct(): void {
    if (!this.title.trim() || this.price === null || this.price <= 0) {
      this.errorMessage = 'Enter a product title and a price greater than zero.';
      return;
    }

    const productData = {
      title: this.title.trim(),
      price: this.price
    };

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.selectedProductId !== null) {
      // Update existing product
      const id = this.selectedProductId;

      this.productService.updateProduct(id, productData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (updatedProduct) => {
            this.products = this.products.map(product =>
              product.id === id
                ? { ...product, ...updatedProduct }
                : product
            );

            this.successMessage = 'Product updated successfully!';
            this.resetForm();
          },
          error: () => {
            this.errorMessage = 'Failed to update product.';
          }
        });
    } else {
      // Add new product
      this.productService.addProduct(productData)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: (newProduct) => {
            this.products = [
              { ...newProduct, ...productData },
              ...this.products
            ];

            this.successMessage = 'Product added successfully!';
            this.resetForm();
          },
          error: () => {
            this.errorMessage = 'Failed to add product.';
          }
        });
    }
  }

  // Load product details into the form
  editProduct(product: product): void {
    this.selectedProductId = product.id;
    this.title = product.title;
    this.price = product.price;

    this.errorMessage = '';
    this.successMessage = '';
  }

  // DELETE: Remove product
  deleteProduct(id: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.deleteProduct(id)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.products = this.products.filter(
            product => product.id !== id
          );

          this.successMessage = 'Product deleted successfully!';

          if (this.selectedProductId === id) {
            this.resetForm();
          }
        },
        error: () => {
          this.errorMessage = 'Failed to delete product.';
        }
      });
  }

  // Clear the form
  resetForm(): void {
    this.title = '';
    this.price = null;
    this.selectedProductId = null;
  }

}
