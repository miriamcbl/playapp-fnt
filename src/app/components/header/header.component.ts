import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
  isMenuOpen = false;
  private routerSubscription: Subscription;
  private globalClickListener: (() => void) | undefined;
  
  constructor(private renderer: Renderer2, private elRef: ElementRef, private router: Router) {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.globalClickListener = this.renderer.listen('document', 'click', this.onGlobalClick.bind(this));
    } else if (this.globalClickListener) {
      this.globalClickListener();
    }
  }

  onGlobalClick(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
      if (this.globalClickListener) {
        this.globalClickListener();
      }
    }
  }

  ngOnDestroy() {
    if (this.globalClickListener) {
      this.globalClickListener();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
