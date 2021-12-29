import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProductDetailPage } from '../product-detail/product-detail';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { ProductsPage } from '../products/products';

/**
* Generated class for the MainCategoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-main-category',
  templateUrl: 'main-category.html',
})
export class MainCategoryPage {
  prod_cat_list:any=[];
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  lang:any='';
  tokenInfo:any={};
  uploadUrl:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController, public con:ConstantProvider, public translate:TranslateService) {
    this.presentLoading();
    this.getProductCategoryList();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MainCategoryPage');
    this.uploadUrl = this.con.upload_url;
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
  id:any
  cat_id:any
  getProductCategoryList()
  {
    console.log('catagorylist');
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter},'app_master/mainCategoryList')
    .subscribe( (r) =>
    {
      console.log(r);
      this.loading.dismiss();
      // this.loading.dismiss();
      this.prod_cat_list=r['categories'];
      this.id=r['categories'];
      console.log(this.id);
      for (let i = 0; i < this.prod_cat_list.length; i++) {
        this.cat_id = this.prod_cat_list[i]['id'];
      }
     
    });
  }
 
  getProductList(search)
  {
      console.log(search);
      this.filter.search=search;
      this.service.post_rqst({'filter':this.filter, 'category_id':this.cat_id},'app_master/categoryList')
      .subscribe( (r) =>
      {
          console.log(r);
          this.prod_cat_list=r['categories'];
      });
  }
  
  goOnProductPage(id){
    this.navCtrl.push(ProductDetailPage ,{'id':id})
  }
  
}
