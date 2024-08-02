import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { ToastrService } from 'ngx-toastr';

import { DeliveryService } from '@services/delivery';
import { TDelivery } from '@app/shared';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginator,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.scss',
})
export class DeliveryListComponent {
  listDelivery: TDelivery[] = [];
  dataSource = new MatTableDataSource<TDelivery>([]);

  filterDriver: string = '';
  filterStatus: string = '';

  columnsListDelivery: string[] = [
    'id',
    'documento',
    'motorista',
    'cliente_origem',
    'cliente_destino',
    'status_entrega',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private _deliveryService: DeliveryService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.getDeliveryList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getDeliveryList(): void {
    this._deliveryService.getDeliveryList().subscribe({
      next: (response) => {
        this.listDelivery = response;
        this.dataSource = new MatTableDataSource<TDelivery>(response);
      },
      error: (error) => {
        this.toastr.error('Error!', error.message);
      },
    });
  }

  onChangeDriver(event: any): void {
    const motoristaNome = event.target.value || '';

    let filterResult = this.listDelivery;

    if (motoristaNome) {
      filterResult = this.listDelivery.filter((item) =>
        item.motorista.nome.includes(motoristaNome),
      );
    }

    this.dataSource = new MatTableDataSource<TDelivery>(filterResult);
    this.dataSource.paginator = this.paginator;
  }

  onChangeStatus(event: any): void {
    const status = event.value;

    let filterResult = this.listDelivery;

    if (status) {
      filterResult = this.listDelivery.filter(
        (item) => item.status_entrega === status,
      );
    }

    this.dataSource = new MatTableDataSource<TDelivery>(filterResult);
    this.dataSource.paginator = this.paginator;
  }
}
