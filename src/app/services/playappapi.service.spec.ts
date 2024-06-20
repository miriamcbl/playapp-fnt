import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { PlayappapiService } from './playappapi.service';

describe('PlayappapiService', () => {
  let service: PlayappapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(PlayappapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
