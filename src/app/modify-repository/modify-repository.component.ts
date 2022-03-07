import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetails } from '../home/home.model';
import { ListingService } from '../_services/listing.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { RepoDetails } from './modify-repository.model';

@Component({
  selector: 'app-modify-repository',
  templateUrl: './modify-repository.component.html',
  styleUrls: ['./modify-repository.component.scss'],
})
export class ModifyRepositoryComponent implements OnInit {
  searchTerm?: string;
  myRepos: RepoDetails[] = [];
  allMyRepos: RepoDetails[] = [];
  searchRepos: RepoDetails[] = [];
  userdetails?: UserDetails;

  constructor(
    private http: HttpClient,
    private listingservice: ListingService,
    private tokenservice: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userdetails = this.tokenservice.getUser();

    this.listingservice.getFAQListByDepartment().subscribe((faqFetched) => {
      this.myRepos = faqFetched.data;
      this.allMyRepos = this.myRepos;
      this.searchRepos = faqFetched.data;
      console.log('faqs fetched from backend');
    });
  }

  search(value: string): void {
    if (value === '') this.myRepos = this.searchRepos;
    else {
      this.myRepos = this.allMyRepos?.filter((val) => {
        if (
          val.solution.toLowerCase().includes(value) == true ||
          val.query.toLowerCase().includes(value) == true ||
          val.id == value
        )
          return true;
        return false;
      });
    }
  }
}
