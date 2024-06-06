import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, share } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayappapiService {
  PLAYAPP_URL: string = 'http://localhost:8080/'; 
  
  constructor(private http: HttpClient) { }

  getHolaMundo(): Observable<any>{
    return this.http.get(this.PLAYAPP_URL+'ai/holaMundo', { responseType: 'text' });
  }
}
