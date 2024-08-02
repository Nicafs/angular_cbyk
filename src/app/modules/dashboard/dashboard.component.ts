import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ToastrService } from 'ngx-toastr';

import { DeliveryService } from '@app/core/services/delivery';
import { TDelivery } from '@models';
import { concatMap, groupBy, map, mergeMap, of, reduce } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  listDriver: {
    name: string;
    data: TDelivery[];
    qtdFinish: number;
    qtdFailure: number;
    qtdTotal: number;
  }[] = [];
  listNeighborhood: TDelivery[] = [];

  columnsListDriver: string[] = ['name', 'qtdFinish', 'qtdTotal'];
  columnsListFailure: string[] = ['name', 'qtdFailure'];
  columnsNeighborhood: string[] = ['name', 'qtdFinish', 'qtdTotal'];

  constructor(
    private _deliveryService: DeliveryService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this._deliveryService.getDeliveryList().subscribe({
      next: (res) => {
        const response = res;

        this.getListDriver(response);
        this.getListNeighborhood(response);
      },
      error: (error) => {
        this.toastr.error('Error!', error.message);
      },
    });
  }

  getListDriver(apiData: TDelivery[]) {
    this.listDriver = [];

    of(apiData)
      .pipe(
        concatMap((res) => res),
        groupBy((item) => item.motorista?.nome),
        mergeMap((group$) =>
          group$.pipe(
            reduce((acc: any, cur) => {
              return [...acc, cur];
            }, []),
          ),
        ),
        map((group) => {
          let qtdFinish = 0;
          let qtdFailure = 0;
          let qtdTotal = 0;

          group.forEach((item: any) => {
            if (item.status_entrega !== 'PENDENTE') {
              qtdFinish += 1;
            }

            if (item.status_entrega === 'INSUCESSO') {
              qtdFailure += 1;
            }

            qtdTotal += 1;
          });

          return {
            name: group[0].motorista.nome,
            data: group,
            qtdFinish,
            qtdFailure,
            qtdTotal,
          };
        }),
      )
      .subscribe((grouped: any) => {
        this.listDriver.push(grouped);
      });
  }

  getListNeighborhood(apiData: TDelivery[]) {
    this.listNeighborhood = [];

    of(apiData)
      .pipe(
        concatMap((res) => res),
        groupBy((item) => item.cliente_destino?.bairro),
        mergeMap((group$) =>
          group$.pipe(
            reduce((acc: any, cur) => {
              return [...acc, cur];
            }, []),
          ),
        ),
        map((group) => {
          let qtdFinish = 0;
          let qtdTotal = 0;

          group.forEach((item: any) => {
            if (item.status_entrega !== 'PENDENTE') {
              qtdFinish += 1;
            }
            qtdTotal += 1;
          });

          return {
            name: group[0].cliente_destino?.bairro,
            data: group,
            qtdFinish,
            qtdTotal,
          };
        }),
      )
      .subscribe((grouped: any) => {
        this.listNeighborhood.push(grouped);
      });
  }
}
