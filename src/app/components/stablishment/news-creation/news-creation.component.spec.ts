import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCreationComponent } from './news-creation.component';

describe('NewsCreationComponent', () => {
  let component: NewsCreationComponent;
  let fixture: ComponentFixture<NewsCreationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsCreationComponent]
    });
    fixture = TestBed.createComponent(NewsCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
