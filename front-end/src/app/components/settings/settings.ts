import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
})
export class Settings {
}
