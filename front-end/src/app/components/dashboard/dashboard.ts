import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from "@angular/router";
import { Header } from "../header/header";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  imports: [Sidebar, RouterOutlet, Header],
  templateUrl: './dashboard.html',
})
export class Dashboard {

}
