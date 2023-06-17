import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Job, JobDelete, JobUpdate, Task } from 'src/app/models/task';
import ValidateForm from 'src/app/helpers/validateform';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/services/user.store.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public taskObj : Task = new Task();
  public taskArr : Job[] = [];
  public taskUpdate: JobUpdate = new JobUpdate();
  public taskDelete: JobDelete = new JobDelete();
  public role!:string;

  public editTaskValue : string = '';
  public emailaddress: string =""; 
  taskForm!:FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private userStore: UserStoreService,
    private toast: NgToastService,
    ) {
      this.expandedItems = new Array(this.taskArr.length).fill(false);
    }

  ngOnInit(){
    this.api.getAllTask()
    .subscribe(res=>{
      this.taskArr = res;
    });
    this.taskForm = this.fb.group({
      name_task: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.userStore.getNameFromStore()
    .subscribe(val=>{
      const emailaddressFromToken = this.auth.getEmailaddressFromToken();
      this.emailaddress = val || emailaddressFromToken
    });

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    })

    this.initializeExpandedItems();
  }
  expandedItems: boolean[] = [];
  initializeExpandedItems() {
    this.expandedItems = new Array(this.taskArr.length).fill(false);
  }

  isExpanded(index: number): boolean {
    return this.expandedItems[index];
  }

  toggleAccordion(index: number): void {
    this.expandedItems[index] = !this.expandedItems[index];
  }

  openModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    } 
  }

  CloseModel() {
    const modelDiv = document.getElementById('myModal');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    } 
  }

  openModel2() {
    const modelDiv = document.getElementById('myModal2');
    if(modelDiv!= null) {
      modelDiv.style.display = 'block';
    } 
  }

  CloseModel2() {
    const modelDiv = document.getElementById('myModal2');
    if(modelDiv!= null) {
      modelDiv.style.display = 'none';
    } 
  }

  fetchUserTasks() {
      this.api.getAllTask().subscribe(
        (tasks) => {
          console.log(tasks);
          this.taskArr = tasks;
          console.log(this.taskArr);
        },
        (error) => {
          console.error('Failed to fetch user tasks:', error);
        }
      );
    
  }

  addTask() {
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
      this.CloseModel();
      this.taskObj.Name = this.taskForm.value.name_task;
      this.taskObj.description = this.taskForm.value.description;
      this.taskObj.dueDate = this.taskForm.value.date;
      console.log(this.taskObj);
      this.api.addTask(this.taskObj).subscribe(
        (res) => {
          console.log('Form is valid. Save in database');
          this.ngOnInit();
          this.taskForm.reset();
        },
        (error) => {
        }
      );
    } else {
      console.log('Form is invalid');
      Object.values(this.taskForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }



  editTask() {
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
      this.CloseModel2();
      this.taskUpdate.name = this.taskForm.value.name_task;
      this.taskUpdate.description = this.taskForm.value.description;
      this.taskUpdate.dueDate = this.taskForm.value.date;
      console.log(this.taskUpdate);
      this.api.editTask(this.taskUpdate).subscribe(
        (res) => {
          console.log('Form is valid. Save in database');
          this.ngOnInit();
          this.taskForm.reset();
        },
        (error) => {
        }
      );
    } else {
      console.log('Form is invalid');
      Object.values(this.taskForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
    
  }

  changeStatus(task:any, newStatus:string) {
    this.taskUpdate.id = task.id;
    this.taskUpdate.name = task.name;
    this.taskUpdate.description = task.description;
    this.taskUpdate.dueDate = task.dueDate;
    this.taskUpdate.status = newStatus
    console.log(this.taskUpdate);
    this.api.editTask(this.taskUpdate).subscribe(
      (res) => {
        console.log('Update job. Save in database');
        this.ngOnInit();
        this.taskForm.reset();
      },
      (error) => {
      }
    );
  }
  fillForm(task: any) {
    this.taskForm.patchValue({
      name_task: task.name,
      description: task.description,
      date: task.dueDate
    });
    this.openModel2();
    this.taskUpdate.id = task.id;
    this.taskUpdate.name = this.taskForm.value.name_task;
    this.taskUpdate.description = this.taskForm.value.description;
    this.taskUpdate.dueDate = this.taskForm.value.date;
    this.taskUpdate.status = task.status;
  }
  
  delete(task: any) {
    this.taskDelete.id = task.id;
    this.api.deleteTask(this.taskDelete).subscribe(
      (res) => {
        console.log('Job deleted');
        this.ngOnInit();
        this.toast.success({detail:"SUCCESS", summary:"Job deleted!!", duration: 5000})
      },
      (error) => {
        console.log('nie działa');
      }
    );
  }

  logOut(){
    this.auth.signOut();
    this.router.navigate(['login']);
  }

  goChat(){
    this.router.navigate(['chat']);
  }


}
