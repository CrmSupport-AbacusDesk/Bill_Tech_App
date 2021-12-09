import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArrivalDetailPage } from './arrival-detail';

@NgModule({
  declarations: [
    ArrivalDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ArrivalDetailPage),
  ],
})
export class ArrivalDetailPageModule {}
