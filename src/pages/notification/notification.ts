import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';



@IonicPage()
@Component({
    selector: 'page-notification',
    templateUrl: 'notification.html',
})
export class NotificationPage {
    
    tokenInfo:any={};
    lang:any='';
    karigar_id:any="";
    constructor(public navCtrl: NavController, public navParams: NavParams,private app:App,public service:DbserviceProvider,public storage:Storage,public translate:TranslateService) {
        this.get_user_lang();
        this.storage.get('token')
        .then(resp=>{
            console.log(jwt_decode(resp));
            let tokendata = jwt_decode(resp);
            console.log(tokendata);
            this.karigar_id = tokendata.sub;
            console.log(this.karigar_id);
            this.get_notification();
        })
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationPage');
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
                
                console.log(previuosView);
                this.navCtrl.popToRoot();
            }
        }
    }
    
    getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
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
    
    data_list:any=[];
    get_notification()
    {
        this.service.post_rqst({"karigar_id":this.karigar_id,"limit":this.data_list.length},"app_karigar/get_notification")
        .subscribe(resp=>{
            console.log(resp);
            this.data_list = resp['notification'];
        })
    }

    flag:any='';
    loadData(infiniteScroll)
    {
        this.service.post_rqst({"karigar_id":this.karigar_id,"limit":this.data_list.length},'app_karigar/get_notification')
        .subscribe( (resp) =>
        {
            console.log(resp);
            if(resp=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.data_list=this.data_list.concat(resp['notification']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
}
