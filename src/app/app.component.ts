import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true
})
export class AppComponent {
  products: Product[] = [];
  chartData: any[] = [];
  productForm: FormGroup;
  editMode: boolean = false;
  editIndex: number | null = null;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required]
    });
  }

  // Add or Update Product
  onSubmit() {
    if (this.productForm.invalid) return;

    const newProduct: Product = {
      id: this.editMode && this.editIndex !== null ? this.products[this.editIndex].id : Date.now(),
      ...this.productForm.value
    };

    if (this.editMode && this.editIndex !== null) {
      this.products[this.editIndex] = newProduct;
      this.editMode = false;
      this.editIndex = null;
    } else {
      this.products.push(newProduct);
    }

    this.productForm.reset();
    this.updateChartData(); // Update chart after every addition or edit
  }

  // Edit Product
  onEdit(index: number) {
    this.editMode = true;
    this.editIndex = index;
    const product = this.products[index];
    this.productForm.setValue({
      name: product.name,
      price: product.price,
      category: product.category
    });
  }

  // Delete Product
  onDelete(index: number) {
    this.products.splice(index, 1);
    this.updateChartData(); // Update chart after deletion
  }

  // Update Chart Data
  updateChartData() {
    this.chartData = this.products.map(product => ({
      name: product.name,
      value: product.price
    }));
  }
}
