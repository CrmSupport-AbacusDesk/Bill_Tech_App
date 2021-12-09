import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ModalController, Loading, LoadingController } from 'ionic-angular';
import { RegistrationPage } from '../registration/registration';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import * as jwt_decode from "jwt-decode";
import { TabsPage } from './../../../pages/tabs/tabs';
import {AboutusModalPage} from '../../aboutus-modal/aboutus-modal'
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { MobileLoginPage } from '../mobile-login/mobile-login';
import { HomePage } from '../../home/home';
import { LanguagePage } from '../../language/language';



@IonicPage()
@Component({
    selector: 'page-otp',
    templateUrl: 'otp.html',
})
export class OtpPage {
    karigar_detail:any={};
    otp:any='';
    lang:any='';
    otp_value:any='';
    data:any={};
    mobile_no:any='';
    tokan_value:any='';
    tokenInfo:any='';
    loading:Loading;
    
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,public modalCtrl: ModalController, private storage:Storage,public loadingCtrl:LoadingController,public translate:TranslateService) {
        
    }
    
    ok:any;
    ionViewDidLoad() {
        console.log('ionViewDidLoad OtpPage');
        this.mobile_no = this.navParams.get('mobile_no');
        this.otp = this.navParams.get('otp');
        this.lang = this.navParams.get('lang');
        
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp;
        })
    }
    
    
    otpvalidation() 
    {
        this.otp_value=false;
        if(this.data.otp==this.otp)
        {
            this.otp_value=true
        }
        console.log(this.otp);
        console.log(this.otp_value);
        
    }
    submit()
    {
        this.presentLoading();
        console.log('data');
        console.log(this.data);
        this.service.post_rqst({'mobile_no': this.mobile_no ,'mode' :'App',"lang":this.lang},'auth/login')
        .subscribe( (r) =>
        {
            console.log(r);
            this.loading.dismiss();
            if(r['status'] == 'NOT FOUND'){
                
                this.navCtrl.push(RegistrationPage,{'mobile_no':this.mobile_no,"lang":this.lang})
                return;
            }
            else if(r['status'] == 'ACCOUNT SUSPENDED')
            {
                this.translate.get("Your account has been suspended")
                .subscribe(resp=>{
                    this.showAlert(resp);
                });
                this.navCtrl.push(MobileLoginPage);
                return;
            } 
            else if(r['status'] == 'SUCCESS')
            {
                this.storage.set('token',r['token']); 
                this.service.karigar_id=r['user'].id;
                this.service.karigar_status=r['user'].status;
                console.log(this.service.karigar_id);
                
                if( r['user'].status !='Verified')
                {
                    console.log(this.lang);
                    
                    let contactModal = this.modalCtrl.create(AboutusModalPage, {"lang":this.lang});
                    contactModal.present();
                    return;
                }
            }
            this.storage.set('token',r['token']); 
            this.service.karigar_id=r['user'].id;
            console.log(this.service.karigar_id);
            console.log(this.lang);
            this.navCtrl.push(HomePage, {'lang':this.lang});
            console.log(this.lang);
            // this.navCtrl.push(TabsPage);
        });
    }
    resendOtp()
    {
        this.service.post_rqst({'mobile_no': this.mobile_no },'app_karigar/karigarLoginOtp').subscribe(r=>
            {
                if(r['status'] == "SUCCESS")
                {
                    this.translate.get("OTP has been send")
                    .subscribe(resp=>{
                        this.showSuccess(resp);
                        this.otp=r['otp'];
                    })
                }
            });
        }
        getDecodedAccessToken(token: string): any {
            try{
                return jwt_decode(token);
            }
            catch(Error){
                return null;
            }
        }
        
        showAlert(text)
        {
            
            this.translate.get("Alert")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        
        showSuccess(text)
        {
            this.translate.get("Success")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: [this.ok]
                });
                alert.present();
            })
        }
        
        presentLoading() 
        {
            this.translate.get("Please wait...")
            .subscribe(resp=>{
                this.loading = this.loadingCtrl.create({
                    content: "",
                    dismissOnPageChange: false
                });
                this.loading.present();
            })
        }


        languageBack()
        {
            console.log(this.lang);
            this.navCtrl.push(LanguagePage);
        }
    }
    