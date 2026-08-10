import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartProductLoadingComponent } from './cart-product-loading.component';

describe('CartProductLoadingComponent', () => {
  let component: CartProductLoadingComponent;
  let fixture: ComponentFixture<CartProductLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartProductLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartProductLoadingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render without throwing', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
