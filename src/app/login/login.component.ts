import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServerService } from '../server-service/server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private server: ServerService, private router: Router) {
    this.loginForm = this.fb.group({
      server: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { server, password } = this.loginForm.value;
      this.server.login(server, password).subscribe((result) => {
        console.log(JSON.stringify(result));
        if (result.accepted)
          this.router.navigate(['/sessions']);
      },
      (error) => {
        console.error('failed to login: ' + error);
      });
    }
  }
}
