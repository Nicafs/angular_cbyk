import {
  async,
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectHarness } from '@angular/material/select/testing';

import { ToastrService, ToastrModule, provideToastr } from 'ngx-toastr';

import { DeliveryService } from '@services/delivery/delivery.service';
import * as mockData from '@services/mock_test.json';

import { DeliveryListComponent } from './delivery-list.component';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('DeliveryListComponent', () => {
  let component: DeliveryListComponent;
  let fixture: ComponentFixture<DeliveryListComponent>;
  let loader: HarnessLoader;
  let service: DeliveryService;
  let toast: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DeliveryListComponent,
        BrowserAnimationsModule,
        ToastrModule,
        HttpClientModule,
      ],
      providers: [provideToastr()],
    }).compileComponents();

    toast = TestBed.inject(ToastrService);
    service = TestBed.inject(DeliveryService);
    fixture = TestBed.createComponent(DeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the service', () => {
    const fakedFetchedList = mockData;

    waitForAsync(
      inject([DeliveryService], (service: any) =>
        service
          .getDeliveryList()
          .subscribe((result: any) => expect(result).toBe(fakedFetchedList)),
      ),
    );
  });

  it('should trigger onChangeDriver', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      let field: HTMLInputElement = fixture.debugElement.query(
        By.css('#filter-driver'),
      ).nativeElement;

      expect(field.value).toBe('');

      field.value = 'Carlos';
      field.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(component.filterDriver).toBe('Carlos');
    });
  }));

  it('should trigger onChangeStatus', async () => {
    expect(component.filterStatus).toBe('');
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();
    const bugOption = await select.getOptions({ text: 'ENTREGUE' });
    await bugOption[0].click();

    expect(component.filterStatus).toBe('ENTREGUE');
  });
});
