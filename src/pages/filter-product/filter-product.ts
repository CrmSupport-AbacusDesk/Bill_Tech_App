import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';

/**
 * Generated class for the FilterProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter-product',
  templateUrl: 'filter-product.html',
})
export class FilterProductPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public con:ConstantProvider,public loadingCtrl:LoadingController,public translate:TranslateService) {
    this.presentLoading();
  }

  search='';
  filter:any={};
  upload_url:any='';
  prod_list:any=[];
  loading:Loading;

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterProductPage');
    this.search = this.navParams.get('search');
    console.log(this.search);
    this.upload_url = this.con.upload_url;
    this.filterProduct();
  }
  filterProduct(){
    console.log("Api called");
    this.filter.search=this.search;
    if(this.search!=undefined){
    this.service.post_rqst({'filter':this.filter},'app_master/searchList').subscribe(r=>{
          console.log(r);
          this.prod_list=r['products'];
          this.loading.dismiss();

      })
    }
    else{
      this.loading.dismiss();
    }
  }
  goOnProductSubDetailPage(id){
    this.navCtrl.push(ProductSubdetailPage,{'id':id})
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
}
