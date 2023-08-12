import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { CollapseModule } from 'ngx-bootstrap/collapse'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HeaderComponent } from './components/shared/header/header.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/shared/authentication/login/login.component';
import { RegisterComponent } from './components/shared/authentication/register/register.component';
import { UserComponent } from './components/user/user.component';
import { PresentationComponent } from './components/presentation/presentation.component';
import { SchedulesComponent } from './components/user/schedules/schedules.component';
import { DoctorComponent } from './components/doctor/doctor.component';
import { PerfilComponent } from './components/shared/perfil/perfil.component';
import { ManagementComponent } from './components/doctor/management/management.component';
import { PrescriptionsComponent } from './components/user/prescriptions/prescriptions.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InterceptorModule } from './interceptors/interceptor.module';
import { DashboardComponent } from './components/shared/dashboard/dashboard.component';
import { NewsComponent } from './components/shared/news/news.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    PresentationComponent,
    SchedulesComponent,
    DoctorComponent,
    PerfilComponent,
    ManagementComponent,
    PrescriptionsComponent,
    DashboardComponent,
    NewsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    PdfViewerModule,
    InterceptorModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
