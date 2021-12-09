import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";

@IonicPage()
@Component({
    selector: 'page-faq-answer',
    templateUrl: 'faq-answer.html',
})
export class FaqAnswerPage {
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbserviceProvider,public storage:Storage,public translate:TranslateService) {
    }
    
    tokenInfo:any={};
    lang:any='';
    data:any={}
    ionViewDidLoad() {
        this.data = this.navParams.get('data');
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
