import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ListingService } from 'src/app/_services/listing.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from 'sweetalert2';
import { CreateService } from '../_services/create.service';

@Component({
  selector: 'app-query-details',
  templateUrl: './query-details.component.html',
  styleUrls: ['./query-details.component.scss'],
  providers: [DatePipe],
})
export class QueryDetailsComponent implements OnInit {
  public myDate = new Date();
  newDate: any;
  newtargetDate: any;
  targetDate: any;
  selectedDepartment: String = 'All';
  selectedCategory: String = 'All';
  selectedSubCategory: String = 'All';
  isDisabled: boolean = false;
  selectedFile: any;
  base64Data: any;
  imageUrl: any;
  userdetails: any;
  ticketDetails: any;
  id: any;
  statushistory: any;
  displayString: String = '';
  space: String = ' ';
  userType: string = '';
  allUsers: any;
  loader = false;
  allDepartments: any[] = [];

  updateStatusForm = new FormGroup({
    ticketStatus: new FormControl(null, Validators.required),
    comment: new FormControl('', Validators.required),
  });

  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private listingservice: ListingService,
    private createService: CreateService,
    private tokenservice: TokenStorageService,
    private route: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {
    this.displayString = '';
    this.id = this.route.snapshot.paramMap.get('id');
    this.listingservice
      .getUserTicketById(this.id)
      .subscribe((myticketdetailsfetched) => {
        this.ticketDetails = myticketdetailsfetched.data;
        this.myDate = new Date(this.ticketDetails.createdAt);
        this.newDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
        this.targetDate = new Date(this.myDate.getTime() + 1000 * 60 * 60 * 24 * 3);
        this.newtargetDate = this.datePipe.transform(this.targetDate, 'yyyy-MM-dd');

        this.statushistory = this.ticketDetails.requestTrackingList;
        this.displayString = '';
        for (let item of this.statushistory) {
          let dateTime = item.updateMessage.split(': ')[0];
          let remainingMessage = item.updateMessage.split(': ')[1];
          console.log(dateTime, remainingMessage);

          this.space = '';
          if (item.comment) {
            this.displayString +=
              this.space +
              '<b style="font-size: 14px">' +
              dateTime +
              '</b>: ' +
              remainingMessage +
              ' with comments as ' +
              item.comment +
              '<br>';
          } else {
            this.displayString +=
              this.space +
              '<b style="font-size: 14px">' +
              dateTime +
              '</b>: ' +
              remainingMessage +
              '<br>';
          }
        }
        console.log('my ticket details fetched from backend');
        if (this.ticketDetails.priority == 'P5') {
          this.targetDate = new Date(
            this.myDate.getTime() + 1000 * 60 * 60 * 24 * 5
          );
          this.newtargetDate = this.datePipe.transform(
            this.targetDate,
            'yyyy-MM-dd'
          );
        } else if (this.ticketDetails.priority == 'P4') {
          this.targetDate = new Date(
            this.myDate.getTime() + 1000 * 60 * 60 * 24 * 3
          );
          this.newtargetDate = this.datePipe.transform(
            this.targetDate,
            'yyyy-MM-dd'
          );
        } else if (this.ticketDetails.priority == 'P3') {
          this.targetDate = new Date(
            this.myDate.getTime() + 1000 * 60 * 60 * 24 * 2
          );
          this.newtargetDate = this.datePipe.transform(
            this.targetDate,
            'yyyy-MM-dd'
          );
        } else if (this.ticketDetails.priority == 'P2') {
          this.targetDate = new Date(
            this.myDate.getTime() + 1000 * 60 * 60 * 9
          );
          this.newtargetDate =
            this.datePipe.transform(this.targetDate, 'yyyy-MM-dd') +
            ' (9 hours)';
        } else if (this.ticketDetails.priority == 'P1') {
          this.targetDate = new Date(
            this.myDate.getTime() + 1000 * 60 * 60 * 3
          );
          this.newtargetDate =
            this.datePipe.transform(this.targetDate, 'yyyy-MM-dd') +
            ' (3 hours)';
        }
      });

    this.userdetails = this.tokenservice.getUser();
    if (this.tokenservice.getUserIsAdmin()) this.userType = 'ADMIN';
    if (this.tokenservice.getUserIsCoordinator()) this.userType = 'COORDINATOR';
    if (this.tokenservice.getUserIsRequester()) this.userType = 'REQUESTER';
    if (this.tokenservice.getUserIsResolver()) this.userType = 'RESOLVER';

    if (this.userType == 'COORDINATOR') {
      this.listingservice.getAssigneesbyDept().subscribe((data) => {
        this.allUsers = data;
      });
    }
    if (this.userType == 'COORDINATOR' || this.userType == 'RESOLVER') {
      this.listingservice.getDepartementsList().subscribe((data) => {
        console.log(data);
        this.allDepartments = data;
      });
    }
    this.userdetails = this.tokenservice.getUser();
    this.listingservice
      .getUserTicketById(this.id)
      .subscribe((myticketdetailsfetched) => {
        this.ticketDetails = myticketdetailsfetched.data;
        this.updateStatusForm.patchValue({
          ticketStatus: this.ticketDetails.trackingStatus,
        });
        console.log('my ticket details fetched from backend');
      });
  }

  updateAssignee(event: any, id: string) {
    this.createService
      .assignRequestToUser(id, event.target.value)
      .subscribe((data) => {
        console.log(data);
        Swal.fire({
          title: 'Ticket Assignment',
          text: data.data,
          timer: 2000,
        }).then(() => {
          this.ngOnInit();
        });
      });
  }

  updateStatus() {
    this.loader = true;
    var requestBody = {};
    if (
      this.userType == 'REQUESTER' &&
      (this.updateStatusForm.get('ticketStatus')?.value ==
        'PENDING_USER_ACTION' ||
        this.updateStatusForm.get('ticketStatus')?.value == 'RESOLVED')
    ) {
      requestBody = {
        comment: this.updateStatusForm.get('comment')?.value,
      };
    } else {
      requestBody = this.updateStatusForm.value;
    }

    this.createService
      .addComment(this.ticketDetails.ticketNumber, requestBody)
      .subscribe((data) => {
        Swal.fire({
          title: 'Status Update',
          text: 'Status Updated Succesfully',
          timer: 2000,
          confirmButtonColor: '#f47920',
        });
        this.updateStatusForm.reset();
        this.ngOnInit();
        this.loader = false;
      });
  }

  reRouteToDifferentDept(event: any, id: string) {
    this.createService
      .reRouteToOtherDepartment(id, event.target.value)
      .subscribe((data) => {
        console.log(data);
        Swal.fire({
          title: 'Ticket Assignment',
          text: data.data,
          timer: 2000,
        }).then(() => {
          this.ngOnInit();
        });
      });
  }
}
