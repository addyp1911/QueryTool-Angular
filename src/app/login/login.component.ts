import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  errorMessage = '';
  submitted = false;

  public loginForm = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl(''),
  });
  form: any = {
    email: null,
    password: null
  };
  constructor(public route: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService,
    private tokenStorage: TokenStorageService, private router: Router) {
    this.formBuilder = formBuilder;
    this.authService = authService;
    this.tokenStorage = tokenStorage;
  }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.email]],
        password: ['', ],
      }  
     );
      if (this.tokenStorage.getAccessToken() && this.tokenStorage.getAccessToken() != null) {
        this.isLoggedIn = true;
      }
  }

  loginUser(){
    this.submitted = true;
    if (this.loginForm.invalid) {
      console.log('invalid', this.loginForm.errors)
      Swal.fire({
        title: 'Error',
        text: 'Enter Proper Information',
        icon: 'error',
        confirmButtonColor: '#F47920',
    })
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.loginUserService(email, password).subscribe({
      next: (result: any) => {
        this.tokenStorage.saveAccessToken(result.token);
        this.tokenStorage.saveUser(result);
        this.isLoggedIn = true;
        this.router.navigate(['/home'])
        },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = err.error.message;
        this.isLoggedIn = false;
        Swal.fire({
          title: 'Error',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonColor: '#F47920',
      })
        },
      });
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }

  ngOnDestroy() {
  }
}
