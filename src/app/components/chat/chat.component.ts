import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { PlayappapiService } from '../../services/playappapi.service';
import { HttpClientModule } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  // Spinner
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class ChatComponent implements OnInit, AfterViewChecked{
  messages: { text: string, received: boolean, icon: string, loading?: boolean }[] = [
    { text: 'Hola, ¿qué quieres saber?', received: true, icon: 'support_agent' }
  ];
  
  newMessageText: string = '';

  loading: boolean = false;

  constructor(private playappService: PlayappapiService){}

  // Módulo para que el chat siempre esté con el scroll abajo
  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  ngOnInit() { 
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }


  // Módulo comunicación
  getMessagesCommunication(){
    this.sendMessage();
    this.answerMessage();
    //reestablecemos el input, 
    //para que no se quede guardado el último mensaje ahí
    this.newMessageText = '';
  }

  sendMessage() {    
    // mensaje del usuario. Se añaden al vector 
    // de mensajes de manera indefinida (bucle for del html)
    if (this.newMessageText.trim()) {
      this.messages.push({ text: this.newMessageText, received: false, icon: 'face' });
    }
  }

  answerMessage(){
    const loadingMessage = { text: '', received: true, icon: 'support_agent', loading: true };
    this.messages.push(loadingMessage);
    this.loading = true;
    // mensaje de la IA. Se llama a la API y luego se añade al vector de mensajes
    if (this.newMessageText.toLowerCase().includes('hola')) {
      console.log('en el if ' + this.newMessageText);
      this.playappService.getHolaMundo().subscribe(
        (response: any) => {            
          this.replaceLoadingMessage(response);
          this.loading = false;
        },
        (error) => {
          console.error('Error al obtener la respuesta de la API', error);
          this.replaceLoadingMessage('Error al obtener la respuesta de la API');
          this.loading = false;
        }
      );
    } else {
      console.log('en el else ' + this.newMessageText);
      setTimeout(() => {
        this.replaceLoadingMessage('Estamos trabajando...');
        this.loading = false;
      }, 3000);
    }
  }

  // Módulo Spinner  
  replaceLoadingMessage(responseText: string) {
    // Reemplazamos el spinner por el mensaje de respuesta
    const loadingIndex = this.messages.findIndex(msg => msg.loading);
    if (loadingIndex !== -1) {
      this.messages[loadingIndex] = { text: responseText, received: true, icon: 'support_agent' };
    }
  }
}
