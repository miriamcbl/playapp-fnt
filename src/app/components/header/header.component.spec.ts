import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { ElementRef, Renderer2 } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let renderer: Renderer2;
  let elRef: ElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [],
      providers: [
        {
          provide: ElementRef,
          useValue: {
            nativeElement: document.createElement('div')
          }
        },
        Renderer2
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    renderer = TestBed.inject(Renderer2);
    elRef = TestBed.inject(ElementRef);

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close menu', () => {
    component.isMenuOpen = true;

    const navigationEndEvent = new NavigationEnd(1, '/some-url', '/some-url');
    (router.events as any).next(navigationEndEvent);

    expect(component.isMenuOpen).toBe(false);
  });

  it('should toggle menu', () => {
    component.toggleMenu();

    expect(component.isMenuOpen).toBe(true);

    component.toggleMenu();

    expect(component.isMenuOpen).toBe(false);
  });

  it('should unsubscribe from router events and global click listener on destroy', () => {
    spyOn(component['routerSubscription'], 'unsubscribe').and.callThrough();

    component.ngOnDestroy();

    expect(component['routerSubscription'].unsubscribe).toHaveBeenCalled();
  });
});
