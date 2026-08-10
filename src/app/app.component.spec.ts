import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the title 'amazon-frontend'`, () => {
    expect(component.title).toBe('amazon-frontend');
  });

  it('should not throw once the deferred init timeout elapses', fakeAsync(() => {
    // `initFlowbite` is imported from the `flowbite` package as an ES
    // namespace object. Depending on the build, that export is compiled as
    // read-only, so it can't reliably be spied on with `spyOn(flowbite, ...)`
    // across environments. Instead we verify the behavior we actually own:
    // ngOnInit schedules a call via setTimeout(..., 100), and firing that
    // timer should not throw or leave any pending async work behind.
    expect(() => {
      fixture.detectChanges(); // triggers ngOnInit, schedules the timeout
      tick(100); // let the setTimeout callback run
    }).not.toThrow();
  }));

  it('should render the navbar and footer', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('app-navbar')).toBeTruthy();
    expect(el.querySelector('app-footer')).toBeTruthy();
  });
});
