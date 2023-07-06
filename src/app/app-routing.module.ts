import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { PresentationComponent } from './presentation/presentation.component';
import { SchedulesComponent } from './user/schedules/schedules.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PerfilComponent } from './shared/perfil/perfil.component';
import { ManagementComponent } from './doctor/management/management.component';
import { PrescriptionsComponent } from './user/prescriptions/prescriptions.component';

const routes: Routes = [
  {path: '', component: PresentationComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
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
