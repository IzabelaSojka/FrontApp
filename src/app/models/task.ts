export class Task {
    Name: string = '';
    description: string = '';
    dueDate: Date= new Date();
    Status: string = 'Planned';
}

export interface User {
    id: number;
    name: string;
    email: string;
  }

export interface Job{
    id: number;
    name: string;
    description: string;
    dueDate: Date;
    status: string;
}

export class JobUpdate{
    id!: number;
    name: string = '';
    description: string= '';
    dueDate!: Date;
    status: string = '';
}

export class JobDelete{
    id!: number;
}
