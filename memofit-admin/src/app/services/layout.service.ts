import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private platformId = inject(PLATFORM_ID);
  
  isCollapsed = signal<boolean>(false);
  isForceCollapsed = signal<boolean>(false);
  
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('sidebar-collapsed');
      if (stored === 'true') {
        this.isCollapsed.set(true);
      }
      
      this.checkResponsive();
      window.addEventListener('resize', () => this.checkResponsive());
    }
  }
  
  get collapsed(): boolean {
    return this.isCollapsed() || this.isForceCollapsed();
  }
  
  toggle() {
    if (this.isForceCollapsed()) return; // Don't allow manual toggle if forced
    const newVal = !this.isCollapsed();
    this.isCollapsed.set(newVal);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebar-collapsed', String(newVal));
    }
  }

  setForceCollapse(val: boolean) {
    this.isForceCollapsed.set(val);
  }
  
  private checkResponsive() {
    if (window.innerWidth < 1024) {
      if (!this.isCollapsed()) {
        this.isCollapsed.set(true);
      }
    }
  }
}
