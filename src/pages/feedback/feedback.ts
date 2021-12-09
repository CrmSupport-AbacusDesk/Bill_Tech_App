import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, ActionSheetController, LoadingController } from 'ionic-angular';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';


@IonicPage()
@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html',    
})

export class FeedbackPage {
    
    // @ViewChild("scrollElement") content;
    @ViewChild('scrollElement') private content: any;
    data:any={};
    rootPage:any='';
    feedbackdata:any=[];
    tokenInfo:any={};
    lang:any='';
    ok:any="";
    upload_url:any = "";
    formdata = new FormData();
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public alertCtrl:AlertController,private app:App,public storage:Storage,public translate:TranslateService,public contsn:ConstantProvider,public actionSheetController: ActionSheetController,private camera: Camera,public loadingCtrl:LoadingController,private transfer: FileTransfer) {
        this.startTimer();
    }
    
    ionViewDidLoad()
    {
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp;
        })
        
        this.translate.get('Cancel')
        .subscribe(resp=>{
            this.cancl = resp;
        })
        console.log('ionViewDidLoad FeedbackPage');
        this.get_user_lang();
        this.Feedbackdata();
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp
        })
        this.upload_url = this.contsn.upload_url;
    }
    
    timeLeft: number = 20;
    interval;
    
    startTimer() {
        this.interval = setInterval(() => {
            if(this.timeLeft > 0)
            {
                this.timeLeft--;
            }
            else
            {
                this.timeLeft = 20;
                this.Feedbackdata();
            }
        },1000)
    }
    
    download(data)
    {
        window.open(data,'_self');
    }
    
    scroll()
    {
        var messagesContent = this.content;
        console.log(messagesContent.getContentDimensions());
        console.log(messagesContent.getContentDimensions().contentHeight);
        
        messagesContent.scrollToBottom(1000);
        // messagesContent.scrollTo(0, messagesContent.getContentDimensions().contentHeight, 700);
    }
    
    submitFeedback()
    {
        this.service.post_rqst({'karigar_id': this.service.karigar_id,'feedback':this.data.feedback},'app_karigar/feedback')
        .subscribe( (r) =>
        {
            console.log(r);
            this.Feedbackdata();
            this.data.feedback = '';
        });
    }
    
    doRefresh(refresher) 
    {
        console.log('Begin async operation', refresher);
        this.Feedbackdata(); 
        refresher.complete();
    }
    
    showSuccess(text)
    {
        this.translate.get("ThankYou")
        .subscribe(resp=>{
            let alert = this.alertCtrl.create({
                title:resp+'!',
                subTitle: text,
                buttons: [this.ok]
            });
            alert.present();
        })
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
    
    Feedbackdata()
    {
        this.service.post_rqst({'karigar_id': this.service.karigar_id},'app_karigar/feedback_data')
        .subscribe( (r) =>
        {
            console.log(r);
            this.feedbackdata = r.feedback;
            this.scroll();
        });
    }
    
    cam:any="";
    gal:any="";
    cancl:any="";
    upl_file:any="";
    save_succ:any="";
    
    
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
    
    image:any=""
    takePhoto()
    {
        console.log("i am in camera function");
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400
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
            quality: 70,
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
    
    save_picture()
    {
        let updateAlert = this.alertCtrl.create({
            title: 'Are you sure ?',
            message: 'You want to send this!',
            buttons: [
                {text: this.cancl, },
                {text: this.ok,
                    handler: () => {
                        
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
                        
                        fileTransfer.upload(this.image, this.contsn.rootUrl+'user_attact?id='+this.service.karigar_id, options)
                        .then((data) => {
                            console.log(data);
                            loader.dismiss();
                            this.Feedbackdata();
                        });
                    } 
                }
            ]
        });
        updateAlert.present();
    }
    
}
