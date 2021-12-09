import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
// import { ViewProfilePage } from '../view-profile/view-profile';
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-description-model',
  templateUrl: 'description-model.html',
})
export class DescriptionModelPage {
  
  description:any = '';
  description_id:any = '';
  loading:Loading;
  lang:any='';
  tokenInfo:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl:LoadingController, public viewCtrl: ViewController,public translate:TranslateService,public storage:Storage,public service:DbserviceProvider) {
  }
  
  ionViewDidLoad() 
  {
    this.description = this.navParams.get('description');
    console.log(this.description);
    this.description_id = this.navParams.get('id');
    console.log(this.description_id);
    this.get_user_lang();
  }
  
  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
  
  presentLoading() 
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: false
    });
    this.loading.present();
  }
  
  ionViewDidLeave()
  {
    console.log('leave');
  }
  
  get_user_lang()
  {
    this.storage.get("token")
    .then(resp=>{
      this.tokenInfo = this.getDecodedAccessToken(resp );
      this.service.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
      .subscribe(resp=>{
        console.log(resp);
        this.lang = resp['language'];
        if(this.lang == "")
        {
          this.lang = "en";
        }
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
