import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DomSanitizer } from '@angular/platform-browser';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-video',
  templateUrl: 'video.html',
})
export class VideoPage {
  filter:any={};
  video_list:any=[];
  loading:Loading;
  SafeResourceUrl;
  tokenInfo:any={};
  lang:any='';
  ok:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,public dom:DomSanitizer,private app:App,public storage:Storage,public translate:TranslateService) {
  }
  
  ionViewDidLoad()
  {
    console.log('ionViewDidLoad VideoPage');
    this.get_user_lang();
    this.getVideoList();
    this.presentLoading();
  }
  getVideoList()
  {
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter},'app_master/videoList').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        this.video_list=r['video'];
        
        for (let i = 0; i < this.video_list.length; i++) {
          this.video_list[i].url = this.dom.bypassSecurityTrustResourceUrl( this.video_list[i].url);
        }
      });
    }
    presentLoading() 
    {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
        this.loading = this.loadingCtrl.create({
          content:resp,
          dismissOnPageChange: false
        });
        this.loading.present();
      })
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
    
    flag:any='';
    
    loadData(infiniteScroll)
    {
      console.log('loading');
      this.filter.limit=this.video_list.length;
      this.service.post_rqst({'filter' : this.filter},'app_master/videoList').subscribe( r =>
        {
          console.log(r);
          if(r['video'] == '')
          {
            this.flag=1;
          }
          else 
          {
            setTimeout(()=>{
              this.video_list=this.video_list.concat(r['video']);
              for (let i = 0; i < this.video_list.length; i++) {
                this.video_list[i].url = this.dom.bypassSecurityTrustResourceUrl( this.video_list[i].url);
              }
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
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
    }
    