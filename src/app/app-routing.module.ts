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

const routes: Routes = [
  {path: '', component: PresentationComponent},
  {path:'login', component: LoginComponent},
  {path:'register/:origin', component: RegisterComponent},
  {path: 'user', component: UserComponent, children: [
    {path: 'perfil', component: PerfilComponent},
    {path: 'schedules', component: SchedulesComponent},
    {path: 'prescriptions', component: PrescriptionsComponent}
  ]},
  {path: 'doctor', component: DoctorComponent, children: [
    {path: 'management', component: ManagementComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
