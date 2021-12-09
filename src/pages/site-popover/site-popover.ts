import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';

/**
* Generated class for the SitePopoverPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-site-popover',
    templateUrl: 'site-popover.html',
})
export class SitePopoverPage {
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public popoverCtrl:PopoverController,public viewCtrl:ViewController) {
    }
    
    action:any = ''
    del_per:any = ''
    ionViewDidLoad() {
        this.action = this.navParams.get('data');
        this.del_per = this.navParams.get('delete');
        console.log(this.action);
        console.log(this.del_per);
        
        console.log('ionViewDidLoad SitePopoverPage');
    }
    
    select_opt(args)
    {
        this.action = args;
        this.viewCtrl.dismiss(this.action)
    }
}
