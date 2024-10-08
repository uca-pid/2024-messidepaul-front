import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrderItem } from 'src/app/models/orderItem';
import { Product } from 'src/app/models/product';
import { Table } from 'src/app/models/table';
import { OrderService } from 'src/app/services/order_service';
import { ProductService } from 'src/app/services/product_service';
import { TableService } from 'src/app/services/table_service';

@Component({
  selector: 'app-table-free',
  templateUrl: './table-free.component.html',
  styleUrls: ['./table-free.component.css']
})
export class TableFreeComponent implements OnInit {
  @Input() table: Table = new Table('');
  @Output() close = new EventEmitter<void>();

  orderItems: OrderItem[] = [];
  loading: boolean = false;
  selectedProduct: Product | null = null;
  selectedAmount: number = 1;
  canAddProduct: boolean = false;
  products : Product[] = [];
  currentTime: string = '';
  order: Order | undefined;
  currentDate: string = this.formatDate(new Date());

  constructor(private productService: ProductService, private orderService: OrderService, private tableService: TableService) {}

  ngOnInit() {
    //TO DO: HACER EL GET DE LOS PRODUCTOS
    this.updateCurrentTime();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Products fetched:', data);
        if (data && Array.isArray(data.products)) {
          this.products = data.products;
        } else {
          console.error('Unexpected data format:', data);
        }
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
      
    });
  }

  updateCurrentTime() {
    const hours = new Date().getHours().toString().padStart(2, '0');
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
  }
  onProductChange() {
    this.validateForm();
  }

  validateForm() {
    this.canAddProduct = !!this.selectedProduct && this.selectedAmount > 0;
  }

  addOrderItem() {
    if (this.selectedProduct && this.selectedAmount > 0) {
      const newItem: OrderItem = {
        product_id: this.selectedProduct.id ?? 0,
        amount: this.selectedAmount
      };
      this.orderItems.push(newItem);
      this.resetForm();
    }
  }

  removeOrderItem(item: OrderItem) {
    const index = this.orderItems.indexOf(item);
    if (index > -1) {
      this.orderItems.splice(index, 1);
    }
  }

  resetForm() {
    this.selectedProduct = null;
    this.selectedAmount = 1;
    this.canAddProduct = false;
  }

  calculateTotal() {
    return this.orderItems.reduce((total, item) => {
      const product = this.products.find(p => p.id === item.product_id); 
      return product ? total + item.amount * parseFloat(product.price) : total;
    }, 0);
  }


  async createOrder() {
    this.loading = true;
    const total = this.calculateTotal();
    this.order = {
      status: 'IN PROGRESS',
      tableNumber: this.table?.id ?? 0,
      date: this.currentDate,
      time: this.currentTime,
      total: total.toString(),
      orderItems: this.orderItems
    }; 
    try {
      const response = await this.orderService.onRegister(this.order); // Aquí se registra la orden
      if (response && response.order && response.order_id) {  // Asegúrate de que haya un order_id
          console.log(this.order); // Esta es la orden antes de la respuesta
          console.log('Order Register successful', response);
          
          // Llama a updateTableAndOrder pasando la orden y el order_id
          await this.tableService.updateTableAndOrder(response.order, response.order_id); // Cambié aquí
          this.updateTable(); // Actualizas la tabla después de la asociación
          this.closeDialog(); // Cierra el diálogo si todo sale bien
      } else {
          console.log('Order registration failed');
      }
  } catch (error: any) {
      console.error('Error durante el registro:', error);
  } finally{
    this.loading = false; // Detener el spinner
  }

}


  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes comienza desde 0
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}` // Formato YYYY-MM-DD
  }

  getProductById(productId: number): Product | undefined {
    return this.products.find(product => product.id === productId);
  }
  

  updateTable(){
    //TO DO: QUE LO UPDATEE
    this.table.status = 'BUSY';
    this.table.order_id = this.order?.id;  
    
    console.log('Table updated', this.table);
  }

  // Cerrar el diálogo
  closeDialog() {
    console.log('Dialog closed');
    this.orderItems = [];
    this.order = undefined;
    location.reload();
    this.close.emit();
  }
}
