import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingService } from 'src/app/_services/listing.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from 'sweetalert2';
import { CreateService } from '../_services/create.service';
import { DeptCards, FAQCards, RepoCards, UserDetails } from './home.model';
import { JoyrideService }from 'ngx-joyride';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  userdetails?: UserDetails;
  repos?: RepoCards[];
  allRepos?: RepoCards[];
  allFAQS?: FAQCards[];
  faqs?: FAQCards[];
  allDepartments?: DeptCards[];
  allCategories: String[] = [];
  allSubCategories?: String[] = [];
  selectedDepartment: String = 'All';
  selectedCategory: String = 'All';
  selectedSubCategory: String = 'All';
  searchRepo?: FAQCards[];
  trendingfaqs: any;
  recentfaqs: any;
  style: any;
  loader = false;
  lastDepartment: any = null;
  lastCategory: any = null;
  lastSubCategory: any = null;
  steps: any


  constructor(
    private http: HttpClient,
    private listingservice: ListingService,
    private tokenservice: TokenStorageService,
    private router: Router,
    private createservice: CreateService,
    private readonly joyrideService: JoyrideService,
  ) {}

  ngOnInit(): void {
    this.userdetails = this.tokenservice.getUser();

    this.listingservice.getFAQList().subscribe((faqFetched) => {
      this.faqs = this.sortByLikes(faqFetched.data);
      this.allFAQS = faqFetched.data;
      this.searchRepo = faqFetched.data;
      console.log('faqs fetched from backend', faqFetched.data);
    });

    this.listingservice.getDepartementsList().subscribe((deptFetched) => {
      this.allDepartments = deptFetched;
      console.log('depts fetched from backend');
    });

    this.listingservice.getCategoryList().subscribe((categoryFetched) => {
      for (let category of categoryFetched) {
        this.allCategories.push(category.name);
      }
      console.log('category fetched from backend');
    });

    this.listingservice.getTrendingFaqs().subscribe((trendingfaqsfetched) => {
      this.trendingfaqs = trendingfaqsfetched;
      console.log('trending faqs fetched from backend', this.trendingfaqs);
    });

    this.listingservice
      .getRecentlyAddedFaqs()
      .subscribe((recentfaqsfetched) => {
        this.recentfaqs = recentfaqsfetched;
        console.log('recent faqs fetched from backend', this.recentfaqs);
      });
  }

  onClick() {
    if(!this.getUserIsRequester()){
      this.steps = ['firstStep', 'secondStep', 'thirdStep', 'fourthStep', 'fifthStep', 'sixthStep']
    }
    else{
      this.steps =  ['firstStep', 'secondStep', 'thirdStep', 'fourthStep']
    }
    this.joyrideService.startTour({ 
      steps: this.steps,
      showPrevButton: true,
      stepDefaultPosition: 'top',
      themeColor: 'black',
      customTexts: {
        next: '>>',
        prev: '<<',
        done: 'DONE'
      }
  });
}


  search(value: string): void {
    this.loader = true;
    if (value.length > 0) {
      this.selectedCategory = 'All';
      this.selectedDepartment = 'All';
      this.selectedSubCategory = 'All';
      const requestData = {
        query: value,
        department: this.selectedDepartment,
        category: this.selectedCategory,
        subCategory: this.selectedSubCategory,
      };
      this.createservice.searchFaq(requestData).subscribe((data) => {
        this.faqs = this.sortByLikes(data);
        this.allFAQS = data;
        this.searchRepo = data;
        this.loader = false;
      });
    } else {
      this.listingservice.getFAQList().subscribe((faqFetched) => {
        this.faqs = this.sortByLikes(faqFetched.data);
        this.allFAQS = faqFetched.data;
        this.searchRepo = faqFetched.data;
        console.log('faqs fetched from backend');
      });
    }
    // if (value === '') this.faqs = this.searchRepo;
    // else {
    //   this.faqs = this.allFAQS?.filter((val) => {
    //     if (
    //       val.query.toLowerCase().includes(value) == true ||
    //       val.solution.toLowerCase().includes(value) == true
    //     )
    //       return true;
    //     return false;
    //   });
    // }
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

  selected(): void {
    this.faqs = this.allFAQS?.filter((val) => {
      if (
        val.department === this.selectedDepartment ||
        this.selectedDepartment === 'All'
      ) {
        return true;
      }
      return false;
    });
    this.searchRepo = this.faqs;
    if (this.selectedDepartment != 'All') {
      if (this.lastDepartment == this.selectedDepartment) {
        return;
      } else {
        this.allCategories = [];
        this.selectedCategory = 'All';
        this.selectedSubCategory = 'All';
        this.allSubCategories = [];
      }
      this.lastDepartment = this.selectedDepartment;
      this.listingservice
        .getFilteredCategoryList(this.selectedDepartment.toString())
        .subscribe((filteredCategories) => {
          this.allCategories = filteredCategories;
          console.log('updated category fetched from backend');
        });
    } else {
      this.allCategories = [];
      this.selectedCategory = 'All';
      this.selectedSubCategory = 'All';
      this.allSubCategories = [];
    }
  }

  selectCategory() {
    this.faqs = this.allFAQS?.filter((val) => {
      if (
        (val.department === this.selectedDepartment ||
          this.selectedDepartment === 'All') &&
        (val.category === this.selectedCategory ||
          this.selectedCategory === 'All')
      ) {
        return true;
      }
      return false;
    });
    this.searchRepo = this.faqs;
    if (this.selectedCategory != 'All') {
      if (this.lastCategory == this.selectedCategory) {
        return;
      }
      this.lastCategory = this.selectedCategory;

      this.listingservice
        .getFilteredSubCategoryList(this.selectedCategory.toString())
        .subscribe((filteredSubCategories) => {
          this.allSubCategories = filteredSubCategories;
          console.log('updated subcategory fetched from backend');
        });
    } else {
      this.allSubCategories = [];
      this.selectedSubCategory = 'All';
    }
  }

  selectSubCategory() {
    this.faqs = this.allFAQS?.filter((val) => {
      if (
        (val.department === this.selectedDepartment ||
          this.selectedDepartment === 'All') &&
        (val.category === this.selectedCategory ||
          this.selectedCategory === 'All') &&
        (val.subCategory === this.selectedSubCategory ||
          this.selectedSubCategory === 'All')
      ) {
        return true;
      }
      return false;
    });
    this.searchRepo = this.faqs;
  }

  logoutUser() {
    this.tokenservice.signOut();
    this.router.navigate(['/login']);
    Swal.fire({
      title: 'Logged Out',
      text: 'You have Logged out Successfully',
      icon: 'success',
      confirmButtonColor: '#F47920',
    });
  }

  sortByLikes(data: FAQCards[]): FAQCards[] {
    return data.sort((a, b) => (a.likes > b.likes ? -1 : 1));
  }

  getUserIsRequester(){
    return this.tokenservice.getUserIsRequester()
  }
}

