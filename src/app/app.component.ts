import { Component } from '@angular/core';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ { provide: BsDropdownConfig, useValue: { insideClick: true}}]
})
export class AppComponent {
  title = 'FlexHealthUI';
  
}
