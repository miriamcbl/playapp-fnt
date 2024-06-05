import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: { text: string, received: boolean, icon: string }[] = [
    { text: 'Hola, ¿qué quieres saber?', received: true, icon: 'support_agent' }
  ];
  
  newMessageText: string = '';
  sendMessage() {
    if (this.newMessageText.trim()) {
      // Agregar el mensaje enviado por el usuario
      this.messages.push({ text: this.newMessageText, received: false, icon: 'face' });
      this.newMessageText = '';
  
      // Simulación de respuesta automática del chat
      setTimeout(() => {
        this.messages.push({ text: 'Estamos trabajando...', received: true, icon: 'support_agent' });
      }, 1000);
    }
  }
}
