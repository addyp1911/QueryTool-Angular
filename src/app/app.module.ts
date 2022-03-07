import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AddRepositoryComponent } from './add-repository/add-repository.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaqDetailsComponent } from './faq-details/faq-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ModifyRepositoryComponent } from './modify-repository/modify-repository.component';
import { RepoCardComponent } from './modify-repository/repo-card/repo-card.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { TicketCardComponent } from './my-tickets/ticket-card/ticket-card.component';
import { QueryDetailsComponent } from './query-details/query-details.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TicketsAssignedComponent } from './tickets-assigned/tickets-assigned.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { AuthGuard } from './_helpers/auth.guard';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { LoaderComponent } from './loader/loader.component';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMaterialRatingModule } from "ngx-material-rating";
import { JoyrideModule } from 'ngx-joyride';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    SearchFilterPipe,
    MyTicketsComponent,
    TicketCardComponent,
    SideNavComponent,
    TopNavComponent,
    CreateTicketComponent,
    QueryDetailsComponent,
    FaqDetailsComponent,
    TicketsAssignedComponent,
    AddRepositoryComponent,
    ModifyRepositoryComponent,
    RepoCardComponent,
    LoaderComponent,
    FeedbackDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    NgxMaterialRatingModule,
    JoyrideModule.forRoot(),
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [authInterceptorProviders, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
