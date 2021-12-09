import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { GiftDetailPage } from '../gift-detail/gift-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import { ConstantProvider } from '../../../providers/constant/constant';

@IonicPage()
@Component({
    selector: 'page-gift-list',
    templateUrl: 'gift-list.html',
})
export class GiftListPage {
    filter:any={};
    id:any='';
    gift_list:any=[];
    balance_point:any='';
    loading:Loading;
    mode:any='';
    tokenInfo:any={};
    lang:any='';
    uploadUrl:any='';
    constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app: App,public storage:Storage,public translate:TranslateService,public db:DbserviceProvider,public constant:ConstantProvider) {
        this.mode = this.navParams.get('mode');
        if(this.mode)
        {
            this.mode= this.mode;
            console.log(this.mode);
        }
        else{
            this.mode= '';
            console.log( this.mode);
        }
    }
    
    
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad GiftListPage');
        this.uploadUrl = this.constant.upload_url;
        this.get_user_lang();
        this.presentLoading();
    }
    ionViewWillEnter()
    {
        this.get_user_lang();
        this.getGiftList('');
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
    
    doRefresh(refresher) 
    {
        console.log('Begin async operation', refresher);
        this.getGiftList(''); 
        refresher.complete();
    }
    
    goOnGiftDetail(id){
        this.navCtrl.push(GiftDetailPage,{'id':id})
    }
    
    total_balance_point:any=0;
    
    getGiftList(search)
    {
        this.filter.limit=0;
        this.filter.search=search;
        this.filter.redeemable = this.mode;
        console.log(this.filter.search);
        this.service.post_rqst({'filter' : this.filter,'karigar_id':this.service.karigar_id},'app_karigar/giftList')
        .subscribe( (r) =>
        {
            console.log(r);
            this.loading.dismiss();
            this.gift_list=r['gift'];
            this.balance_point=parseInt(r['karigar'].balance_point);
            this.total_balance_point = parseInt( r['karigar'].balance_point) + parseInt(r['karigar'].referal_point_balance );
            
            var referral_per = r['referral_point_per'].one_time_percentage;
            var referral_amount = ((r['karigar'].referal_point_balance * referral_per)/100);
            // var offer_balance = this.balance_point;
            
            // for gift active class
            for (let i = 0; i < this.gift_list.length; i++) 
            {
                this.gift_list[i].coupon_points = parseInt( this.gift_list[i].coupon_points);
                // this.gift_list[i].offer_balance = parseInt( this.gift_list[i].offer_balance) + (referral_amount);
                this.gift_list[i].offer_balance = this.balance_point + (referral_amount);

            }
            // end
        });
    }
    
    intVal(arsg)
    {
        return parseInt(arsg);
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
    flag:any='';
    loadData(infiniteScroll)
    {
        this.filter.limit=this.gift_list.length;
        this.service.post_rqst({'filter' : this.filter,'karigar_id':this.service.karigar_id},'app_karigar/giftList')
        .subscribe( (r) =>
        {
            console.log(r);
            if(r=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.gift_list=this.gift_list.concat(r['gift']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
    ionViewDidLeave() {
        
        let nav = this.app.getActiveNav();
        
        if(nav && nav.getActive()) {
            
            let activeView = nav.getActive().name;
            
            let previuosView = '';
            if(nav.getPrevious() && nav.getPrevious().name) {
                previuosView = nav.getPrevious().name;
            }
            
            console.log(previuosView);
            console.log(activeView); 
            console.log('its leaving');
            
            if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) {
                
                console.log(previuosView);
                this.navCtrl.popToRoot();
            }
        }
        
    }
}
