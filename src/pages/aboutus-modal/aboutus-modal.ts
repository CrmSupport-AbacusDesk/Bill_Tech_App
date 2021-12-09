import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform,Nav } from 'ionic-angular';
// import { TabsPage } from '../tabs/tabs';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';




@IonicPage()
@Component({
    selector: 'page-aboutus-modal',
    templateUrl: 'aboutus-modal.html',
})
export class AboutusModalPage {
    @ViewChild(Nav) nav: Nav;
    
    tokenInfo:any={};
    lang:any='';
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public platform: Platform,public db:DbserviceProvider,public storage:Storage,public translate:TranslateService) {
    
        console.log(this.navParams);
        this.lang = this.navParams.get("lang");
        console.log('====================================');
        console.log(this.lang);
        console.log('====================================');

    }
    
    ionViewDidLoad() {
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        console.log(this.translate.get("if you any question"));
        this.translate.get("if you any question")
        .subscribe(resp=>{
            console.log(resp);      
        })
        // this.get_user_lang();    
    }
    
    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    exitapp()
    {
        console.log('exit');
        this.platform.exitApp();
    }
    gotoHomePage()
    {
        // this.navCtrl.setRoot(TabsPage,{index:'0'});
        this.navCtrl.push(HomePage);
    }
    
    // get_user_lang()
    // {
    //     this.storage.get("token")
    //     .then(resp=>{
    //         this.tokenInfo = this.getDecodedAccessToken(resp );
            
    //         this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
    //         .subscribe(resp=>{
    //             console.log(resp);
    //             this.lang = resp['language'];
    //             if(this.lang == "")
    //             {
    //                 this.lang = "en";
    //             }
    //             this.translate.use(this.lang);
    //         })
    //     })
    // }
    getDecodedAccessToken(token: string): any {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
    }
}
