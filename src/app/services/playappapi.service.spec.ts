import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlayappapiService, MessageResponse } from './playappapi.service';

describe('PlayappapiService', () => {
  let service: PlayappapiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlayappapiService]
    });
    service = TestBed.inject(PlayappapiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Mira que no haya solicitudes pending
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct response', () => {
    const mockMessage: MessageResponse = { message: 'Hello' };
    const mockResponse = { data: 'response' };

    service.getResponse(mockMessage).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('http://localhost:8080/v1/chat/getBeachesRecommended?message=Hello');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse); // simula responde del server
  });

  it('should handle error', () => {
    const mockMessage: MessageResponse = { message: 'Hello' };

    service.getResponse(mockMessage).subscribe(
      (response : any) => {fail('Expected an error, but received a valid response')},
      (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe('Not Found');
      }
    );
    const req = httpTestingController.expectOne('http://localhost:8080/v1/chat/getBeachesRecommended?message=Hello');
    expect(req.request.method).toEqual('GET');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
