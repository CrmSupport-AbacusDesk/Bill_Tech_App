import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { ConstantProvider } from '../../providers/constant/constant';


@IonicPage()
@Component({
    selector: 'page-product-detail',
    templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
    cat_id:any='';
    filter :any = {};
    prod_list:any=[];
    prod_cat:any='';
    loading:Loading;
    lang:any='';
    tokenInfo:any={};
    upload_url:any='';
    constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController, private app:App,public translate:TranslateService,public storage:Storage,public con:ConstantProvider) {
    }
    
    ionViewDidLoad() {
        this.cat_id = this.navParams.get('id');
        console.log(this.cat_id);
        
        this.presentLoading();
        this.get_user_lang();
        this.getProductList(this.cat_id,'');
        this.upload_url = this.con.upload_url;
    }
    
    goOnProductSubDetailPage(id){
        this.navCtrl.push(ProductSubdetailPage,{'id':id})
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
    
    getProductList(id,search)
    {
        console.log(search);
        this.filter.search=search;
        this.filter.limit = 0;
        this.filter.id=id;
        this.service.post_rqst({'filter':this.filter},'app_master/productList')
        .subscribe( (r) =>
        {
            console.log(r);
            this.loading.dismiss();
            this.prod_list=r['products'];
            this.prod_cat=r['category_name'];
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
}
