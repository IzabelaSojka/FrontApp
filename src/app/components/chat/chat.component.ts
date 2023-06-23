import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user.store.service';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  public nameIdentidier!: number;
  public role!:string;

  public chatConnection!: signalR.HubConnection;
  public messages: string[] = [];
  public currentMessage: string = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private userStore: UserStoreService,
    private hubConnection: HubConnection
    ){}

  ngOnInit(){
    this.userStore.getNameFromStore()
    .subscribe(val=>{
      const nameIdentifierFromToken = this.auth.getNameIdentifierFromToken();
      this.nameIdentidier = val || nameIdentifierFromToken
    });
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('ws://0.0.0.0:5004/api/chat') // Adres URL do Huba na serwerze
      .build();

    this.hubConnection.on('ReceiveMessage', (message: string) => {
      this.messages.push(message);
    });

    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
        this.getAdminChat();
      })
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  sendMessage(): void {
    if (this.currentMessage) {
      this.hubConnection.invoke('SendMessage', 1, this.currentMessage, null)
        .catch(err => console.error('Error while sending message: ' + err));
      this.currentMessage = '';
    }
  }

  getAdminChat(): void {
    this.hubConnection.invoke('GetAdminChat', 1)
    .then((response: any) => {
      const chatId = response.chatId;
      const messages = response.messages;

      // Wyświetlanie otrzymanych wiadomości
      if (messages && messages.length > 0) {
        for (const message of messages) {
          this.messages.push(message.content);
        }
      } else {
        // Obsługa braku wiadomości
        this.messages.push('No new messages');
      }

      // Dołączanie do grupy czatu
      if (chatId) {
        this.hubConnection.invoke('JoinChatGroup', chatId)
          .catch(err => console.error('Error while joining chat group: ' + err));
      }
    })
    .catch(err => console.error('Error while getting admin chat: ' + err));
  }

  return() {
    this.router.navigate(['dashboard']);
  }
}
