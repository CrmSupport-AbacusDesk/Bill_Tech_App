import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, LoadingController, ModalController, AlertController, Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Camera,CameraOptions } from '@ionic-native/camera';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import * as jwt_decode from 'jwt-decode';
import { ConstantProvider } from '../../providers/constant/constant';
import { PopoverController } from 'ionic-angular';
import { SitePopoverPage } from '../site-popover/site-popover';
import { ViewProfilePage } from '../view-profile/view-profile';

/**
* Generated class for the WorkingSitePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-working-site',
    templateUrl: 'working-site.html',
})
export class WorkingSitePage {
    lang:any="en";
    loading:Loading;
    data:any={};
    karigar_id:any='';
    tokenInfo:any={};

    constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams,public actionSheetController: ActionSheetController,public translate:TranslateService,public camera:Camera,public db:DbserviceProvider,public storage:Storage,public loadingCtrl:LoadingController,private transfer: FileTransfer,public constant:ConstantProvider,public modalCtrl:ModalController,public alertCtrl : AlertController)
    {
        this.get_user_lang();
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        console.log(this.db.tokenInfo);
        this.storage.get('token')
        .then(resp=>{
            console.log(jwt_decode(resp));
            let tokendata = jwt_decode(resp)
            this.karigar_id = tokendata.sub;
            this.get_siteImages();
        })
    }
    
    formdata = new FormData();
    cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    image:any='';
    ionViewDidLoad() {
        console.log('ionViewDidLoad WorkingSitePage');
        
        this.translate.get("Camera")
        .subscribe(resp=>{
            this.cam = resp
        });
        
        this.translate.get("Gallery")
        .subscribe(resp=>{
            this.gal = resp
        });
        
        this.translate.get("Cancel")
        .subscribe(resp=>{
            this.cancl = resp
        });
        
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp
        });
        
        this.translate.get("Upload File")
        .subscribe(resp=>{
            this.upl_file = resp
        });
        
        this.translate.get("Registered Successfully")
        .subscribe(resp=>{
            this.save_succ = resp
        });
    }
    
    image_list:any = [];
    get_siteImages()
    {
        this.presentLoading();
        this.db.post_rqst({"karigar_id":this.karigar_id},"app_karigar/get_site_pics")
        .subscribe(resp=>{
            console.log(resp);
            this.loading.dismiss();
            this.image_list = resp['site_image'];
        })
    }
    
    open_camera()
    {
        let actionsheet = this.actionSheetController.create(
            {
                title:"Select An Option",
                cssClass: 'cs-actionsheet',
                
                buttons:[{
                    cssClass: 'sheet-m',
                    text: this.cam,
                    icon:'camera',
                    handler: () => {
                        console.log("Camera Clicked");
                        this.takePhoto();
                    }
                },
                {
                    cssClass: 'sheet-m1',
                    text: this.gal,
                    icon:'image',
                    handler: () => {
                        console.log("Gallery Clicked");
                        this.getImage();
                    }
                },
                {
                    cssClass: 'cs-cancel',
                    text: this.cancl,
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionsheet.present();
    }
    
    takePhoto()
    {
        console.log("i am in camera function");
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 800,
            targetHeight : 700
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            console.log(imageData);
            this.image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.image);
            this.save_picture();
        });
    }
    getImage() 
    {
        const options: CameraOptions = {
            quality:50,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            console.log(imageData);
            this.image = 'data:image/jpeg;base64,' + imageData;
            this.formdata.append("image",this.image);
            console.log(this.image);
            this.save_picture();
        });
    }
    
    inserted_id:any='';
    save_picture()
    {
        this.db.post_rqst({"karigar_id":this.karigar_id},"app_karigar/saveSitePicture")
        .subscribe(resp=>{
            console.log(resp);
            this.inserted_id = resp['inserted_id'];
            this.formdata.append("last_id",this.inserted_id);
            
            if(this.formdata)
            {
                let loader = this.loadingCtrl.create({
                    content: "Uploading..."
                });
                loader.present();
                
                const fileTransfer: FileTransferObject = this.transfer.create();
                var random = Math.floor(Math.random() * 100);
                let options: FileUploadOptions = {
                    fileKey: 'photo',
                    fileName: "myImage_" + random + ".jpg",
                    chunkedMode: false,
                    mimeType: "image/jpeg",
                }
                
                fileTransfer.upload(this.image, this.constant.rootUrl+'woking_site_pics?id='+this.inserted_id, options)
                .then((data) => {
                    console.log(data);
                    loader.dismiss();
                    this.get_siteImages();
                });
            }
        })
    }
    
    ngOnInit() {
    }
    
    delete_array:any = [];
    filter_array(args)
    {
        this.delete_array= [];
        this.image_list.forEach(element => {
            console.log(element);
            
            element.site_images.forEach(row => {
                if(args == 'selectAll')
                {
                    row.checked = true;
                }
                
                if(args == 'delete')
                {
                    if(row.checked && row.checked == true)
                    {
                        this.delete_array.push(row);
                    }
                }
            });
        });
        
        if(args == 'selectAll')
        {
            this.del_per = true;
        }
    }
    
    action:any='';
    del_per:any=false;
    presentPopover()
    {
        const popover = this.popoverCtrl.create(SitePopoverPage,{
            data:this.action,
            delete:this.del_per
        });
        popover.present();
        
        popover.onDidDismiss(data=>{
            console.log(data);
            if(data)
            {
                this.action = data;
            }
            
            console.log(this.action);
            
            if(this.action == 'Select All')
            {
                this.filter_array('selectAll');
            }
            
            if(this.action == 'Deselect')
            {
                this.action = '';
                this.del_per = false;
            }
            
            if(this.action == "Delete")
            {
                this.filter_array('delete');
                
                console.log(this.image_list);
                console.log(this.delete_array);
                
                let updateAlert = this.alertCtrl.create({
                    title: 'Delete',
                    message: 'Are you sure,want to delete this!',
                    buttons: [
                        {
                            text: 'No',
                            handler:() =>{
                                this.action = 'Select';
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                console.log(this.delete_array);
                                this.db.post_rqst({"data":this.delete_array},"app_karigar/delete_site_pics")
                                .subscribe(resp=>{
                                    console.log(resp);
                                    this.get_siteImages();
                                })
                            }
                        }
                    ]
                });
                updateAlert.present();
            }
        })
    }
    
    viewDetail(image)
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": image}).present();
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