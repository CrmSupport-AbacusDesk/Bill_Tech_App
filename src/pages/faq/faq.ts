import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FaqAnswerPage } from '../faq-answer/faq-answer';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";

@IonicPage()
@Component({
    selector: 'page-faq',
    templateUrl: 'faq.html',
})
export class FaqPage {
    tokenInfo:any={};
    lang:any='';
    constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbserviceProvider,public storage:Storage,public translate:TranslateService) {
    }
    
    ionViewDidLoad() {
        this.get_user_lang();
        this.get_question();    
    }
    
    question_list:any=[];
    get_question()
    {
        this.db.post_rqst("","app_karigar/getQuestions")
        .subscribe(resp=>{
            console.log(resp);
            this.question_list = resp['question_list'];
            this.question_list.map(resp=>{
                resp.active = false;
            })
        })
    }
    goOnfaqanswerPage(data)
    {
        this.navCtrl.push(FaqAnswerPage,{data:data});
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
