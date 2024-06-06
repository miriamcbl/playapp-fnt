import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent {
  messages: { text: string, received: boolean, icon: string }[] = [
    { text: 'Hola, ¿qué quieres saber?', received: true, icon: 'support_agent' }
  ];
  
  newMessageText: string = '';
  sendMessage() {
    if (this.newMessageText.trim()) {
      console.log(this.newMessageText);
      // mensaje del usuario
      this.messages.push({ text: this.newMessageText, received: false, icon: 'face' });
      this.newMessageText = '';
  
      // respuesta automatica del chat
      setTimeout(() => {
        this.messages.push({ text: 'Estamos trabajando...', received: true, icon: 'support_agent' });
      }, 1000);
    }
  }
}
