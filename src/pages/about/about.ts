import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
// import { HomePage } from '../home/home';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {
    
    constructor(public navCtrl: NavController,public viewCtrl:ViewController)
    {
        setTimeout(resp=>{
            this.closeModel();
        },4000)
    }
    
    
    closeModel()
    {
        this.viewCtrl.dismiss()
    }
}
