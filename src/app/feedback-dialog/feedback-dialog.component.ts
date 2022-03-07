import {Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemePalette } from "@angular/material/core";
import { CreateService } from '../_services/create.service';
import Swal from 'sweetalert2';

type Rating = {
  value: number;
  max: number;
  color?: ThemePalette;
  disabled?: any;
  dense?: any;
  readonly?: any;
};


@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})
export class FeedbackDialogComponent implements OnInit {
  feedback:any
  feedbackForm = new FormGroup({
    feedback: new FormControl(null, Validators.required),
  });

  constructor(private createservice: CreateService) { }

  ngOnInit(): void {
  }
  ratings: Rating = 
    {
      value: 1,
      max: 5,
      color: "primary",
      dense: true
    }

    submitFeedback(){
      console.log(this.feedback, this.ratings.value)
      this.createservice.addFeedback(this.ratings.value.toString(), this.feedback).subscribe((data) => {
      console.log(data)
      Swal.fire({
        title: 'Feedback Submitted',
        text:
          'Your feedback is submitted successfully',
        icon: 'success',
        confirmButtonColor: '#F47920',
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    })
  }
}
