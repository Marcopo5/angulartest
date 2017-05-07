import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/user";
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
private users: User[] = [];
  constructor(private authService: AuthService) { }

  ngOnInit() {
     this.authService.getUsers()
       .subscribe(response => this.users = response); 
  }


  deleteUser(user){
    if (confirm("Sei sicuro di voler cancellare " + user.name + "?")) {
      var index = this.users.indexOf(user);
      this.users.splice(index, 1);

      this.authService.removeUser(user._id)
        .subscribe(null,
          err => {
            alert("Could not delete user.");
            // Revert the view back to its original state
            this.users.splice(index, 0, user);
          });
    }
  }




}
