import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
 * Generated class for the ArrivalDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-arrival-detail',
  templateUrl: 'arrival-detail.html',
})
export class ArrivalDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,
    public translate:TranslateService,public con:ConstantProvider,public modalCtrl:ModalController) {
  }

  upload_url:any="";
  arrival_prod_id:any='';
  arrival_prod_detail:any={};
  ionViewDidLoad() {
    console.log('ionViewDidLoad ArrivalDetailPage');
    this.arrival_prod_id = this.navParams.get('id');
    console.log(this.arrival_prod_id);
    this.getArrivalProductDetail(this.arrival_prod_id);
    
    this.upload_url = this.con.upload_url;

  }

  getArrivalProductDetail(id){
    this.service.post_rqst({'product_id' :id},'app_master/productDetail')
    .subscribe( (r) =>
    {
      console.log(r);
      this.arrival_prod_detail=r['product'];
      console.log(this.arrival_prod_detail);
      
    });
  }
  viewDetail(image)
  {
    console.log("clicked");
    
    this.modalCtrl.create(ViewProfilePage, {"Image": image}).present();
  }
}
