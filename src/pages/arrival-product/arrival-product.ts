import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
import { ArrivalDetailPage } from '../arrival-detail/arrival-detail';

/**
 * Generated class for the ArrivalProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-arrival-product',
  templateUrl: 'arrival-product.html',
})
export class ArrivalProductPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public service:DbserviceProvider,public translate:TranslateService,public con:ConstantProvider) {
  }

  new_arrival_prod_list:any=[];
  upload_url:any='';
  filter :any = {};
  cat_id:any='';

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArrivalProductPage');
    this.cat_id = this.navParams.get('id');
console.log(this.cat_id);

    this.get_new_arrival_product();
    // this.getProductList(this.cat_id,'');

    this.upload_url = this.con.upload_url;

  }
  get_new_arrival_product(){
    this.service.post_rqst({'filter':this.filter},'app_master/newArrival')
        .subscribe( (r) =>
        {
            console.log(r);
          this.new_arrival_prod_list=r['products'];
          console.log(this.new_arrival_prod_list);
          
        });
  }
  getProductList(search)
    {
        console.log(search);
        this.filter.search=search;
        // this.filter.limit = 0;
        // this.filter.id=id;
        this.service.post_rqst({'filter':this.filter},'app_master/newArrival')
        .subscribe( (r) =>
        {
            console.log(r);
            this.new_arrival_prod_list=r['products'];
            // this.new_arrival_prod_list=r['category_name'];
        });
    }
  goOnArrivalProductDetailPage(id){
    this.navCtrl.push(ArrivalDetailPage,{'id':id})
  }
}
