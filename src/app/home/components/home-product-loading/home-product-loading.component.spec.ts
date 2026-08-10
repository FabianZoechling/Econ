import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductLoadingComponent } from './home-product-loading.component';

describe('HomeProductLoadingComponent', () => {
  let component: HomeProductLoadingComponent;
  let fixture: ComponentFixture<HomeProductLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeProductLoadingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render without throwing', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
