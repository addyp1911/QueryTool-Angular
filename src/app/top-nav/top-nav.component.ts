import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FeedbackDialogComponent} from '../feedback-dialog/feedback-dialog.component';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})

export class TopNavComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(private dialog: MatDialog, private tokenStorageService: TokenStorageService) { }
  
  openDialog() {
    const dialogRef = this.dialog.open(FeedbackDialogComponent);
  }

  getUserIsRequester(){
    return this.tokenStorageService.getUserIsRequester()
  }
  

}
