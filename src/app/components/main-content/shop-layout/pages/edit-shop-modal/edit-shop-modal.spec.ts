import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShopModal } from './edit-shop-modal';

describe('EditShopModal', () => {
  let component: EditShopModal;
  let fixture: ComponentFixture<EditShopModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditShopModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditShopModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
