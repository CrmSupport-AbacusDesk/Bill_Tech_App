import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, ModalController } from 'ionic-angular';
import { TermsPage } from '../terms/terms';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { GiftDetailPage } from '../gift-gallery/gift-detail/gift-detail';
import { ViewProfilePage } from '../view-profile/view-profile';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import { ConstantProvider } from '../../providers/constant/constant';

@IonicPage()
@Component({
    selector: 'page-offers',
    templateUrl: 'offers.html',
})
export class OffersPage {
    offer_id:any='';
    offer_detail:any={};
    gift_list:any='';
    balance_point:any='';
    loading:Loading;
    offer_balance:any='';
    tokenInfo:any={};
    lang:any='';
    filter:any={};
    uploadUrl:any='';
    constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController ,private app : App,public modalCtrl: ModalController,public storage:Storage,public translate:TranslateService,public db:DbserviceProvider,public constant:ConstantProvider) {
    }
    
    ionViewDidLoad() {
        this.uploadUrl = this.constant.upload_url;
        console.log('ionViewDidLoad OffersPage');
        this.presentLoading();
        this.offer_id=this.navParams.get('id');
        console.log(this.offer_id);
        
        this.getofferDetail(this.offer_id);
        this.get_user_lang();
    }
    
    doRefresh(refresher) 
    {
        console.log('Begin async operation', refresher);
        this.getofferDetail(this.offer_id); 
        refresher.complete();
    }
    
    goOntermsPage(id){
        this.navCtrl.push(TermsPage, {'id':id});
    }
    
    goOnGiftDetail(id){
        console.log(id);
        this.navCtrl.push(GiftDetailPage,{'id':id})
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
    
    flag:any='';
    loadData(infiniteScroll)
    {
        this.filter.limit=this.gift_list.length;
        this.service.post_rqst({'filter' : this.filter,'offer_id':this.offer_id,'karigar_id':this.service.karigar_id},'app_karigar/offerDetail')
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
    
    getofferDetail(offer_id)
    {
        this.filter.limit=0;
        console.log(offer_id);
        this.service.post_rqst({'filter' : this.filter,'offer_id':offer_id,'karigar_id':this.service.karigar_id},'app_karigar/offerDetail')
        .subscribe((r)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.offer_detail=r['offer'];
            this.gift_list=r['gift'];
            var referral_per = r['referral_percentage'];
            var referral_per_amt = ((r['karigar'].referal_point_balance * referral_per.one_time_percentage)/100);
            this.balance_point=parseInt(r['karigar'].balance_point);
            // this.offer_balance=parseInt(r['gift'][0].offer_balance ) + (referral_per_amt);
            this.offer_balance=this.balance_point + (referral_per_amt);


            console.log(this.offer_balance);

            // for gift active class
            for (let i = 0; i < this.gift_list.length; i++) 
            {
                this.gift_list[i].coupon_points = parseInt( this.gift_list[i].coupon_points);
                this.gift_list[i].offer_balance = this.offer_balance;
console.log(this.gift_list[i].offer_balance);
console.log(this.gift_list[i].coupon_points);


            }
            // end
            
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
    
    viewDetail()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.lang !='en' ? this.offer_detail.hin_term_image : this.offer_detail.term_image}).present();
    }
}
