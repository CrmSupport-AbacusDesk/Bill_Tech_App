import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { FurnitureIdeasdetailPage } from '../furniture-ideasdetail/furniture-ideasdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
import * as jwt_decode from "jwt-decode";
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
    selector: 'page-furniture-ideas',
    templateUrl: 'furniture-ideas.html',
})
export class FurnitureIdeasPage {
    
    upload_url:any='';
    loading:Loading;
    tokenInfo:any={};
    lang:any='';
    filter:any={};
    flag:any='';
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbserviceProvider,public loadingCtrl:LoadingController,public translate:TranslateService,public constn:ConstantProvider,public storage:Storage) {
        this.presentLoading();
    }
    
    ionViewDidLoad()
    {
        this.get_user_lang();
        console.log('ionViewDidLoad FurnitureIdeasPage');
        this.upload_url = this.constn.upload_url;
        this.get_category();
    }
    
    goOnfurnituredetailPage(data)
    {
        this.navCtrl.push(FurnitureIdeasdetailPage,{data:data});
    }
    
    category_list:any=[];
    get_category()
    {
        this.filter.limit = 0;
        this.db.post_rqst({'filter' : this.filter},"app_karigar/get_furniture_cat")
        .subscribe(resp=>{
            console.log(resp);
            this.category_list = resp['category_list'];
            this.loading.dismiss();
        })
    }
    
    loadData(infiniteScroll)
    {
        console.log('loading');
        this.filter.limit=this.category_list.length;
        this.db.post_rqst({'filter' : this.filter},'app_karigar/get_furniture_cat')
        .subscribe( (r) =>
        {
            console.log(r);
            if(r['category_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.category_list=this.category_list.concat(r['category_list']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
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
}
