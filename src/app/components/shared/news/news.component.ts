import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from 'src/app/services/news.service';

import { env } from 'src/environments/environment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent {
  newsList: any;
  selectedNews: any;
  modalRef?: BsModalRef;

  get api() {
    return env.api
  }

  constructor(private news: NewsService, private toastr: ToastrService, private modalService: BsModalService) {

  }

  ngOnInit() {
    this.getNews();
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.selectedNews = this.newsList.find(n => n.id == id);
    this.modalRef = this.modalService.show(template,
      {
        class: 'modal-md modal-dialog-centered',
        ignoreBackdropClick: true,
        keyboard: false
      });
  }

  getNews() {
    this.news.getNews().subscribe({
      next: (result) => {
        this.newsList = result
      },
      error: (error) => {
        this.toastr.error('Erro ao tentar recuperar notícias!');
      }
    })
  }
}
