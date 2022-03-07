import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DeptCards, UserDetails } from '../home/home.model';
import { CreateService } from '../_services/create.service';
import { ListingService } from '../_services/listing.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-add-repository',
  templateUrl: './add-repository.component.html',
  styleUrls: ['./add-repository.component.scss'],
})
export class AddRepositoryComponent implements OnInit {
  userdetails?: UserDetails;
  allDepartments?: DeptCards[];
  allCategories: String[] = [];
  allSubCategories?: String[] = [];
  selectedDepartment: String = 'All';
  selectedCategory: String = 'All';
  selectedSubCategory: String = 'All';
  fileName = '';
  modifyRepoView = false;
  id: any = '';
  myFAQ: any;
  faqId: any;
  fileUrl = '';
  loader = false;

  constructor(
    private http: HttpClient,
    private listingservice: ListingService,
    private tokenservice: TokenStorageService,
    private router: Router,
    private createservice: CreateService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.modifyRepoView = true;
    } else {
      this.modifyRepoView = false;
    }
  }

  addNewRepoForm = new FormGroup({
    id: new FormControl(null),
    category: new FormControl(null, Validators.required),
    subCategory: new FormControl(null, Validators.required),
    department: new FormControl(null, Validators.required),
    query: new FormControl(null, Validators.required),
    solution: new FormControl(null),
    videoUrl: new FormControl(null, Validators.required),
    docUrl: new FormControl(null, Validators.required),
  });

  fileUpload = new FormGroup({
    fileSource: new FormControl(),
  });

  onFileChange(event: any) {
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileUpload.patchValue({
        fileSource: file,
      });
      this.fileName = file.name;
    }
  }

  ngOnInit(): void {
    this.userdetails = this.tokenservice.getUser();
    if (this.modifyRepoView) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.listingservice
        .getFAQById(this.id)
        .subscribe((myfaqdetailsfetched) => {
          this.myFAQ = myfaqdetailsfetched;
          console.log('my faq details fetched from backend');
          this.addNewRepoForm.patchValue({
            query: myfaqdetailsfetched.query,
            solution: myfaqdetailsfetched.solution,
            videoUrl: myfaqdetailsfetched.videoUrl,
            docUrl: myfaqdetailsfetched.docUrl,
            department: myfaqdetailsfetched.department,
            category: myfaqdetailsfetched.category,
            subCategory: myfaqdetailsfetched.subCategory,
          });
          this.selectedCategory = myfaqdetailsfetched.category;
          this.selectedDepartment = myfaqdetailsfetched.department;
          this.faqId = myfaqdetailsfetched.id;
          this.fileName = myfaqdetailsfetched.attachment?.fileName;
          this.fileUrl = myfaqdetailsfetched.attachment?.url;
          this.selectedSubCategory = myfaqdetailsfetched.subCategory;
          console.log(this.addNewRepoForm.value);

          this.listingservice
            .getFilteredCategoryList(this.selectedDepartment.toString())
            .subscribe((filteredCategories) => {
              this.allCategories = filteredCategories;
              console.log(
                'updated subcategory fetched from backend',
                this.allCategories
              );
            });
          this.listingservice
            .getFilteredSubCategoryList(this.selectedCategory.toString())
            .subscribe((filteredSubCategories) => {
              this.allSubCategories = filteredSubCategories;
              console.log(
                'updated subcategory fetched from backend',
                this.allSubCategories
              );
            });
        });
    } else {
      this.listingservice.getFAQListByDepartment().subscribe((faqFetched) => {
        if (faqFetched.data[0]) {
          this.selectedDepartment = faqFetched.data[0].department;
        } else {
          this.selectedDepartment = 'HR';
        }
        this.listingservice
          .getFilteredCategoryList(this.selectedDepartment.toString())
          .subscribe((filteredCategories) => {
            this.allCategories = filteredCategories;
            console.log('updated subcategory fetched from backend');
          });
        console.log('depts fetched from backend');
      });
    }
  }

  submitForm() {
    this.loader = true;
    if (this.modifyRepoView) {
      this.addNewRepoForm.patchValue({
        id: this.faqId,
      });
      this.createservice.modifyFAQ(this.addNewRepoForm.value).subscribe(
        (createdFAQ) => {
          if (this.fileUpload.get('fileSource')!.value) {
            console.log('here');
            const formData = new FormData();
            formData.append('file', this.fileUpload.get('fileSource')!.value);
            this.createservice
              .addAttachment(formData, createdFAQ.id)
              .subscribe(() => {
                Swal.fire({
                  title: 'FAQ Created',
                  text:
                    'Your FAQ with ID ' +
                    createdFAQ.id +
                    ' is updated succesfully',
                  icon: 'success',
                  confirmButtonColor: '#f47920',
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['/faq-details/' + createdFAQ.id]);
                    this.loader = false;
                  }
                });
              });
          } else {
            Swal.fire({
              title: 'FAQ Created',
              text:
                'Your FAQ with ID ' + createdFAQ.id + ' is updated succesfully',
              icon: 'success',
              confirmButtonColor: '#f47920',
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/faq-details/' + createdFAQ.id]);
                this.loader = false;
              }
            });
          }
          this.loader = false;
        },
        (err) => {
          Swal.fire({
            title: 'Error',
            text: err.error[0].errorMessage,
            icon: 'error',
            confirmButtonColor: '#F47920',
          });
          this.loader = false;
        }
      );
    } else {
      this.createservice.createNewFAQ(this.addNewRepoForm.value).subscribe(
        (createdFAQ) => {
          if (this.fileUpload.get('fileSource')!.value) {
            console.log('here');

            const formData = new FormData();
            formData.append('file', this.fileUpload.get('fileSource')!.value);
            this.createservice
              .addAttachment(formData, createdFAQ.id)
              .subscribe(() => {
                Swal.fire({
                  title: 'FAQ Created',
                  text:
                    'Your FAQ with ID ' +
                    createdFAQ.id +
                    ' is generated successfully',
                  icon: 'success',
                  confirmButtonColor: '#F47920',
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['/faq-details/' + createdFAQ.id]);
                    this.loader = false;
                  }
                });
              });
          } else {
            this.loader = false;
            Swal.fire({
              title: 'FAQ Created',
              text:
                'Your FAQ with ID ' +
                createdFAQ.id +
                ' is generated successfully',
              icon: 'success',
              confirmButtonColor: '#F47920',
              allowOutsideClick: false,
              allowEscapeKey: false,
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/faq-details/' + createdFAQ.id]);
                this.loader = false;
              }
            });
          }
        },
        (err) => {
          Swal.fire({
            title: 'Error',
            text: err.error[0].errorMessage,
            icon: 'error',
            confirmButtonColor: '#F47920',
          });
          this.loader = false;
        }
      );
    }
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

  deleteFaq(id: any) {
    Swal.fire({
      title: 'Delete FAQ',
      text: 'Are you sure you want to delete this ?',
      icon: 'error',
      confirmButtonColor: '#F47920',
      showDenyButton: true,
      denyButtonText: `Cancel`,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.createservice.deleteFAQ(id).subscribe((data) => {
          this.router.navigate(['/modify-repo']);
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Changes are not saved',
          text: '',
          icon: 'info',
          confirmButtonColor: '#F47920',
        });
      }
    });
  }
}
