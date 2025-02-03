import { Component } from '@angular/core';
import { SessionBlockComponent } from '../session-block/session-block.component';
import { ServerService, SessionBlock } from '../server-service/server.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-list',
  imports: [SessionBlockComponent, CommonModule],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css'
})
export class SessionListComponent {
  sessions: SessionBlock[];

  constructor(service: ServerService) {
    service.getSessions()
      .subscribe((s) => {
        console.log(JSON.stringify(s));
        this.sessions = s.sessions;
      });
    service.onRefresh.asObservable().subscribe((s) => {
      service.getSessions()
      .subscribe((s) => {
        console.log(JSON.stringify(s));
        this.sessions = s.sessions;
      });
    });
    this.sessions = [];
  }
}
