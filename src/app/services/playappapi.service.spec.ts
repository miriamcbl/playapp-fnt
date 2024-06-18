import { TestBed } from '@angular/core/testing';

import { PlayappapiService } from './playappapi.service';

describe('PlayappapiService', () => {
  let service: PlayappapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayappapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
