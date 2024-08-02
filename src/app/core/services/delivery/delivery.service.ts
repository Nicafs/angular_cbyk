import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { TDelivery } from '@models';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  constructor(private _http: HttpClient) {}

  getDeliveryList(): Observable<TDelivery[]> {
    return this._http.get<TDelivery[]>(`${environment.api}/entregas.json`);
  }
}
