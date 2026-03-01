import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShopModal } from './create-shop-modal';

describe('CreateShopModal', () => {
  let component: CreateShopModal;
  let fixture: ComponentFixture<CreateShopModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateShopModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShopModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
