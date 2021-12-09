import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterProductPage } from './filter-product';

@NgModule({
  declarations: [
    FilterProductPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterProductPage),
  ],
})
export class FilterProductPageModule {}
