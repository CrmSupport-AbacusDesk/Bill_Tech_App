import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeviceOrientation} from '@ionic-native/device-orientation';

@IonicPage()
@Component({
    selector: 'page-compass',
    templateUrl: 'compass.html',
})
export class CompassPage {
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public deviceOrientation: DeviceOrientation) {
    }
    
    ionViewDidLoad() {
        // this.get_cur_loc();
        console.log('ionViewDidLoad CompassPage');
    }
    
    location:any=0
    deg:any=0
    
    // get_cur_loc()
    // {
    //     this.deviceOrientation.getCurrentHeading().then((data: DeviceOrientationCompassHeading) => {
    //         console.log(data)
    //         this.location = data['magneticHeading'];
    //     },(error: any) => console.log(error));
        
    //     var subscription = this.deviceOrientation.watchHeading()
    //     .subscribe((data: DeviceOrientationCompassHeading) => {
    //         this.deg = "rotate("+Math.round(data['magneticHeading'])+"deg)";

    //     });
    // }
}
