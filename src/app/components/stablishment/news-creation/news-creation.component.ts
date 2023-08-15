import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-news-creation',
  templateUrl: './news-creation.component.html',
  styleUrls: ['./news-creation.component.scss']
})
export class NewsCreationComponent {

  title: string = '';
  text: string = '';
  imgSrc: File;
  modalRef?: BsModalRef;
  form = new FormData();
  
  constructor(private modalService: BsModalService, private toastr: ToastrService, private news: NewsService) {}
 
  ngOnInit() {
    if (localStorage.getItem('creation') != null) {
      this.toastr.success('Notícia criada com sucesso!');
      localStorage.removeItem('creation');
    }
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      {
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
        keyboard: false
      });
  }

  
  chooseImg(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imgSrc = e.target.result;
      };

      this.form.set('Imagem', file);
      var index = file.name.indexOf('.')
      var imageName = file.name.substring(0, index);
      this.form.set('ImagemUrl', imageName)
      reader.readAsDataURL(file);
    }
  }

  sendNews() {
    if (this.title == '') {
      this.toastr.error('Dê um título à notícia!');
      return
    }
    if (this.text == '') {
      this.toastr.error('Escreva a notícia!');
      return
    }
    if (!this.imgSrc) {
      this.toastr.error('Selecione uma imagem!');
      return
    }

    this.form.append('Titulo', this.title);
    this.form.append('Texto', this.text);
    this.form.append('DataCriacao', new Date().toDateString());
    this.form.append('EstabelecimentoId', localStorage.getItem('User.Id'))

    this.news.createNew(this.form).subscribe({
      next: (result) => {
        localStorage.setItem('creation', 'true');
        location.reload();
      },
      error:(error) => {
        this.toastr.error('Erro ao tentar criar notícia: ' + error.error);
      }
    })
  }
}
