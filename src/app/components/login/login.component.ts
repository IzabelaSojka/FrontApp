import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastModule, NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user.store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!:FormGroup;
  constructor(
    private fb: FormBuilder, 
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    ){}

  ngOnInit(): void{
    this.loginForm = this.fb.group ({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPassword(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye": this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  onLogin() {
  if (this.loginForm.valid) {
    this.auth.login(this.loginForm.value).subscribe({
      next:(res)=>{
        console.log(res.accessToken)
        this.auth.storeToken(res.accessToken);
        let tokePayLoad = this.auth.decodeToken();
        this.toast.success({detail:"SUCCESS", summary:"Login Success!!", duration: 5000})
        this.loginForm.reset(),
        this.router.navigate(['dashboard'])
      },
      error:(err)=>{
        this.toast.error({detail:"ERROR", summary:"Wrong email or password!!"})
        alert(err?.error.message)
      },
    });
      
   
  } else {
    console.log("Form is invalid");
    ValidateForm.validateAllFormFields(this.loginForm);
    this.toast.error({detail:"ERROR", summary:"Form is valid!!"})
  }

  }

}
