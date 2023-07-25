import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ArchiveDto } from 'src/app/models/archiveDto.model';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent {
  prescriptions: ArchiveDto[];

  constructor(private prescription: PrescriptionService, private toastr: ToastrService) { }

  public get api() {
    return env.api
  }
  ngOnInit() {
    this.getPrescriptions();
  }

  getPrescriptions() {
    this.prescription.GetPrescriptionByUserId(parseInt(localStorage.getItem('User.Id')), false).subscribe({
      next: (result) => {
        this.prescriptions = result;
      },
      error: () => {

        this.toastr.error('Erro ao recuperar prescrições', 'Erro')
      }
    })
  }

  changeVisibility(id: number, prescription: ArchiveDto) {
    this.prescription.changeVisibility(id, prescription.visibilidade).subscribe({
      next: (result) => {
        if (result) this.toastr.success('Visibilidade alterada com sucesso!', 'Sucesso')
        else {
          prescription.visibilidade = !prescription.visibilidade;
          this.toastr.error('Erro ao tentar alterar visibilidade', 'Erro')
        }
      },
      error:(error) => {
        debugger
        prescription.visibilidade = !prescription.visibilidade;
        this.toastr.error('Erro ao tentar alterar visibilidade', 'Erro')
      }
    })
  }
}
