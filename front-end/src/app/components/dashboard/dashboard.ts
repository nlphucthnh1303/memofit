import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Header } from "../header/header";
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  imports: [Sidebar, RouterOutlet, Header],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef); // Cần thiết đối với OnPush

  headerTitle: string = '';

  ngOnInit(): void {
    this.updateHeaderTitle();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateHeaderTitle();
    });
  }

  private updateHeaderTitle(): void {
    let currentRoute = this.activatedRoute;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }
    const routeTitle = currentRoute.snapshot.title || currentRoute.snapshot.data['headerTitle'] || 'Bảng điều khiển';

    this.headerTitle = routeTitle;
    this.cdr.markForCheck();
  }


}
