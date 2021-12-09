import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantProvider } from '../constant/constant';
import * as jwt_decode from "jwt-decode";
import { Storage } from '@ionic/storage';



@Injectable()
export class DbserviceProvider {
  token_value:any = "";
  tokenInfo:any;
  user_id:any;
  karigar_id:any='';
  karigar_status:any='';
  karigar_info:any='';

  protected token_data : any;
  constructor(public http: HttpClient, private constant:ConstantProvider,public http1:HttpClient, public storage: Storage) 
  {
    console.log('Hello DbserviceProvider Provider');
    this.token();
  }
  set_token_value(value)
  {
    this.token_data=value;
  }
  get_token_data()
  {
    return this.token_data
  }
  token()
  {
    console.log('token');
    this.storage.get('token').then((val) => {
      this.token_value = val;
      this.tokenInfo = this.getDecodedAccessToken(this.token_value);
      if( this.tokenInfo)
      {
        this.karigar_id=this.tokenInfo.sub;
        console.log(this.karigar_id);
      }
    });
   }

  
  
  get_rqst(fn:any):any {
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('Token', 'Bearer ' + this.token_value );
    return this.http.get(this.constant.rootUrl + fn, {headers: headers});
    
  }
  post_rqst(request_data: any, fn: any):any {
    this.token_value = this.get_token_data();
    this.tokenInfo = this.getDecodedAccessToken(this.token_value); // decode token
    if(this.tokenInfo)
    {
      this.karigar_id=this.tokenInfo.sub;
      console.log(this.karigar_id);
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('Token', 'Bearer ' + this.token_value);
    return this.http.post(this.constant.rootUrl + fn, JSON.stringify(request_data), {headers: headers});
    
  }
  
  headers = new HttpHeaders();
  fileData(request_data:any,fn:any):any{
    this.headers.append('Content-Type', undefined);
    return this.http.post(this.constant.rootUrl + fn, request_data , {headers: this.headers})
  }

  
  getDecodedAccessToken(token: string): any {
    try{
    return jwt_decode(token);
    }
    catch(Error){
    return null;
    }
    }
}