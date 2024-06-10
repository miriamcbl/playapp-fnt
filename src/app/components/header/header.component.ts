import { Component, ElementRef, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
  isMenuOpen = false;
  private globalClickListener: (() => void) | undefined;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

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
  }
}
