import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlayappapiService {
  PLAYAPP_URL: string = 'http://localhost:8080/'; 
  
  constructor(private http: HttpClient) { }

  getResponse(message: MessageResponse):Observable<any>{
    let params = new HttpParams().set('message', message.message);
    return this.http.get(this.PLAYAPP_URL+'v1/chat/getBeachesRecommended', {params: params});
  }
}
