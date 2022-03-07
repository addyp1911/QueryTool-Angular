import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from './../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private API_URL = environment.API_URL;
  private DEPARTMENT_LIST_API = this.API_URL + '/department/getAll';
  private CATEGORY_LIST_API = this.API_URL + '/category/getAll';
  private FILTERED_CATEGORY_LIST_API =
    this.API_URL + '/department/getAllCategories/';
  private FILTERED_SUBCATEGORY_LIST_API =
    this.API_URL + '/category/getAllSubCategories/';
  private FAQ_LIST_API = this.API_URL + '/faq/getAllFaq';
  private TICKET_LIST_API = this.API_URL + '/request/getAllByUser';
  private GET_REQUEST_BY_ID_API = this.API_URL + '/request/getById/';
  private GET_FAQ_BY_ID = this.API_URL + '/faq/';
  private TRENDING_QUERIES = this.API_URL + '/faq/trending/';
  private RECENTLY_ADDED_QUERIES = this.API_URL + '/faq/recentlyAdded/';
  private ASSIGNED_TICKET_LIST_API = this.API_URL + '/request/allAssignedToMe/';
  private TICKET_LIST_BY_DEPT_API = this.API_URL + '/request/getByDept/';
  private COMMENTS_BY_FAQ_LIST = this.API_URL + '/faq/getAllComment/';
  private ASSIGNEE_LIST_BY_DEPT_API = this.API_URL + '/user/resolvers';
  private GET_FAQ_BY_DEPARTMENT = this.API_URL + '/faq/getAllFaqByDepartment';
  private GET_ALL_SUB_CATEGORY = this.API_URL + '/subCategory/getAll';
  private FILTER_EXCEL = this.API_URL + '/tickets/export/excel';

  geturl: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  getDepartementsList(): Observable<any> {
    return this.http.get<any>(this.DEPARTMENT_LIST_API).pipe(
      tap((departmentFetched) => {
        console.log('Department list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('getDeptList'))
    );
  }

  getCategoryList(): Observable<any> {
    return this.http.get<any>(this.CATEGORY_LIST_API).pipe(
      tap((categoryFetched) => {
        console.log('Category list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('getCategoryList'))
    );
  }

  getSubCategoryList(): Observable<any> {
    return this.http.get<any>(this.GET_ALL_SUB_CATEGORY).pipe(
      tap((categoryFetched) => {
        console.log('Sub Category list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('getCategoryList'))
    );
  }

  getFilteredCategoryList(name: string): Observable<any> {
    return this.http.get<any>(this.FILTERED_CATEGORY_LIST_API + name).pipe(
      tap((filteredcategoryFetched) => {
        console.log('Filtered Category list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('getCategoryList'))
    );
  }

  getFilteredSubCategoryList(name: string): Observable<any> {
    return this.http.get<any>(this.FILTERED_SUBCATEGORY_LIST_API + name).pipe(
      tap((filteredsubcategoryFetched) => {
        console.log('Filtered SubCategory list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('getSubCategoryList'))
    );
  }

  getFAQList(): Observable<any> {
    return this.http.get<any>(this.FAQ_LIST_API).pipe(
      tap((faqlist) => {
        console.log('FAQ list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('FAQList'))
    );
  }

  getUserTicketsList(): Observable<any> {
    return this.http.get<any>(this.TICKET_LIST_API).pipe(
      tap((myticketlist) => {
        console.log('Ticket list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('myticketlist'))
    );
  }

  getUserTicketById(id: string): Observable<any> {
    return this.http.get<any>(this.GET_REQUEST_BY_ID_API + id.toString()).pipe(
      tap((myticketbyid) => {
        console.log('Ticket Details Fetched successfully..!');
      }),
      catchError(this.handleError<any>('myticket'))
    );
  }

  getTicketsByDept(deptname: string): Observable<any> {
    if (deptname) {
      this.geturl = this.TICKET_LIST_BY_DEPT_API + deptname.toString();
    } else {
      this.geturl = this.TICKET_LIST_BY_DEPT_API;
    }
    return this.http.get<any>(this.geturl).pipe(
      tap((ticketbydept) => {
        console.log('Ticket List Fetched successfully..!');
      }),
      catchError(this.handleError<any>('ticketbydept'))
    );
  }

  getFAQById(id: string): Observable<any> {
    return this.http.get<any>(this.GET_FAQ_BY_ID + id.toString()).pipe(
      tap((faqbyid) => {
        console.log('FAQ Details Fetched successfully..!');
      }),
      catchError(this.handleError<any>('faqbyid'))
    );
  }

  getUserComments(id: string): Observable<any> {
    return this.http.get<any>(this.COMMENTS_BY_FAQ_LIST + id.toString()).pipe(
      tap((faqbyid) => {
        console.log('FAQ Details Fetched successfully..!');
      }),
      catchError(this.handleError<any>('faqbyid'))
    );
  }

  getTrendingFaqs(): Observable<any> {
    return this.http.get<any>(this.TRENDING_QUERIES).pipe(
      tap((trendingfaqs) => {
        console.log('Trending FAQ Details Fetched successfully..!');
      }),
      catchError(this.handleError<any>('trendingfaqs'))
    );
  }

  getRecentlyAddedFaqs(): Observable<any> {
    return this.http.get<any>(this.RECENTLY_ADDED_QUERIES).pipe(
      tap((recentlyAdded) => {
        console.log('Recently added FAQ Details Fetched successfully..!');
      }),
      catchError(this.handleError<any>('recentlyAdded'))
    );
  }

  getAssignedTicketsList(): Observable<any> {
    return this.http.get<any>(this.ASSIGNED_TICKET_LIST_API).pipe(
      tap((myassignedicketlist) => {
        console.log('Assigned Ticket list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('myassignedicketlist'))
    );
  }

  getAssigneesbyDept(): Observable<any> {
    return this.http.get<any>(this.ASSIGNEE_LIST_BY_DEPT_API).pipe(
      tap((assigneelist) => {
        console.log('Assigned Ticket list Fetched successfully..!');
      }),
      catchError(this.handleError<any>('assigneelist'))
    );
  }

  getFAQListByDepartment(): Observable<any> {
    return this.http.get<any>(this.GET_FAQ_BY_DEPARTMENT).pipe(
      tap((faqlist) => {
        console.log('FAQ list by department Fetched successfully..!');
      }),
      catchError(this.handleError<any>('FAQList by department failed'))
    );
  }

  exportData() {
    return this.http.get(this.API_URL + '/tickets/export/excel/all', {
      responseType: 'blob',
    });
  }

  exportFilteredData(
    date: string,
    assignee?: string,
    trackingRequest?: string
  ) {
    let queryString = '?departmentName=HR&date=' + date;
    if (assignee) {
      queryString = queryString + '&' + assignee;
    }
    if (trackingRequest) {
      queryString = queryString + '&trackingRequest=' + trackingRequest;
    }

    console.log(queryString);

    return this.http.get(this.FILTER_EXCEL + queryString, {
      responseType: 'blob',
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      Swal.fire({
        title: 'Error',
        text: 'Unable to Fetch Data',
        icon: 'error',
        confirmButtonColor: '#F47920',
      });
      return of(result as T);
    };
  }
}
