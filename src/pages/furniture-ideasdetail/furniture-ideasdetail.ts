import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { FurnitureIdeassharePage } from '../furniture-ideasshare/furniture-ideasshare';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
import * as jwt_decode from "jwt-decode";
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-furniture-ideasdetail',
    templateUrl: 'furniture-ideasdetail.html',
})
export class FurnitureIdeasdetailPage {
    
    data:any={};
    loading:Loading;
    upload_url:any='';
    filter:any={};
    flag:any='';
    tokenInfo:any={};
    lang:any='';
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public db:DbserviceProvider,public loadingCtrl:LoadingController,public translate:TranslateService,public constn:ConstantProvider,public storage:Storage) {
        this.data = this.navParams.get("data");
        this.presentLoading();
    }
    
    ionViewDidLoad() {
        this.upload_url = this.constn.upload_url;
        console.log('ionViewDidLoad FurnitureIdeasdetailPage');
        this.get_subFurniture_cat();
    }
    
    goOnfurnituresharePage(data)
    {
        this.navCtrl.push(FurnitureIdeassharePage,{data:data,list:this.sub_cat_list});
    }
    
    sub_cat_list:any=[];
    get_subFurniture_cat()
    {
        this.filter.limit = 0;
        this.db.post_rqst({data:this.data,'filter' : this.filter},"app_karigar/get_subfurniture_cat")
        .subscribe(resp=>{
            console.log(resp);
            this.sub_cat_list = resp['sub_cat_list'];
            this.loading.dismiss();
        })
    }
    
    loadData(infiniteScroll)
    {
        console.log('loading');
        this.filter.limit=this.sub_cat_list.length;
        this.db.post_rqst({data:this.data,'filter' : this.filter},'app_karigar/get_subfurniture_cat')
        .subscribe( (r) =>
        {
            console.log(r);
            if(r['sub_cat_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.sub_cat_list=this.sub_cat_list.concat(r['sub_cat_list']);
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
