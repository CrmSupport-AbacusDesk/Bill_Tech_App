import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, AlertController, ModalController } from 'ionic-angular';
import { ShippingDetailPage } from '../shipping-detail/shipping-detail';
import { ChatingPage } from '../chating/chating';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ReceiveRemarkModalPage } from '../receive-remark-modal/receive-remark-modal';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import { FeedbackPage } from '../feedback/feedback';

@IonicPage()
@Component({
    selector: 'page-transaction',
    templateUrl: 'transaction.html',
})
export class TransactionPage {
    transaction_detail:any=[];
    balance_point:any='';
    filter:any={};
    loading:Loading;
    tokenInfo:any={};
    lang:any='';
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app: App,public alertCtrl:AlertController, public modalCtrl: ModalController,public storage:Storage,public translate:TranslateService,public db:DbserviceProvider) {
        // this.presentLoading();
    }
    
    ionViewWillEnter()
    {
        this.get_user_lang();
        console.log('ionViewDidLoad TransactionPage');
        this.getTransactionDetail();
    }
    
    doRefresh(refresher) 
    {
        console.log('Begin async operation', refresher);
        this.getTransactionDetail(); 
        refresher.complete();
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
    
    goOnShippingPage(id,gift_id){
        console.log('shipping');
        this.navCtrl.push(ShippingDetailPage,{'id':id,'gift_id':gift_id});
    }
    
    goOnChatingPage(){
        this.navCtrl.push(ChatingPage);
    }
    total_balance_point:any;
    
    getTransactionDetail()
    {
        this.presentLoading();
        
        this.filter.limit=0;
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'filter':this.filter},'app_karigar/transaction')
        .subscribe((r)=>
        {
            console.log(r);
            if(r)
            {
                this.loading.dismiss();
                this.transaction_detail=r['transaction']
                this.balance_point=r['karigar'].balance_point;
                this.total_balance_point = parseInt( r['karigar'].balance_point ) + parseInt( r['karigar'].referal_point_balance );
            }
        });
    }
    
    presentLoading() 
    {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: false
        });
        this.loading.present();
    }
    
    recvConfirmation(gift_id)
    {
        // let ReceiveModal = this.modalCtrl.create(ReceiveRemarkModalPage,{'gift_id':gift_id});
        // ReceiveModal.present();
        this.service.post_rqst({'id':gift_id,'karigar_id':this.service.karigar_id},'app_karigar/redeemReceiveStatus').subscribe(r=>
            {
              console.log(r);
              // this.navCtrl.setRoot(TabsPage,{index:'3'});
            //   this.navCtrl.push(TransactionPage);
              this.showSuccess('Thank you for your feedback!')
              this.getTransactionDetail();
              // this.getTransactionDetail()
            });
            // alert.present();
    }
    
    showSuccess(text)
    {
        let alert = this.alertCtrl.create({
            // title:'Success!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
    
    flag:any='';
    loadData(infiniteScroll)
    {
        console.log('loading');
        
        this.filter.limit=this.transaction_detail.length;
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'filter':this.filter},'app_karigar/transaction')
        .subscribe((r)=>
        {
            console.log(r);
            if(r['transaction']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.transaction_detail=this.transaction_detail.concat(r['transaction']);
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
            
            if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage')) {
                
                console.log(previuosView);
                this.navCtrl.popToRoot();   
            }
        }
        
    }

    helpChat(reqId){
        console.log('====================================');
        console.log(reqId);
        console.log('====================================');
        this.navCtrl.push(FeedbackPage, {'code': "My Redeem Gift Request ID is - " + reqId + " I want to know the status of my request" })
    }
    
}
