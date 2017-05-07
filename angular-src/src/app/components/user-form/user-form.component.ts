import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../shared/user';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BasicValidators } from '../shared/basic-validators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  user: User = new User();
 
  constructor(formBuilder: FormBuilder, 
    private usersService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) 
  
  {
this.form = formBuilder.group({
    //  _id: [],
      
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
     email: ['', [
        Validators.required,
        BasicValidators.email
        //Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      password: []
    });
  }


  ngOnInit() {
  var id = this.route.params.subscribe(params => {
      var id = params['id'];
     
        if (!id)
        return;

        
     this.usersService.getProfile().subscribe(profile => {
      this.user = profile.user;
      console.log (profile.user);
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
        userValue = this.form.value;
      
      userValue2 ["_id"] = this.user._id;
      userValue2 ["name"] = userValue.name;
      userValue2 ["email"] = userValue.email;
      userValue2 ["username"] = userValue.username;
      userValue2 ["password"] = userValue.password;
      console.log('uservalue2' + userValue2._id);
      result = this.usersService.updateUser(userValue2);
    

    result.subscribe(data => this.router.navigate(['dashboard']));
  }

}
