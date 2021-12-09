import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfferProductDetailPage } from './offer-product-detail';

@NgModule({
  declarations: [
    OfferProductDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OfferProductDetailPage),
  ],
})
export class OfferProductDetailPageModule {}
