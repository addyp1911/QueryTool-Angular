import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ListingService } from '../_services/listing.service';
import { MyTicket } from './my-tickets.model';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.scss'],
})
export class MyTicketsComponent implements OnInit {
  searchTerm?: string;
  myTickets: MyTicket[] = [];
  myAllTickets: MyTicket[] = [];
  searchTickets?: MyTicket[];
  selectedStatus: String = 'All';
  selectedStartDate: String = '';
  selectedEndDate: String = '';

  constructor(
    private http: HttpClient,
    private listingservice: ListingService
  ) {}

  ngOnInit(): void {
    this.listingservice.getUserTicketsList().subscribe((myticketsfetched) => {
      this.myTickets = myticketsfetched.data;
      this.myAllTickets = myticketsfetched.data;
      this.searchTickets = myticketsfetched.data;
      console.log('my tickets fetched from backend');
    });
  }

  search(value: string): void {
    if (value === '') this.myTickets = this.myAllTickets;
    else {
      this.myTickets = this.myAllTickets?.filter((val) => {
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
    this.selectedEndDate ='';
    this.selectedStartDate = '';
    this.myTickets = this.myAllTickets?.filter((val) => {
      if (
        val.trackingStatus === this.selectedStatus ||
        this.selectedStatus === 'All'
      ) {
        return true;
      }
      return false;
    });
    this.searchTickets = this.myTickets;
  }

  dateSelected() {
    this.selectedStatus = 'All';
    if(this.selectedEndDate && this.selectedStartDate){
      let newDate1 = new Date(this.selectedEndDate.toString()).setHours(0, 0, 0, 0)
      let newDate2 = new Date(this.selectedStartDate.toString()).setHours(0, 0, 0, 0)
      this.myTickets = this.myAllTickets?.filter((val) => {
        let createdAt = new Date(val.createdAt).setHours(0, 0, 0, 0)
        if( (this.selectedEndDate && createdAt <= newDate1) && (this.selectedStartDate && createdAt >= newDate2) ){
          return true;
        }
        return false;
    });
      this.searchTickets = this.myTickets;
    }
    else if (this.selectedEndDate && this.selectedStartDate && this.selectedEndDate == this.selectedStartDate){
      let newDate1 = new Date(this.selectedStartDate.toString()).setHours(0, 0, 0, 0)
      this.myTickets = this.myAllTickets?.filter((val) => {
        let createdAt = new Date(val.createdAt).setHours(0, 0, 0, 0)
        if( (this.selectedStartDate && createdAt == newDate1) ){
          return true;
        }   
    return false;
    });
  
      this.searchTickets = this.myTickets;
    }
    }
}
