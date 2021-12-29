import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Loading, LoadingController, App, ToastController, } from 'ionic-angular';
import { CancelpolicyModalPage } from '../../cancelpolicy-modal/cancelpolicy-modal';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { OffersPage } from '../../offers/offers';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import { ConstantProvider } from '../../../providers/constant/constant';

@IonicPage()
@Component({
    selector: 'page-gift-detail',
    templateUrl: 'gift-detail.html',
})
export class GiftDetailPage {
    gift_id:any=''; 
    gift_detail:any={};
    balance_point:any='';
    loading:Loading;
    star:any=''; 
    rating_star:any='';
    otp:'';
    offer_balance:any=''
    karigar_detail:any={};
    tokenInfo:any={};
    lang:any='';
    uploadUrl:any='';
    mobile_no:number=0;
    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app: App,public storage:Storage,public translate:TranslateService,public db:DbserviceProvider,public constant:ConstantProvider,public toastCtrl:ToastController) {}
    
    ionViewDidLoad() {
        this.uploadUrl = this.constant.upload_url
        console.log('ionViewDidLoad GiftDetailPage');
        this.gift_id = this.navParams.get('id');
        this.getGiftDetail(this.gift_id)
        this.presentLoading();
        this.get_user_lang();
    }
    
    presentCancelPolicyModal() {
        let contactModal = this.modalCtrl.create(CancelpolicyModalPage,{'karigar_id':this.service.karigar_id,'gift_id':this.gift_id,"mobile_no":this.mobile_no});
        contactModal.present();
        console.log('otp');
    }
    goOnOfferDetailPage(offer_id)
    {
        this.navCtrl.push(OffersPage,{'id':offer_id})
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
    getGiftDetail(gift_id)
    {
        console.log(gift_id);
        this.service.post_rqst({'gift_id' :gift_id,'karigar_id':this.service.karigar_id,'id':''},'app_karigar/giftDetail')
        .subscribe( (r) =>
        {
            console.log(r);
            this.loading.dismiss();
            this.gift_detail=r['gift'];
            this.mobile_no=r['karigar'].mobile_no;
            this.rating_star=parseInt(r['gift'].rating);
            console.log(this.gift_detail);
            
            this.gift_detail.coupon_points = parseInt( this.gift_detail.coupon_points );
            if(r['gift_star'])
            {
                this.star=parseInt(r['gift_star'].star);
                console.log(this.star);
            }
            
            var referal_point_per = r['referral_point_per'].one_time_percentage;
            
            var referral_amount = ((r['karigar'].referal_point_balance * referal_point_per)/100);
            
            this.offer_balance= parseInt(r['karigar'].balance_point) + (referral_amount);
            
            console.log(this.offer_balance);
            console.log(this.gift_detail.coupon_points);
            
            if(this.offer_balance < this.gift_detail.coupon_points)
            {
                let toast = this.toastCtrl.create({
                    message: "You have insufficient points!",
                    duration: 3000
                });
                
                toast.present();
            }
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
    
    rating(star)
    {
        this.presentLoading();
        console.log(star);
        this.service.post_rqst({'star':star,'gift_id' :this.gift_id,'karigar_id':this.service.karigar_id,'offer_id':this.gift_detail.offer_id},'app_karigar/giftRating').subscribe(r=>{
            console.log(r);
            if(r)
            {
                this.getGiftDetail(this.gift_id)
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
