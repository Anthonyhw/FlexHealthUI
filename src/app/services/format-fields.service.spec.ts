import { TestBed } from '@angular/core/testing';

import { FormatFieldsService } from './format-fields.service';

describe('FormatFieldsService', () => {
  let service: FormatFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
