import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
//import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  isDev:boolean;

  constructor(private http:Http) {

  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
     //return this.http.post('api/register', user,{headers: headers})
    return this.http.post('http://localhost:3000/api/register', user,{headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/api/authenticate', user,{headers: headers})
    //return this.http.post('api/authenticate', user,{headers: headers})
      .map(res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
   return this.http.get('http://localhost:3000/api/profile',{headers: headers})
    //return this.http.get('api/profile',{headers: headers})
     .map(res => res.json());
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  updateUser(user){
   var headers = new Headers();
   headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/api/update/', JSON.stringify(user), {headers: headers})
      .map(res => res.json());
  }
/*
getUser(id){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   return this.http.get('http://localhost:3000/api/user/'+id,{headers: headers})
    //return this.http.get('api/profile',{headers: headers})
     .map(res => res.json());
  }
*/
getUsers() {
  let headers = new Headers();
    headers.append('Content-Type','application/json');
         return this.http.get('http://localhost:3000/api/get')
                    .map(res => res.json());
     }


   removeUser(id) {
       let headers = new Headers();
    headers.append('Content-Type','application/json');
         return this.http.delete("http://localhost:3000/api/delete/"+ id)
                .map(res => res.json());
     }   

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    if(this.authToken)
    return true;
  }

  // loggedIn(){
  // return tokenNotExpired();
  //}

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }



}
