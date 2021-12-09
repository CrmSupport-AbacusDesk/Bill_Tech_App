import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';

/**
* Generated class for the ProfileEditModalPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-profile-edit-modal',
  templateUrl: 'profile-edit-modal.html',
})
export class ProfileEditModalPage {
  data:any={};
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  pincode_list:any=[];
  selectedFile:any=[];
  file_name:any=[];
  karigar_id:any='';
  formData= new FormData();
  myphoto:any;
  profile_data:any='';
  loading:Loading;
  lang:any='';
  today_date:any;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,  public service:DbserviceProvider, public alertCtrl:AlertController, private loadingCtrl:LoadingController, public translate:TranslateService) {
    this.getstatelist();
    this.today_date = new Date().toISOString().slice(0,10);
    this.data = navParams.data.user_detail;
    this.data = navParams.data.user_detail;
    this.data.karigar_edit_id = navParams.data.user_detail.id
    if (this.data.state) {
      this.getDistrictList(this.data.state);
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileEditModalPage');
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  getstatelist(){
    this.service.get_rqst('app_master/getStates').subscribe( r =>
      {
        console.log(r);
        this.state_list=r['states'];
        this.karigar_id=r['id'];
        console.log(this.state_list);
      });
    }
    
    getDistrictList(state_name)
    {
      console.log(state_name);
      this.service.post_rqst({'state_name':state_name},'app_master/getDistrict')
      .subscribe( (r) =>
      {
        console.log(r);
        this.district_list=r['districts'];
        console.log(this.state_list);
      });
    }
    
    getCityList(district_name)
    {
      console.log(district_name);
      this.service.post_rqst({'district_name':district_name},'app_master/getCity')
      .subscribe( (r) =>
      {
        console.log(r);
        this.city_list=r['cities'];
        this.pincode_list=r['pins'];
        console.log(this.pincode_list);
      });
    }
    
    getaddress(pincode)
    {
      
      this.service.post_rqst({'pincode':pincode},'app_karigar/getAddress')
      .subscribe( (result) =>
      {
        console.log(result);
        var address = result.address;
        if(address!= null)
        {
          this.data.state = result.address.state_name;
          this.getDistrictList(this.data.state)
          this.data.district = result.address.district_name;
          this.data.city = result.address.city;
          console.log(this.data);
        }
      });
      
    }
    
    submit()
    {
      this.presentLoading();
      console.log('data');
      console.log(this.data);
      
      
      if(this.data.dealer_counter_name)
      {
        this.data.dealer_status='Active';
        console.log(this.data.dealer_status);
      }
      else
      {
        this.data.dealer_status='';
      }
      this.data.lang = this.lang;
      this.data.karigar_type = 1;
      this.data.gender = 'male';
      console.log(this.data);
     
      this.service.post_rqst( {'karigar': this.data },'app_karigar/addKarigar')
      .subscribe( (r) =>
      {
        console.log(r);
        this.loading.dismiss();
        this.karigar_id=r['id'];
          this.navCtrl.push(HomePage)
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
    
  }
  