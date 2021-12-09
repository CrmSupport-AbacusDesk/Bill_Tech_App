import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
 * Generated class for the OfferProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer-product-detail',
  templateUrl: 'offer-product-detail.html',
})
export class OfferProductDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,
    public translate:TranslateService,public con:ConstantProvider,public modalCtrl:ModalController) {
  }

  offer_detail_prod_id:any='';
  upload_url:any="";
  offer_prod_detail:any={};

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfferProductDetailPage');
    this.offer_detail_prod_id = this.navParams.get('id');
    console.log(this.offer_detail_prod_id);
    this.getOfferProductDetail(this.offer_detail_prod_id);
    
    this.upload_url = this.con.upload_url;
  }
  
  getOfferProductDetail(id){
    this.service.post_rqst({'product_id' :id},'app_master/productDetail')
    .subscribe( (r) =>
    {
      console.log(r);
      this.offer_prod_detail=r['product'];
      console.log(this.offer_prod_detail);
      
    });
  }
  viewDetail(image)
  {
    console.log("clicked");
    
    this.modalCtrl.create(ViewProfilePage, {"Image": image}).present();
  }

}
