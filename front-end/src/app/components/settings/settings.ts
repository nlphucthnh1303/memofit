import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  imports: [Sidebar],
  templateUrl: './settings.html',
})
export class Settings {
}
