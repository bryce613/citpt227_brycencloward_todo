import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, NavController, IonItemSliding } from '@ionic/angular';
import { Task } from './task';
import { AngularFireDatabase, AngularFireList }  from 'angularfire2/database'; //firebase import
import { Observable } from 'rxjs'; //observable import

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  taskList: AngularFireList<Task>; //new taskList variable
  tasks: Observable<any[ ]>; //adjust the task array

  constructor(
    public alertCtrl: AlertController,
    public af: AngularFireDatabase //added from notes
    ) { //page 80
    // this.tasks = [ //add some starting tasks
    //   {title:'Milk', status: 'open'},
    //   {title:'Eggs', status: 'open'},
    //   {title:'Syrup', status: 'open'},
    //   {title:'Pancake Mix', status: 'open'}
    // ];
    this.taskList = this.af.list('/tasks'); //tasks refers to how we sort the data on Firebase.
    this.tasks = this.taskList.valueChanges();
  }

  async addItem() { //use Alerts instead of prompts
    let alert = await this.alertCtrl.create ({
      header: "New Task",
      message: "Create new task",
      inputs: [{
        name: 'taskName',
        type: 'text'
      }],
      buttons: [{
        text: 'Save', //save button
        handler: data => {
          //this.tasks.push({ title: data.taskName, status: 'open' });
          let newTaskRef = this.taskList.push( //make a new task with user input
            { id: '', title: data.taskName, status: 'open' }
            );
            newTaskRef.update( { id: newTaskRef.key } );
        }
      },{
        text: 'Cancel', //cancel button
        role: 'cancel'
      }]
    });
    alert.present();
  }

  markAsDone(slidingItem: IonItemSliding, task: any) {
    task.status = "done";
    slidingItem.close(); //back to normal view
    this.taskList.update( task.id, task );
  }

  removeTask(slidingItem: IonItemSliding, task: any) {
    task.status = "removed";
    // let index = this.tasks.indexOf(task);
    // if (index > -1) {
    //   this.tasks.splice(index, 1);
    // }
    this.taskList.remove( task.id );
    slidingItem.close(); //back to normal view
  }

  ngOnInit() {
  }
}
