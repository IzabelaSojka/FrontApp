import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user.store.service';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ChatMessage} from 'src/app/models/task';
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
  public chatId: string = '';
  public senderId: number[] = [];


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
      .withUrl('/api/chat', signalR.HttpTransportType.ServerSentEvents) // Adres URL do Huba na serwerze
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.hubConnection.on('Tomek', (message: string) => {
      const chatMessage: ChatMessage  = JSON.parse(message);
      this.messages.push(chatMessage.Content);
      this.chatId = chatMessage.ChatId;
      this.senderId.push(chatMessage.SenderId);
      console.log(message)
    });

    this.hubConnection.start()
      .then(() => {
        console.log('Connection started');
      })
      .catch(err => console.error('Error while starting connection: ' + err));

  }

  sendMessage(): void {
    if (this.currentMessage) {
      this.hubConnection.invoke('SendMessage', JSON.parse(this.nameIdentidier.toString()), this.currentMessage, this.chatId)
        .catch(err => console.error('Error while sending message: ' + err));
      this.currentMessage = '';
    }
  }

  registerToQueue():void{
    this.hubConnection.invoke('RegisterToQueue', JSON.parse(this.nameIdentidier.toString()), "test")
    .then((response: any)=>{
      console.log(response);
    })
    .catch(err => console.error('Error while getting chat: ' + err));
  }

  getAdminChat(): void {
    this.hubConnection.invoke('GetAdminChat', JSON.parse(this.nameIdentidier.toString()))
    .then((response: any) => {
      this.messages = [];
      const chatId = response.chatid;

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
