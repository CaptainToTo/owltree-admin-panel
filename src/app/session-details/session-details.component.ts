import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ClientEventType, ServerService, SessionDetails } from '../server-service/server.service';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-session-details',
  imports: [RouterModule, CommonModule, HighchartsChartModule],
  templateUrl: './session-details.component.html',
  styleUrl: './session-details.component.css'
})
export class SessionDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  service: ServerService = inject(ServerService);
  details: SessionDetails;
  sessionId: string = '';

  clientChartOptions: any;
  sendChartOptions: any;
  recvChartOptions: any;
  highcharts: typeof Highcharts = Highcharts;

  constructor() {
    this.sessionId = this.route.snapshot.params['id'];
    this.service.getSessionDetails(this.sessionId)
      .subscribe((d) => {
        console.log(JSON.stringify(d));
        this.details = d;

        this.details.bandwidth.send.forEach((v, i) => this.details.bandwidth.send[i] = v / 1000);
        this.details.bandwidth.recv.forEach((v, i) => this.details.bandwidth.recv[i] = v / 1000);

        this.clientChart();
        this.sendChart();
        this.recvChart();
    });
    this.service.onRefresh.asObservable().subscribe((s) => {
      this.service.getSessionDetails(this.sessionId)
      .subscribe((d) => {
        console.log(JSON.stringify(d));
        this.details = d;

        this.details.bandwidth.send.forEach((v, i) => this.details.bandwidth.send[i] = v / 1000);
        this.details.bandwidth.recv.forEach((v, i) => this.details.bandwidth.recv[i] = v / 1000);

        this.clientChart();
        this.sendChart();
        this.recvChart();
      });
    });
    this.details = this.service.getSessionDetailsDefault();
  }

  maxClients(): number {
    let count = 0;
    let max = 0;
    for (let e of this.details.clientEvents) {
      if (e.eventType === ClientEventType.clientConnection) {
        count++;
        if (count > max)
            max = count;
      }
      else if (e.eventType === ClientEventType.clientDisconnection) {
        count--;
      }
    }
    return max;
  }

  totalSend(): number {
    let sum = 0;
    for (let n of this.details.bandwidth.send)
      sum += n;
    return sum;
  }

  maxSend(): number {
    let max = 0;
    for (let i of this.details.bandwidth.send) {
      if (i > max)
        max = i;
    }
    return max;
  }

  totalRecv(): number {
    let sum = 0;
    for (let n of this.details.bandwidth.recv) 
      sum += n;
    return sum;
  }

  maxRecv(): number {
    let max = 0;
    for (let i of this.details.bandwidth.recv) {
      if (i > max)
        max = i;
    }
    return max;
  }

  getAuthorityStr(id: number) {
    return id === this.details.authority ? "[host]" : "";
  }

  getClientCounts(): any[] {
    const counts: any[] = [];
    for (const e of this.details.clientEvents) {
      if (counts.length == 0) {
        counts.push({
          x: counts.length,
          y: 1,
          name: "client " + String(e.clientId) + " connects at " + (new Date(e.timestamp).toUTCString())
        });
      }
      else if (e.eventType === ClientEventType.clientConnection) {
        counts.push({
          x: counts.length,
          y: counts[counts.length - 1].y + 1,
          name: "client " + String(e.clientId) + " connects at " + (new Date(e.timestamp).toUTCString())
        });
      }
      else if (e.eventType === ClientEventType.clientDisconnection) {
        counts.push({
          x: counts.length,
          y: counts[counts.length - 1].y - 1,
          name: "client " + String(e.clientId) + " disconnects at " + (new Date(e.timestamp).toUTCString())
        });
      }
      else if (e.eventType === ClientEventType.hostMigration) {
        counts.push({
          x: counts.length,
          y: counts[counts.length - 1].y,
          name: "host migrated to " + String(e.clientId) + " at " + (new Date(e.timestamp).toUTCString())
        });
      }
    }
    return counts;
  }

  clientChart() {
    this.clientChartOptions = {
      chart:{
        type: 'line'
      },
      title:{
        text: ""
      },
      xAxis:{
        min: 0,
        max: this.details.clientEvents.length ?? 0,
        title:{
          text: "Ticks"
        }
      },
      yAxis:{
        min: 0,
        max: this.maxClients(),
        title:{
          text:"Client Count"
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        type: "area",
        name: "Clients",
        data: this.getClientCounts()
      }]
    };
  }

  sendChart() {
    this.sendChartOptions = {
      chart:{
        type: 'line'
      },
      title:{
        text: ""
      },
      xAxis:{
        min: 1,
        max: this.details.bandwidth.send.length,
        title:{
          text: "Seconds"
        }
      },
      yAxis:{
        min: 0,
        max: this.maxSend(),
        title:{
          text:"KB"
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        type: "area",
        name: "Sent KB",
        data: this.details.bandwidth.send.map((n, i) => {
          return {name: "", y:n, x: i+1}
        })
      }]
    };
  }

  recvChart() {
    this.recvChartOptions = {
      chart:{
        type: 'line'
      },
      title:{
        text: ""
      },
      xAxis:{
        min: 1,
        max: this.details.bandwidth.recv.length,
        title:{
          text: "Seconds"
        }
      },
      yAxis:{
        min: 0,
        max: this.maxRecv(),
        title:{
          text:"KB"
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        type: "area",
        name: "Received KB",
        data: this.details.bandwidth.recv.map((n, i) => {
          return {name: "", y:n, x: i+1}
        })
      }]
    };
  }
}
