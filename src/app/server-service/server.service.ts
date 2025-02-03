import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginResult {
  accepted: boolean;
}

export interface SessionBlock {
  sessionId: string;
  ipAddr: string;
  tcpPort: number;
  udpPort: number;
  appId: string;
  clientCount: number;
  maxClients: number;
  authority: number;
}

export interface SessionList {
  sessions: SessionBlock[];
}

export interface ClientData {
  clientId: number;
  ping: number;
}

export enum ClientEventType {
  clientConnection,
  clientDisconnection,
  hostMigration
}

export interface ClientEvent {
  eventType: ClientEventType;
  clientId: number;
  timestamp: number;
}

export interface BandwidthData {
  recv: number[];
  send: number[];
}

export interface SessionDetails {
  sessionId: string;
  ipAddr: string;
  tcpPort: number;
  udpPort: number;
  appId: string;
  authority: number;
  maxClients: number;
  clients: ClientData[];
  clientEvents: ClientEvent[];
  bandwidth: BandwidthData;
  logs: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  url: string | undefined = undefined;
  server: string | undefined = undefined;
  password: string | undefined = undefined;

  onLogin: EventEmitter<ServerService> = new EventEmitter<ServerService>();

  onRefresh: EventEmitter<ServerService> = new EventEmitter<ServerService>();

  constructor(private http: HttpClient) { }

  login(ip: string, password: string) : Observable<LoginResult> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(password)
    });
    const data = this.http.get<LoginResult>('https://' + ip + '/admin/login', { headers: headers });

    data.subscribe((result) => {
      if (result.accepted) {
        this.url = 'https://' + ip;
        this.server = ip;
        this.password = password;
        this.onLogin.emit(this);
      }
    });

    return data;
  }

  getIpAddr() : string {
    return this.server ?? '';
  }

  getSessions() : Observable<SessionList> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.password!)
    });
    const data = this.http.get<SessionList>(this.url + '/admin/session-list', { headers: headers });
    return data;
  }

  getSessionDetails(sessionId: string) : Observable<SessionDetails> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.password!)
    });
    const data = this.http.get(this.url + '/admin/sessions/' + sessionId, { headers: headers });
    return data as Observable<SessionDetails>;
  }

  refresh() {
    this.onRefresh.emit(this);
  }

  getSessionDetailsDefault(): SessionDetails {
    return {
      sessionId: '',
      ipAddr: '',
      tcpPort: 0,
      udpPort: 0,
      appId: '',
      authority: 0,
      maxClients: 4,
      clients: [],
      clientEvents: [],
      logs: '',
      bandwidth: {
        recv: [],
        send: []
      }
    }
  }
}
