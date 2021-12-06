import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AzurePage } from './azure.page';

import { AzurePageRoutingModule } from './azure-routing.module';
import { HttpModule } from '@angular/http';
import { ImageComponent } from '../../components/image/image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AzurePageRoutingModule,
    HttpModule
  ],
  declarations: [
    AzurePage,
  ImageComponent
  ]
})
export class AzurePageModule {}
