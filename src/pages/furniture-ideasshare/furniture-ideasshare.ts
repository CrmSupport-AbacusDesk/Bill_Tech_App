import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ConstantProvider } from '../../providers/constant/constant';
import { TranslateService } from '@ngx-translate/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { File } from '@ionic-native/file'; 
import { FileTransfer } from '@ionic-native/file-transfer';

@IonicPage()
@Component({
    selector: 'page-furniture-ideasshare',
    templateUrl: 'furniture-ideasshare.html',
})
export class FurnitureIdeassharePage {
    
    data:any={};
    image_list:any = []
    upload_url:any="";
    index: any=0;
    loading:Loading;
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public socialShar:SocialSharing,public db:DbserviceProvider,public loadingCtrl:LoadingController,public translate:TranslateService,public constn:ConstantProvider,public transfer: FileTransfer, public file: File)
    {
        this.index = this.navParams.get("data");
        this.image_list = this.navParams.get("list");
        console.log(this.index);
        
    }
    
    download(name,fileUrl)
    {
        console.log("clicked");
        console.log(this.file.externalRootDirectory);
        console.log(this.file);
        
        window.open(fileUrl, '_system', 'location=yes');

        // const fileTransfer: FileTransferObject = this.transfer.create();
        // const url = 'http://www.example.com/file.pdf';
        // console.log("after url");
        // fileTransfer.download(fileUrl, this.file.externalRootDirectory+'DCIM/Camera/'+ name)
        // .then((entry) => {
            
        //     console.log(entry);
        //     console.log('download complete: ' + entry.toURL());
            
        //     // this.file.checkDir(this.file.dataDirectory, 'mydir').then(_ => console.log('Directory exists')).catch(err => console.log('Directory doesn\'t exist'));
            
        // }, (error) => {
        //     // handle error
        // });
    }
    
    ionViewDidLoad() {
        this.upload_url = this.constn.upload_url;
        console.log('ionViewDidLoad FurnitureIdeassharePage');
    }
    
    share(image)
    {
        this.presentLoading();
        this.socialShar.share("","",this.upload_url+image,"")
        .then(resp=>{
            console.log(resp);
            this.loading.dismiss();
        }).catch(err=>{
            console.log(err);
            this.loading.dismiss();
        })
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
