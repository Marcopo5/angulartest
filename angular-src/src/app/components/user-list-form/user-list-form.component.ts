import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormsModule, Validators } from '@angular/forms';
import { User } from '../../shared/user';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-list-form',
  templateUrl: './user-list-form.component.html',
  styleUrls: ['./user-list-form.component.css']
})
export class UserListFormComponent implements OnInit {
 form: FormGroup;
roles = ['admin', 'levelone'];
user: User = new User();

  constructor(formBuilder: FormBuilder, 
    private usersService: AuthService,
    private router: Router,
    private route: ActivatedRoute


  ) { 
this.form = formBuilder.group({
    //  _id: [],
      
      name: [''],
     email: [''],
      role: ['']
    });

  }

  ngOnInit() {
var id = this.route.params.subscribe(params => {
      var id = params['id'];
     console.log (id)
        if (!id)
        return;

     this.usersService.getUser(id).subscribe(user => {
      this.user = user;
      console.log (user);
    },
    err => {
      console.log(err);
      return false;
    });
   

    });



  }

  save() {
    var result,
        userValue2: User = new User(),
       
      userValue2=this.user;
      userValue2 ["role"] = this.form.value.role;
      result = this.usersService.updateUser(userValue2);
    

    result.subscribe(data => this.router.navigate(['dashboard']));
  }


}
