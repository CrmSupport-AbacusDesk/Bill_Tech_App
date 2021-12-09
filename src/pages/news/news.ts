import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, App } from 'ionic-angular';
import { NewsDetailPage } from '../news-detail/news-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";

@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
  
  filter:any={};
  news_list:any='';
  loading:Loading;
  lang:any='';
  tokenInfo:any={};
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app: App,public translate:TranslateService,public storage:Storage) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
    this.get_user_lang();
    this.getNewsList();
    this.presentLoading();
  }
  
  goOnNewsDetailPage(id){
    this.navCtrl.push(NewsDetailPage,{'id':id});
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
  getNewsList()
  {
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter},'app_master/newsList').subscribe( r =>
      {
        console.log(r);
        this.loading.dismiss();
        this.news_list=r['news'];
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
    flag:any='';
    loadData(infiniteScroll)
    {
      console.log('loading');
      
      this.filter.limit=this.news_list.length;
      this.service.post_rqst({'filter' : this.filter},'app_master/newsList').subscribe( r =>
        {
          console.log(r);
          if(r['news']=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.news_list=this.news_list.concat(r['news']);
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
            this.navCtrl.popToRoot();
          }
        }
      }
      
    }
    