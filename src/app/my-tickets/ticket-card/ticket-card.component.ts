import { Component, Input, OnInit } from '@angular/core';
import { MyTicket } from '../my-tickets.model';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss'],
})
export class TicketCardComponent implements OnInit {
  @Input() ticket!: MyTicket;
  constructor() {}

  ngOnInit(): void {}
}
