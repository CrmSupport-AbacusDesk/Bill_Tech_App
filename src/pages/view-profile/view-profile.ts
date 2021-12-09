import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import { ConstantProvider } from '../../providers/constant/constant';

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  lang:any='';
  tokenInfo:any={};
  profile_pic:any='';
  type:any='';
  uploadUrl:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public storage:Storage,public db:DbserviceProvider,public translate:TranslateService,public constant:ConstantProvider) {
  }
  
  ionViewDidLoad() {
    this.uploadUrl = this.constant.upload_url;
    this.get_user_lang();
    this.profile_pic=this.navParams.get("Image");
    this.type=this.navParams.get("type");
  }
  
  closeModal(){
    this.viewCtrl.dismiss();
  }
  
  get_user_lang()
  {
    this.storage.get("token")
    .then(resp=>{
      this.tokenInfo = this.getDecodedAccessToken(resp );
      
      this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
      .subscribe(resp=>{
        console.log(resp);
        this.lang = resp['language'];
        if(this.lang == "")
        {
          this.lang = "en";
        }
        this.translate.setDefaultLang(this.lang)
        this.translate.use(this.lang);
      })
    })
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
