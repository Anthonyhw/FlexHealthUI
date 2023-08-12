import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/shared/authentication/login/login.component';
import { RegisterComponent } from './components/shared/authentication/register/register.component';
import { PresentationComponent } from './components/presentation/presentation.component';
import { SchedulesComponent } from './components/user/schedules/schedules.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { PerfilComponent } from './components/shared/perfil/perfil.component';
import { ManagementComponent } from './components/doctor/management/management.component';
import { PrescriptionsComponent } from './components/user/prescriptions/prescriptions.component';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { registerGuard } from './guards/register.guard';
import { userGuard } from './guards/user.guard';
import { doctorGuard } from './guards/doctor.guard';
import { stablishmentGuard } from './guards/stablishment.guard';
import { isNotAuthenticatedGuard } from './guards/is-not-authenticated.guard';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { NewsComponent } from './components/shared/news/news.component';
import { NewsCreationComponent } from './components/stablishment/news-creation/news-creation.component';

const routes: Routes = [
  {path: '', component: PresentationComponent},
  {path:'login', canActivate: [isNotAuthenticatedGuard], component: LoginComponent},
  {path: 'news', component: NewsComponent},
  {path:'register', canActivateChild:[registerGuard], component: RegisterComponent, children:[
    {path: 'patient', component: RegisterComponent},
    {path: 'stablishment', component: RegisterComponent},
    {path: 'doctor', component: RegisterComponent}
  ]},
  {path: 'perfil', canActivate: [isAuthenticatedGuard], component: PerfilComponent},
  {path: 'user', canActivate: [userGuard], component: UserComponent, children: [
    {path: 'schedules', component: SchedulesComponent},
    {path: 'prescriptions', component: PrescriptionsComponent},
    {path: 'dashboard', component: DashboardComponent},
  ]},
  {path: 'doctor', canActivate: [doctorGuard], component: DoctorComponent, children: [
    {path: 'management', component: ManagementComponent},
    {path: 'dashboard', component: DashboardComponent},
  ]},
  {path: 'stablishment', canActivate: [stablishmentGuard], component: DoctorComponent, children: [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'news/creation', component: NewsCreationComponent}
  ]},
  {path:'404', component: PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
