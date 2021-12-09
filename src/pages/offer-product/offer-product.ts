import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OfferProductDetailPage } from '../offer-product-detail/offer-product-detail';

/**
 * Generated class for the OfferProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer-product',
  templateUrl: 'offer-product.html',
})
export class OfferProductPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public service:DbserviceProvider,public translate:TranslateService,public con:ConstantProvider) {
  }

  offer_prod_list:any=[];
  upload_url:any='';
  filter :any = {};

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfferProductPage');
    this.get_offer_products();
    this.upload_url = this.con.upload_url;

  }

  get_offer_products(){
    this.service.post_rqst({'filter':this.filter},'app_master/offerProduct')
        .subscribe( (r) =>
        {
            console.log(r);
          this.offer_prod_list=r['products'];
          console.log(this.offer_prod_list);
          
        });
  }

  goOnOfferProductDetailPage(id){
    this.navCtrl.push(OfferProductDetailPage,{'id':id})
  }

  getProductList(search){
    console.log(search);
        this.filter.search=search;
        // this.filter.limit = 0;
        // this.filter.id=id;
        this.service.post_rqst({'filter':this.filter},'app_master/offerProduct')
        .subscribe( (r) =>
        {
            console.log(r);
            this.offer_prod_list=r['products'];
            // this.new_arrival_prod_list=r['category_name'];
        });
  }

}
