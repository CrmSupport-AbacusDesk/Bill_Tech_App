import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { OffersPage } from '../offers/offers';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { ConstantProvider } from '../../providers/constant/constant';


@IonicPage()
@Component({
    selector: 'page-offer-list',
    templateUrl: 'offer-list.html',
})
export class OfferListPage {
    offer_list:any=[];
    loading:Loading;
    filter:any={};
    flag:any='';
    lang:any='';
    tokenInfo:any={};
    uploadUrl:any='';
    constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App,public db:DbserviceProvider,public translate:TranslateService,public storage:Storage,public constant:ConstantProvider) {
        this.getofferList();
        this.presentLoading();
    }
    
    ionViewDidLoad() {
        this.uploadUrl = this.constant.upload_url;
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        this.get_user_lang();
        console.log('ionViewDidLoad OfferListPage');
       
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
    goOnOffersPage(id)
    {
        this.navCtrl.push(OffersPage,{'id':id});
        
    }
    getofferList()
    {
        this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/offerList')
        .subscribe((r)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.offer_list=r['offer'];
            console.log(this.offer_list);
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
    ionViewDidLeave()
    {
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
                this.navCtrl.popToRoot();
            }
        }
    }
}
