import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrService, provideToastr } from 'ngx-toastr';

import { DeliveryService } from '@services/delivery/delivery.service';
import * as mockData from '@services/mock_test.json';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let service: DeliveryService;
  let toast: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientModule, BrowserAnimationsModule],
      providers: [provideToastr()],
    }).compileComponents();

    toast = TestBed.inject(ToastrService);
    service = TestBed.inject(DeliveryService);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the service on change', () => {
    const fakedFetchedList = mockData;

    waitForAsync(
      inject([DeliveryService], (service: any) =>
        service
          .getDeliveryList()
          .subscribe((result: any) => expect(result).toBe(fakedFetchedList)),
      ),
    );
  });
});
