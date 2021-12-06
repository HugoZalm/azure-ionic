import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

import { AzureService } from 'src/app/services/azure.service';

@Component({
  selector: 'app-azure',
  templateUrl: 'azure.page.html',
  styleUrls: ['azure.page.scss'],
})
export class AzurePage {
  public title = 'Azure Services';
  public rawImage: Photo;
  public ocrResults = [];
  public loaderValue = 0;
  public img = null;
  public obj = null;

  constructor(
    private azure: AzureService
  ) {}

  async getImage() {
    this.rawImage = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, //  .Base64,
      source: CameraSource.Camera
    });
    console.log('image: ', this.rawImage);
    this.img = this.rawImage;
    this.azure.ocr(this.rawImage).subscribe((response) => {
      console.log('Response: ', response);
      const lines = [];
      response.regions.forEach((region) => {
        region.lines.forEach((line) => {
          let l = '';
          line.words.forEach((word) => {
            l += word.text + ' ';
          });
          lines.push(l);
        });
      });
      this.ocrResults = lines;
    });
  }

}
