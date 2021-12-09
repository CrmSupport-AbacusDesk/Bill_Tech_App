import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, ModalController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import * as jwt_decode from "jwt-decode";
import { ViewProfilePage } from '../view-profile/view-profile';
import { ConstantProvider } from '../../providers/constant/constant';

@IonicPage()
@Component({
  selector: 'page-product-subdetail',
  templateUrl: 'product-subdetail.html',
})
export class ProductSubdetailPage {
  prod_id:any='';
  prod_detail:any={};
  assign_prod:any=[];
  prod_detail_image:any={};
  loading:Loading;
  lang:any='';
  tokenInfo:any={};
  upload_url:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App,public translate:TranslateService,public storage:Storage,public modalCtrl:ModalController,public con:ConstantProvider) {
    this.presentLoading();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductSubdetailPage');
    this.prod_id = this.navParams.get('id');
    console.log(this.prod_id);
    this.get_user_lang();
    this.getProductDetail(this.prod_id);
    this.upload_url = this.con.upload_url;
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
  getProductDetail(id)
  {
    console.log(id);
    
    this.service.post_rqst({'product_id' :id},'app_master/productDetail')
    .subscribe( (r) =>
    {
      console.log(r);
      this.loading.dismiss();
      this.prod_detail=r['product'];

      this.getRelatedProduct(this.prod_detail['master_category_id']);
      // this.assign_prod=r['assigned_product_data'];
      console.log(this.assign_prod);
      
      console.log(this.prod_detail['image']);
      this.prod_detail_image=this.prod_detail['image'];
      console.log(this.prod_detail_image[0].image_name);
      
      console.log(this.prod_detail_image.length);
      
    });
  }
  
  getRelatedProduct(id)
  {
    let data = {id:id,search: "", limit: 0}
    this.service.post_rqst({'filter' :data},'app_master/productList')
    .subscribe( (r) =>
    {
      console.log(r);
      this.loading.dismiss();
      // this.prod_detail=r['product'];
      this.assign_prod=r['products'];
      // console.log(this.assign_prod);
      
      // console.log(this.prod_detail['image']);
      // this.prod_detail_image=this.prod_detail['image'];
      // console.log(this.prod_detail_image[0].image_name);
      
      // console.log(this.prod_detail_image.length);
      
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
        
        console.log(previuosView);
        this.navCtrl.popToRoot();
      }
    }
    
  }
  viewDetail(image)
  {
    console.log("clicked");
    
    this.modalCtrl.create(ViewProfilePage, {"Image": image}).present();
  }
}
