import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, Loading, } from 'ionic-angular';
import { AboutusModalPage } from '../aboutus-modal/aboutus-modal';
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import * as jwt_decode from "jwt-decode";
import { Storage } from '@ionic/storage';
@IonicPage()
@Component({
    selector: 'page-advance-text',
    templateUrl: 'advance-text.html',
})
export class AdvanceTextPage {
    loading:Loading;
    profile_data:any={};
    tokenInfo:any={};
    lang:any='';
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public service:DbserviceProvider,public loadingCtrl:LoadingController,public storage:Storage,public translate:TranslateService) {
    }
    
    ionViewDidLoad() {
        this. getCompanyprofile()
        this.get_user_lang();
        console.log('ionViewDidLoad AdvanceTextPage');
    }
    
    presentAboutModal() {
        let contactModal = this.modalCtrl.create(AboutusModalPage);
        contactModal.present();
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
    
    getCompanyprofile()
    {
        this.presentLoading();
        
        this.service.post_rqst({},'app_karigar/companyProfile')
        .subscribe( (response)=>
        {
            console.log(response);
            this.loading.dismiss();
            this.profile_data=response.getData;
        })
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
    
}
