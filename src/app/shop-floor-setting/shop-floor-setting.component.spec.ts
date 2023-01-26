import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopFloorSettingComponent } from './shop-floor-setting.component';

describe('ShopFloorSettingComponent', () => {
  let component: ShopFloorSettingComponent;
  let fixture: ComponentFixture<ShopFloorSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopFloorSettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopFloorSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
