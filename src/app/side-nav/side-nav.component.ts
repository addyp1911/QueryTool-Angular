import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  constructor(private tokenservice: TokenStorageService, private router: Router) {}

  ngOnInit(): void {
  }
 
  logoutUser() {
    this.tokenservice.signOut();
    this.router.navigate(['/login']);
    Swal.fire({
      title: 'Logged Out',
      text: 'You have Logged out Successfully',
      icon: 'success',
      confirmButtonColor: '#F47920',
  })
}


getUserIsRequester(){
  return this.tokenservice.getUserIsRequester()
}


}
