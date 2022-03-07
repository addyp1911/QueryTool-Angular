import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CreateService } from 'src/app/_services/create.service';
import { ListingService } from 'src/app/_services/listing.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.component.html',
  styleUrls: ['./faq-details.component.scss'],
})
export class FaqDetailsComponent implements OnInit {
  id: any = '';
  myFAQDetails: any;
  userdetails: any;
  commentsfetched: any;
  myFAQViewDetails: any;
  newComment: any;
  commentCount = 0;

  constructor(
    private http: HttpClient,
    private listingservice: ListingService,
    private tokenservice: TokenStorageService,
    private createservice: CreateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.listingservice.getFAQById(this.id).subscribe((myfaqdetailsfetched) => {
      this.myFAQDetails = myfaqdetailsfetched;
      console.log('my faq details fetched from backend');
      this.createservice
        .increaseViewCount(this.id)
        .subscribe((myfaqviewdetailsfetched) => {
          this.myFAQViewDetails = myfaqviewdetailsfetched;
        });
      console.log('view count added');
    });

    this.userdetails = this.tokenservice.getUser();
    this.id = this.route.snapshot.paramMap.get('id');
    this.listingservice.getUserComments(this.id).subscribe((comments) => {
      this.commentsfetched = comments;
      this.commentCount = comments.length;
      console.log(this.commentCount);
      console.log(comments.length);
      console.log('my comment details fetched from backend');
    });
  }

  calculateDiff(data: any) {
    let date = new Date(data.createdAt);
    let currentDate = new Date();
    let firstDate = moment(currentDate.getDate());
    let secondDate = moment(date.getDate());
    let days = Math.abs(firstDate.diff(secondDate, 'days'));
    if (days != 0) {
      return days.toString() + ' days ago';
    } else {
      return 'Today';
    }
  }

  comment() {
    this.newComment = { comment: this.newComment };
    this.createservice
      .addComments(this.id, this.newComment)
      .subscribe((comments) => {
        console.log('new comment added to backend');
        this.newComment = '';
        this.ngOnInit();
      });
  }

  Like(repo: any) {
    this.createservice
      .increaseLikeCount(repo.id)
      .subscribe((myfaqlikeetailsfetched) => {
        console.log(myfaqlikeetailsfetched.status);
        if (myfaqlikeetailsfetched.status) {
          this.ngOnInit();
        }
      });
  }

  onNavigate() {
    window.open(this.myFAQDetails.attachment.url, '_blank');
  }
}
