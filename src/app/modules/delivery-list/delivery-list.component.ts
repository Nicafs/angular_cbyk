import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { ToastrService } from 'ngx-toastr';

import { DeliveryService } from '@services/delivery';
import { TDelivery } from '@app/shared';
import { filter, of } from 'rxjs';

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
    MatSortModule,
    CommonModule,
  ],
  templateUrl: './delivery-list.component.html',
  styleUrl: './delivery-list.component.scss',
})
export class DeliveryListComponent implements OnInit {
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

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _deliveryService: DeliveryService,
    private toastr: ToastrService,
    private _liveAnnouncer: LiveAnnouncer,
  ) {}

  ngOnInit() {
    this.getDeliveryList();
  }

  setDataSourceConfig(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      if (property.includes('.')) {
        return property.split('.').reduce((o, i) => o[i], item);
      }

      return item[property];
    };
  }

  getDeliveryList(): void {
    this._deliveryService.getDeliveryList().subscribe({
      next: (response) => {
        this.listDelivery = response;
        this.dataSource = new MatTableDataSource<TDelivery>(response);
        this.setDataSourceConfig();
      },
      error: (error) => {
        this.toastr.error('Error!', error.message);
      },
    });
  }

  handleFilters(): void {
    let filterResult = this.listDelivery;

    if (this.filterStatus) {
      filterResult = filterResult.filter(
        (item) => item.status_entrega === this.filterStatus,
      );
    }

    if (this.filterDriver) {
      filterResult = filterResult.filter((item) =>
        item.motorista.nome
          .toLocaleLowerCase()
          .trim()
          .includes(this.filterDriver.toLocaleLowerCase().trim()),
      );
    }

    this.dataSource = new MatTableDataSource<TDelivery>(filterResult);
    this.setDataSourceConfig();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
