import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRepositoryComponent } from './add-repository/add-repository.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaqDetailsComponent } from './faq-details/faq-details.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ModifyRepositoryComponent } from './modify-repository/modify-repository.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import { QueryDetailsComponent } from './query-details/query-details.component';
import { TicketsAssignedComponent } from './tickets-assigned/tickets-assigned.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { desc: 'Login Page' } },
  {
    path: 'home',
    component: HomeComponent,
    data: { desc: 'Home Page' },
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { desc: 'Dashboard Page' },
    canActivate: [AuthGuard],
  },
  {
    path: 'create-ticket',
    component: CreateTicketComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-tickets',
    component: MyTicketsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'faq-details/:id',
    component: FaqDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ticket-details/:id',
    component: QueryDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'assigned-tickets',
    component: TicketsAssignedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'add-repo',
    component: AddRepositoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'modify-repo/:id',
    component: AddRepositoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'modify-repo',
    component: ModifyRepositoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
