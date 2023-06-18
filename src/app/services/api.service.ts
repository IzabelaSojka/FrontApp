import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job, JobDelete, JobUpdate, PasswordChange, Task} from '../models/task';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://localhost:7022/api/';
  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { }
 
  addTask(task : Task) : Observable<Task> {
    var headers = new HttpHeaders().set("Authorization", 'Bearer ' + this.auth.getToken());
    return this.http.post<Task>(`/api/createJob`,task ,{headers});
  }

  getAllTask() : Observable<Job[]> {
    var headers = new HttpHeaders().set("Authorization", 'Bearer ' + this.auth.getToken());
    return this.http.get<Job[]>(`/api/readJob`,{headers});
  }

  deleteTask(task : JobDelete) : Observable<JobDelete> {
    var headers = new HttpHeaders().set("Authorization", 'Bearer ' + this.auth.getToken());
    return this.http.post<JobDelete>(`/api/deleteJob`,task, {headers});
  }

  editTask(task : JobUpdate) : Observable<JobUpdate> {
    var headers = new HttpHeaders().set("Authorization", 'Bearer ' + this.auth.getToken());
    return this.http.put<JobUpdate>(`/api/updateJob`, task, {headers});
  }

  changePassword(password : PasswordChange) : Observable<PasswordChange> {
    var headers = new HttpHeaders().set("Authorization", 'Bearer ' + this.auth.getToken());
    return this.http.put<PasswordChange>(`/api/changePassword`, password, {headers});
  }
}
