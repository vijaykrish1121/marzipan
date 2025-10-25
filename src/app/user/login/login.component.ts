import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email:string='';
  pswd:string='';
  msg:string='';
   constructor(private router: Router){}
 checkUser(){
            if (this.email=='vijay' && this.pswd=='1234'){
                // this.msg= 'password matched';
                this.router.navigate(['/register'])
       }
       else
        this.msg= 'not matched'
  }
 
}
