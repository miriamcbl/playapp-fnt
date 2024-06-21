import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { MessageResponse, PlayappapiService } from '../../services/playappapi.service';
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
  messages: { text: string, received: boolean, icon: string, loading?: boolean }[] = [];
  
  newMessageText: string = '';

  loading: boolean = false;

  constructor(private playappService: PlayappapiService){}

  // Módulo para que el chat siempre esté con el scroll abajo
  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  ngOnInit() { 
    this.scrollToBottom();
    this.answerMessage("Hola")
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
    this.answerMessage(this.newMessageText);
    //reestablecemos el input, 
    //para que no se quede guardado el último mensaje ahí
    this.newMessageText = '';
  }

  sendMessage() {    
    // mensaje del usuario. Se añaden al vector 
    // de mensajes de manera indefinida (bucle for del html)
    if (this.newMessageText.trim()) {
      this.messages.push({ text: this.newMessageText, received: false, icon: 'assets/face.png' });
    }
  }

  answerMessage(message: string){
    // Aquí creamos un objeto que cumpla con la interfaz MessageResponse
    const messageResponseObject: MessageResponse = { message: message };
    const loadingMessage = { text: '', received: true, icon: 'assets/chorli.png', loading: true };
    this.messages.push(loadingMessage);
    this.loading = true;
    // mensaje de la IA. Se llama a la API y luego se añade al vector de mensajes
    this.playappService.getResponse(messageResponseObject).subscribe({
      // Next se usa cada vez que se devuelve un valor. Maneja respuesta de la API
      next: (response: any) => {            
        this.replaceLoadingMessage(response.message);
        this.loading = false;
      },
      // Si el Observable encuentra error pasa por aquí
      error: (error) => {
        console.error('Error al obtener la respuesta de la API', error);
        this.replaceLoadingMessage('¡Vaya! Parece que estamos teniendo problemas con los ayudantes chorlitejos, inténtelo más tarde');
        this.loading = false;
      },
      // Cuando termina el Observable
      complete: () => {
         console.log('fin - observable - api');
      }
    });
  }

  // Módulo Spinner  
  replaceLoadingMessage(responseText: string) {
    // Reemplazamos el spinner por el mensaje de respuesta
    const loadingIndex = this.messages.findIndex(msg => msg.loading);
    if (loadingIndex !== -1) {
      this.messages[loadingIndex] = { text: responseText, received: true, icon: 'assets/chorli.png' };
    }
  }
}
