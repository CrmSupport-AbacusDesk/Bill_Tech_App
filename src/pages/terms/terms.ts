import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";

@IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  offer_id:any='';
  terms_detail:any={};
  loading:Loading;
  tokenInfo:any={};
  lang:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,public storage:Storage,public translate:TranslateService,public db:DbserviceProvider) {
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
    this.offer_id=this.navParams.get('id');
    this.getTermsDetail(this.offer_id);
    this.get_user_lang();
    this.presentLoading();
  }
  getTermsDetail(offer_id)
  {
    console.log(offer_id);
    this.service.post_rqst({'offer_id':offer_id,'karigar_id':22},'app_karigar/offerTermCondition').subscribe(r=>
      {
        console.log(r);
        this.loading.dismiss();
        this.terms_detail=r['offer'];
      });
    }
    presentLoading() 
    {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
        this.loading = this.loadingCtrl.create({
          content: resp,
          dismissOnPageChange: false
        });
        this.loading.present();
      })
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
  
  