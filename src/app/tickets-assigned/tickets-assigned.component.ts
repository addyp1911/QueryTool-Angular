import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MyTicket } from '../my-tickets/my-tickets.model';
import { ListingService } from '../_services/listing.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-tickets-assigned',
  templateUrl: './tickets-assigned.component.html',
  styleUrls: ['./tickets-assigned.component.scss'],
})
export class TicketsAssignedComponent implements OnInit {
  searchTerm?: string;
  myAssignedTickets: MyTicket[] = [];
  myAllAssignedTickets: MyTicket[] = [];
  searchTickets?: MyTicket[];
  selectedStatus: string = 'All';
  selectedAssignee: string = 'All';
  userdata: any;
  dept: any;
  selectedDate: string = 'All';
  allAssignees: any;
  selectedPriority: string = 'All';
  selectedStartDate: string = '';
  selectedEndDate: string = '';

  constructor(
    private http: HttpClient,
    private listingservice: ListingService,
    private tokenservice: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.listingservice
      .getAssigneesbyDept()
      .subscribe((allassigneesfetched) => {
        this.allAssignees = allassigneesfetched;
        console.log('assignees fetched from backend');
      });

    if (!this.tokenservice.getUserIsCoordinator()) {
      this.listingservice
        .getAssignedTicketsList()
        .subscribe((myassignedticketsfetched) => {
          this.myAssignedTickets = myassignedticketsfetched.data;
          this.myAllAssignedTickets = myassignedticketsfetched.data;
          this.searchTickets = myassignedticketsfetched.data;
          console.log('assigned tickets fetched from backend');
        });
    } else {
      this.userdata = this.tokenservice.getUser();
      if (this.userdata.department) {
        this.dept = this.userdata.department;
      } else {
        this.dept = '';
      }
      this.listingservice
        .getTicketsByDept(this.dept)
        .subscribe((myticketsbydept) => {
          this.myAssignedTickets = myticketsbydept.data;
          this.myAllAssignedTickets = myticketsbydept.data;
          this.searchTickets = myticketsbydept.data;
          console.log('assigned tickets fetched from backend');
        });
    }
  }

  search(value: string): void {
    if (value === '') this.myAssignedTickets = this.myAllAssignedTickets;
    else {
      this.myAssignedTickets = this.myAllAssignedTickets?.filter((val) => {
        if (
          val.ticketNumber.toLowerCase().includes(value) == true ||
          val.description.toLowerCase().includes(value) == true
        )
          return true;
        return false;
      });
    }
  }

  selected() {
    this.myAssignedTickets = this.myAllAssignedTickets?.filter((val) => {
      if (
        this.selectedStatus === 'All' &&
        this.selectedAssignee === 'All' &&
        this.selectedPriority === 'All' &&
        this.selectedDate === 'All' &&
        this.selectedAssignee === 'All'
      ) {
        return true;
      } else if (
        this.selectedStatus &&
        val.trackingStatus &&
        val.trackingStatus.toLowerCase() ===
          this.selectedStatus.toLowerCase() &&
        val.assignee &&
        this.selectedAssignee &&
        val.assignee === this.selectedAssignee &&
        val.priority &&
        this.selectedPriority &&
        val.priority === this.selectedPriority
      ) {
        return true;
      } else if (
        this.selectedStatus &&
        val.trackingStatus &&
        val.trackingStatus.toLowerCase() === this.selectedStatus.toLowerCase()
      ) {
        this.selectedAssignee = 'All';
        this.selectedDate = 'All';
        this.selectedPriority = 'All';
        return true;
      } else if (
        this.selectedPriority &&
        val.priority &&
        val.priority === this.selectedPriority
      ) {
        this.selectedAssignee = 'All';
        this.selectedDate = 'All';
        this.selectedStatus = 'All';
        return true;
      } else if (
        this.selectedAssignee &&
        val.assignedTo &&
        val.assignedTo === this.selectedAssignee
      ) {
        this.selectedStatus = 'All';
        this.selectedDate = 'All';
        this.selectedPriority = 'All';
        return true;
      } else if (
        this.selectedDate &&
        val.targetedDate &&
        this.selectedDate === val.targetedDate.split('T')[0]
      ) {
        this.selectedAssignee = 'All';
        this.selectedStatus = 'All';
        this.selectedPriority = 'All';
        return true;
      }
      return false;
    });
    this.searchTickets = this.myAssignedTickets;
  }

  downloadFile() {
    var mediaType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    // this.listingservice.exportData().subscribe((response) => {
    //   var blob = new Blob([response], { type: mediaType });

    //   let url = window.URL.createObjectURL(blob);
    //   let a = document.createElement('a');
    //   document.body.appendChild(a);
    //   a.setAttribute('style', 'display: none');
    //   a.href = url;
    //   a.download = 'report';
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   a.remove();
    // });

    let date = '2022-02-11';
    let assignee = '';
    let trackingRequest = '';
    if (this.selectedStartDate) {
      date = this.convert(this.selectedStartDate);
    }
    if (this.selectedAssignee != 'All') {
      assignee = this.selectedAssignee;
    }
    if (this.selectedStatus != 'All') {
      trackingRequest = this.selectedStatus;
    }
    this.listingservice
      .exportFilteredData(date + 'T00:00:00', assignee, trackingRequest)
      .subscribe((response) => {
        var blob = new Blob([response], { type: mediaType });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = 'report';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  }

  convert(str: string | number | Date) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  dateSelected() {
    this.selectedStatus = 'All';
    if (this.selectedEndDate && this.selectedStartDate) {
      let newDate1 = new Date(this.selectedEndDate.toString()).setHours(
        0,
        0,
        0,
        0
      );
      let newDate2 = new Date(this.selectedStartDate.toString()).setHours(
        0,
        0,
        0,
        0
      );
      this.myAssignedTickets = this.myAllAssignedTickets?.filter((val) => {
        let createdAt = new Date(val.createdAt).setHours(0, 0, 0, 0);
        console.log(createdAt, newDate2 + 'start', newDate1 + 'end');
        if (
          this.selectedEndDate &&
          createdAt <= newDate1 &&
          this.selectedStartDate &&
          createdAt >= newDate2
        ) {
          return true;
        }
        return false;
      });
      this.searchTickets = this.myAllAssignedTickets;
    } else if (
      this.selectedEndDate &&
      this.selectedStartDate &&
      this.selectedEndDate == this.selectedStartDate
    ) {
      let newDate1 = new Date(this.selectedStartDate.toString()).setHours(
        0,
        0,
        0,
        0
      );
      this.myAssignedTickets = this.myAllAssignedTickets?.filter((val) => {
        let createdAt = new Date(val.createdAt).setHours(0, 0, 0, 0);
        if (this.selectedStartDate && createdAt == newDate1) {
          return true;
        }
        return false;
      });
      this.searchTickets = this.myAssignedTickets;
    }
  }
}
