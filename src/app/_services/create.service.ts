import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreateService {
  private API_URL = environment.API_URL;
  private TICKET_CREATE_API = this.API_URL + '/request/create';
  private ADD_FAQ_VIEWS_FOR_TRENDING_FAQS = this.API_URL + '/faq/addViews/';
  private FAQ_LIKE_API = this.API_URL + '/faq/like/';
  private CREATE_FAQ = this.API_URL + '/faq/create';
  private MODIFY_FAQ = this.API_URL + '/faq/edit';
  private ADD_ATTACHMENT = this.API_URL + '/attachment/upload/faq/';
  private ADD_REQUEST_ATTACHMENT = this.API_URL + '/attachment/upload/request/';
  private ADD_COMMENT_API = this.API_URL + '/faq/comment/';
  private ASSIGN_TO_USER = this.API_URL + '/request/';
  private RE_ROUTE_TO_ANOTHER_DEPARTMENT = this.API_URL + '/request/';
  private ADD_COMMENT = this.API_URL + '/request/comment/add/';
  private GET_DEPT_CATEGORY_SUBCATEGORY_API =
    this.API_URL + '/request/filterSuggestion';
  private FETCH_ALL_USERS_BY_DEPARTMENT = this.API_URL + '/user/resolvers';
  private SEARCH_FAQ = this.API_URL + '/faq/search/byFilters';
  private DELETE_FAQ = this.API_URL + '/faq/delete/';
  private ADD_FEEDBACK = this.API_URL + '/toolFeedback/add';

  constructor(private http: HttpClient) {}

  newOrder(submittedForm: any): Observable<any> {
    let posturl = this.TICKET_CREATE_API;
    return this.http.post<any>(posturl, submittedForm).pipe(
      tap((faqlist) => {
        console.log('ticket created successfully..!');
      }),
      catchError(this.handleError<any>('ticket'))
    );
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

  increaseViewCount(id: string): Observable<any> {
    let posturl = this.ADD_FAQ_VIEWS_FOR_TRENDING_FAQS + id.toString();
    return this.http.post<any>(posturl, '').pipe(
      tap((faq_view_count) => {
        console.log('FAQ View Count Added successfully..!');
      }),
      catchError(this.handleError<any>('FAQ View Count'))
    );
  }

  increaseLikeCount(id: string): Observable<any> {
    let posturl = this.FAQ_LIKE_API + id.toString();
    return this.http.post<any>(posturl, '').pipe(
      tap((faq_like_count) => {
        console.log('FAQ Like Count Added successfully..!');
      }),
      catchError(this.handleError<any>('FAQ Like Count'))
    );
  }

  addComments(id: String, commentData: String): Observable<any> {
    let posturl = this.ADD_COMMENT_API + id.toString();
    console.log(commentData, 'ahbdfbhjabdjha');
    return this.http.post<any>(posturl, commentData).pipe(
      tap((add_comment) => {
        console.log('Comment Added successfully..!');
      }),
      catchError(this.handleError<any>('Comment Added'))
    );
  }

  addFeedback(rating: String, desc: String): Observable<any> {
    let posturl = this.ADD_FEEDBACK;
    let formData = { starRating: rating, description: desc };
    return this.http.post<any>(posturl, formData).pipe(
      tap((feedback) => {
        console.log('Feedback Added successfully..!');
      }),
      catchError(this.handleError<any>('Feedback Added'))
    );
  }

  createNewFAQ(addNewRepoFormData: any): Observable<any> {
    return this.http.post<any>(this.CREATE_FAQ, addNewRepoFormData).pipe(
      tap((response) => {
        console.log('FAQ created succesfully');
      })
      // catchError(this.handleError<any>('FAQ created'))
    );
  }

  modifyFAQ(addNewRepoFormData: any): Observable<any> {
    return this.http.post<any>(this.MODIFY_FAQ, addNewRepoFormData).pipe(
      tap((response) => {
        console.log('FAQ created succesfully');
      })
      // catchError(this.handleError<any>('FAQ created'))
    );
  }

  addAttachment(formData: FormData, id: string): Observable<any> {
    let posturl = this.ADD_ATTACHMENT + id.toString();
    return this.http.post<any>(posturl, formData).pipe(
      tap((response) => {
        console.log('Attachment added succesfully');
      }),
      catchError(this.handleError<any>('Failed to upload attachment'))
    );
  }

  addRequestAttachment(formData: FormData, id: string): Observable<any> {
    let posturl = this.ADD_REQUEST_ATTACHMENT + id.toString();
    return this.http.post<any>(posturl, formData).pipe(
      tap((response) => {
        console.log('Attachment added succesfully for ticket');
      }),
      catchError(this.handleError<any>('Failed to upload attachment'))
    );
  }

  assignRequestToUser(ticketId: string, userEmail: string): Observable<any> {
    let putUrl = this.ASSIGN_TO_USER + ticketId + '/assignTo/' + userEmail;
    return this.http.put<any>(putUrl, {}).pipe(
      tap((response) => {
        console.log('FAQ created succesfully');
      }),
      catchError(this.handleError<any>('Failed to upload attachment'))
    );
  }

  addComment(ticketId: string, formData: any): Observable<any> {
    let postUrl = this.ADD_COMMENT + ticketId;
    return this.http.post<any>(postUrl, formData).pipe(
      tap((response) => {
        console.log('FAQ created succesfully');
      }),
      catchError(this.handleError<any>('Failed to upload attachment'))
    );
  }

  getDeptCategorySubCategory(formData: any): Observable<any> {
    return this.http
      .post<any>(this.GET_DEPT_CATEGORY_SUBCATEGORY_API, formData)
      .pipe(
        tap((assigneelist) => {
          console.log('Assigned Ticket list Fetched successfully..!');
        }),
        catchError(this.handleError<any>('assigneelist'))
      );
  }
  searchFaq(data: any): Observable<any> {
    let postUrl = this.SEARCH_FAQ;
    console.log(data);
    return this.http.post<any>(postUrl, data).pipe(
      tap((response) => {
        console.log('FAQ fetched succesfully');
      }),
      catchError(this.handleError<any>('Failed to Filter FAQ'))
    );
  }

  deleteFAQ(id: any): Observable<any> {
    let deleteUrl = this.DELETE_FAQ;
    console.log(id);
    return this.http.delete<any>(deleteUrl + id).pipe(
      tap((response) => {
        console.log('FAQ deleted successfully');
      }),
      catchError(this.handleError<any>('Failed to delete FAQ'))
    );
  }

  reRouteToOtherDepartment(ticketId: string, department: any): Observable<any> {
    let putUrl =
      this.RE_ROUTE_TO_ANOTHER_DEPARTMENT + ticketId + '/reRoute/' + department;
    return this.http.put<any>(putUrl, {}).pipe(
      tap((response) => {
        console.log('Re routed to diffrent department ');
      }),
      catchError(
        this.handleError<any>('Failed to re route to different department')
      )
    );
  }
}
