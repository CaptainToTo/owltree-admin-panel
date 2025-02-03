import { Component } from '@angular/core';
import { ServerService } from '../server-service/server.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  server: string;
  
  constructor(private service: ServerService) {
    this.server = service.getIpAddr();
    service.onLogin.asObservable().subscribe((s) => {
      this.server = s.getIpAddr();
    });
  }

  refresh() {
    this.service.refresh();
  }
}
