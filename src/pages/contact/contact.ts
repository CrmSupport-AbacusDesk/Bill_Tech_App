import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  
  tokenInfo:any={};
  lang:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,private app:App,public db:DbserviceProvider,public storage:Storage,public translate:TranslateService) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }
  go_to_map()
  {
    console.log('map');
    let destination = 28.679192 + ',' + 77.211820;
    
    // this.get_user_lang();    
    
    let label = encodeURI('A Bunglow, near Petrol Pump, Malka Ganj, New Delhi, Delhi 110007');
    
    window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
  }
  ionViewDidLeave()
  {
    this.get_user_lang();
    let nav = this.app.getActiveNav();
    if(nav && nav.getActive()) 
    {
      let activeView = nav.getActive().name;
      let previuosView = '';
      if(nav.getPrevious() && nav.getPrevious().name)
      {
        previuosView = nav.getPrevious().name;
      }  
      console.log(previuosView); 
      console.log(activeView);  
      console.log('its leaving');
      if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
      {
        
        console.log(previuosView);
        this.navCtrl.popToRoot();
      }
    }
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
}
