import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { CreateService } from 'src/app/_services/create.service';
import { ListingService } from 'src/app/_services/listing.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import Swal from 'sweetalert2';
import { FAQCards } from '../home/home.model';

interface DeptCards {
  deptId: number;
  name: string;
}

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  providers: [DatePipe],
})
export class CreateTicketComponent implements OnInit {
  public myDate = new Date();
  public targetDate = new Date(this.myDate.getTime() + 1000 * 60 * 60 * 24 * 3);
  newDate: any;
  newtargetDate: any;
  allDepartments?: DeptCards[];
  allCategories: String[] = [];
  allSubCategories?: String[] = [];
  selectedDepartment: String = 'All';
  selectedCategory: String = 'All';
  selectedSubCategory: String = 'All';
  initialValues: any;
  selectedFile: any;
  retrieveResonse: any;
  base64Data: any;
  imageUrl: any;
  control = new FormControl();
  FAQs: FAQCards[] = [];
  filteredFAQs!: Observable<FAQCards[]>;
  selectedPriority:string='All'
  formData: any

  constructor(
    private datePipe: DatePipe,
    private http: HttpClient,
    private listingservice: ListingService,
    private tokenservice: TokenStorageService,
    private router: Router,
    private createservice: CreateService
  ) {
    this.newDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    this.newtargetDate = this.datePipe.transform(this.targetDate, 'yyyy-MM-dd');
    this.createNewTicketForm.patchValue({
      createdDate: this.newDate,
      targetDate: this.newtargetDate,
      trackingStatus: 'CREATED',
    });
  }

  createNewTicketForm = new FormGroup({
    createdDate: new FormControl(null, Validators.required),
    targetDate: new FormControl(null, Validators.required),
    trackingStatus: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
    subCategory: new FormControl(null, Validators.required),
    query: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    priority: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    this.listingservice.getFAQList().subscribe((faqFetched) => {
      this.FAQs = faqFetched.data;
      this.filteredFAQs = this.createNewTicketForm
        .get('query')!
        .valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      console.log('faqs fetched from backend', this.FAQs);
    });
    
    this.initialValues  = {'createdDate': this.newDate, 'targetDate': this.newtargetDate, 'trackingStatus' : 'CREATED', 'selectedDepartment':'All', 'selectedCategory':'All', 'selectedSubCategory':'All'}
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
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    if (filterValue.length >= 1) {
      return this.FAQs.filter((option) =>
        option.query.toLowerCase().includes(filterValue)
      );
    }
    return [];
  }

  selectfunc() {
    if (this.selectedDepartment != 'All') {
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

    if (this.selectedCategory != 'All') {
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

  createTicket(){
    if (this.selectedPriority == "All"){
      this.createNewTicketForm.value["priority"] = "P5"
    }
    this.createservice
      .newOrder(this.createNewTicketForm.value)
      .subscribe((createdTicket) => {
        console.log('ticket created from backend');
        if (this.selectedFile) {
          this.createservice
          .addRequestAttachment(this.formData, createdTicket.ticketNumber)
          .subscribe(() => {    
              Swal.fire({
                title: 'Ticket Generated',
                text:
                  'Your ticket with ticket ID ' +
                  createdTicket.ticketNumber.toString() +
                  ' is generated successfully',
                icon: 'success',
                confirmButtonColor: '#F47920',
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/my-tickets']);
                }
              });
            });
        } 
        else{
          Swal.fire({
            title: 'Ticket Generated',
            text:
              'Your ticket with ticket ID ' +
              createdTicket.ticketNumber.toString() +
              ' is generated successfully',
            icon: 'success',
            confirmButtonColor: '#F47920',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/my-tickets']);
            }
          });
        }
      })
  }

  onSubmit() {
    if (this.selectedPriority == "All"){
      this.createNewTicketForm.value["priority"] = "P5"
    }
    let condition = (this.selectedDepartment  === "All" || this.selectedCategory === "All" || this.selectedSubCategory === "All")
    if(condition){
      this.createservice
      .getDeptCategorySubCategory(this.createNewTicketForm.value)
      .subscribe((data) => {
        Swal.fire({
          title: 'The department, category and subcategory of the ticket has been auto selected.',
          html:
            'Department : ' + '<b>' +  data.department + '</b>' + ' ' + 'Category : '
            + '<b>' + data.category  + '</b>' + ' '  + 'SubCategory : ' +  '<b>' + data.subCategory  + '</b>' + ' is selected successfully.',
          icon: 'success',
          confirmButtonColor: '#F47920',
          showDenyButton: true,
          denyButtonText: `Cancel`,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.selectedDepartment = data.department.toString()
            this.selectedCategory = data.category.toString()
            this.selectedSubCategory = data.subCategory.toString()
            this.ngOnInit()
            this.createNewTicketForm.value["department"] =  this.selectedDepartment
            this.createNewTicketForm.value["category"] = this.selectedCategory
            this.createNewTicketForm.value["subCategory"] = this.selectedSubCategory
            this.createTicket()
          }
          else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
          }
        });
      });
    }
    else{
      this.createTicket()
    }
  }

  clear() {
    this.createNewTicketForm.reset(this.initialValues);
  }

  public onFileChanged(event: any) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile)
    if (this.selectedFile !== undefined) {
      this.upload();
    }
  }

  upload() {
    this.formData = new FormData();
    this.formData.append('file', this.selectedFile);
  }

  selecttargetDate(priority:string){
    console.log(priority)
    if(priority == 'P5'){
      this.targetDate = new Date(this.myDate.getTime() + 1000 * 60 * 60 * 24 * 5);
      this.newtargetDate = this.datePipe.transform(this.targetDate, 'yyyy-MM-dd');
    }
    else  if(priority == 'P4'){
      this.targetDate = new Date(this.myDate.getTime() + 1000 * 60 * 60 * 24 * 3);
      this.newtargetDate = this.datePipe.transform(this.targetDate, 'yyyy-MM-dd');
    }
    else if(priority == 'P3'){
      this.targetDate = new Date(this.myDate.getTime() + 1000 * 60 * 60 * 24 * 2);
      this.newtargetDate = this.datePipe.transform(this.targetDate, 'yyyy-MM-dd');
    }
    else if(priority == 'P2'){
      this.targetDate = new Date(this.myDate.getTime() + 1000 * 60 * 60 * 9);
      this.newtargetDate = this.datePipe.transform(this.targetDate, 'yyyy-MM-dd') + " (9 hours)";
    }
    else if(priority == 'P1'){
      this.targetDate = new Date(this.myDate.getTime() + 1000 * 60 * 60 * 3);
      this.newtargetDate = this.datePipe.transform(this.targetDate, 'yyyy-MM-dd') + " (3 hours)";
    }

  }

  routeToQueryById(event: any) {
    this.router.navigateByUrl('/faq-details/' + event.option.id);
  }
}
