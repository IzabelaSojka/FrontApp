import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!:FormGroup;
  constructor(
    private fb:FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService
    ){}

  ngOnInit(): void{
    this.signUpForm = this.fb.group ({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }
  hideShowPassword(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye": this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      const user = {
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password
      };
      this.auth.register(user).subscribe({
        next:(res)=>{
          this.signUpForm.reset();
          this.router.navigate(['login']);
        },
        error:(err)=>{
        },
      });
      
    } else {
      console.log("Form is invalid");
      ValidateForm.validateAllFormFields(this.signUpForm);
      this.toast.error({detail:"ERROR", summary:"Form is invalid"});
    }
  
    }
  
    
}
