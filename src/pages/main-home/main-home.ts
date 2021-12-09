import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AdvanceTextPage } from '../advance-text/advance-text';
import { NotificationPage } from '../notification/notification';
import { ContactPage } from '../contact/contact';
import { VideoPage } from '../video/video';
import { NewsPage } from '../news/news';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { FaqPage } from '../faq/faq';

@IonicPage()
@Component({
  selector: 'page-main-home',
  templateUrl: 'main-home.html',
})

export class MainHomePage {
  items = [
    'Advance Decorative Laminates'
  ];
  tokenInfo:any={};
  lang:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:Storage,public translate:TranslateService,public db:DbserviceProvider,public alertCtrl:AlertController) {
  }
  
  ionViewDidLoad() {
    this.get_user_lang();
    console.log('ionViewDidLoad MainHomePage');
  }
  
  goOnAdvanceTextPage(){
    this.navCtrl.push(AdvanceTextPage);
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
  
  goOnNotificationPage(){
    this.navCtrl.push(NotificationPage);
  }
  
  goOnContactPage(){
    this.navCtrl.push(ContactPage);
  }
  
  goOnVideoPage(){
    this.navCtrl.push(VideoPage);
  }
  
  goOnNewsPage(){
    this.navCtrl.push(NewsPage);
  }
  
  goOnfaqPage()
  {
    this.navCtrl.push(FaqPage);
  }
  
  inputs:any=[];
  goOnlanguage()
  {
    this.inputs = [];
    this.db.get_rqst("app_karigar/get_languages")
    .subscribe(resp=>{
      console.log(resp);
      this.inputs = resp
      console.log(this.inputs);
      for(var i=0;i<this.inputs.length;i++)
      {
        this.inputs[i]['type'] = "radio";
        this.inputs[i]['checked'] = this.inputs[i]['value'] == this.lang? true : false;
        
      }
      console.log(this.inputs);
      if(this.inputs.length > 0)
      {
        let alert = this.alertCtrl.create({
          title: 'Choose your Language',
          inputs: this.inputs,
          buttons: [
            {
              text: 'OK',
              handler: (data) => {
                console.log(data);
                this.lang = data;
                this.db.post_rqst({"login_id" : this.tokenInfo.sub,"lang":this.lang},"app_karigar/change_language")
                .subscribe(resp=>{
                  console.log(resp);
                  this.translate.use(this.lang);
                })
              }
            }
          ]
        });
        alert.present();
      }
    })
  }
}
