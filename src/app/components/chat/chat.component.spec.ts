import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { throwError, of } from 'rxjs';
import { PlayappapiService } from '../../services/playappapi.service';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: []
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(TestBed.inject(PlayappapiService), 'getResponse').and.callFake((message) => {
      // Simular una respuesta exitosa o un error según el mensaje
      if (message.message === 'error') {
        return throwError('Simulated error');
      } else {
        return of({ message: 'Simulated response' });
      }
    });
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle error from playappService.getResponse', () => {
    const errorMessage = '¡Vaya! Parece que estamos teniendo problemas con los ayudantes chorlitejos, inténtelo más tarde';
    const loadingMessage = { text: '', received: true, icon: 'support_agent', loading: true };
    component.answerMessage('error');
    expect(component.messages).toContain(jasmine.objectContaining(loadingMessage));
    expect(component.messages.some(msg => msg.text === errorMessage)).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should replace loading message with response message', () => {
    const responseMessage = 'Simulated response';
    const loadingMessage = { text: '', received: true, icon: 'support_agent', loading: true };
    component.answerMessage('test message');
    expect(component.messages).toContain(jasmine.objectContaining(loadingMessage));
    expect(component.messages.some(msg => msg.text === responseMessage)).toBe(true);
    expect(component.loading).toBe(false);
  });
});
