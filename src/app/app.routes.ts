import { Routes } from '@angular/router';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        title: 'Admin Login'
    },
    {
        path: 'sessions',
        component: SessionListComponent,
        title: 'Session List'
    },
    {
        path: 'details/:id',
        component: SessionDetailsComponent,
        title: 'Session Details'
    }
];
