import { Component, Input } from '@angular/core';
import { SessionBlock } from '../server-service/server.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-session-block',
  imports: [CommonModule, RouterModule],
  templateUrl: './session-block.component.html',
  styleUrl: './session-block.component.css'
})
export class SessionBlockComponent {
  @Input() sessionBlock!: SessionBlock;

  sessionId() {
    return this.sessionBlock?.sessionId ?? 0;
  }

  appId() {
    return this.sessionBlock?.appId ?? "unknown";
  }

  ipAddr() {
    return this.sessionBlock?.ipAddr ?? "N/A";
  }

  tcpPort() {
    return this.sessionBlock?.tcpPort ?? -1;
  }

  udpPort() {
    return this.sessionBlock?.udpPort ?? -1;
  }

  clientCount() {
    return this.sessionBlock?.clientCount ?? 0;
  }

  maxClients() {
    return this.sessionBlock?.maxClients ?? 4;
  }

  authority() {
    return this.sessionBlock?.authority ?? 0;
  }
}
