import { Component } from '@angular/core';
import { createWorker } from 'tesseract.js';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import * as lena from 'lena-ts';

import { AlertController } from '@ionic/angular';
import { Http , Headers, RequestOptions} from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  worker: Tesseract.Worker;
  workerReady = false;
  title = 'OCR';
  processedImage = '';
  rawImage: Photo;
  image = '';
  images = [
    'assets/images/eng_bw.png',
    'assets/images/Cars102.png',
    'assets/images/Cars244.png',
    'assets/images/Cars315.png'
  ];
  ocrResults = [];
  loaderValue = 0;
  captureProgress = 0;
  showImages = false;

  cameraActive = false;


  constructor(
    private alertController: AlertController,
    private http: Http
  ) {
    this.loadWorker();
  }

  async loadWorker() {
    this.worker = createWorker({
      logger: progress => {
        console.log(progress);
        if (progress.status === 'recognizing text') {
          this.loaderValue = parseFloat('' + progress.progress);
          this.captureProgress = parseInt('' + progress.progress * 100, 10);
        }
      }
    });
    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    console.log('Worker loaded');
    this.workerReady = true;
  }

  setImage(image) {
    this.image = image;
    this.processedImage = '';
    this.ocrResults = [];
    this.showImages = false;
  }

  processImage(image) {
    // this.processedImage = image;
    this.ocrResults = [];
    const originalImage = document.getElementById('original-image') as HTMLImageElement;
    const filteredImageCanvas = document.getElementById('filtered-image') as HTMLCanvasElement;
    const filter = lena.grayscale;
    lena.filterImage(filteredImageCanvas, filter, originalImage);
    this.processedImage = filteredImageCanvas.toDataURL('image/png');
  }

  async recognizeImageJS(image) {
    this.ocrResults = ['processing ...'];
    const result = await this.worker.recognize(image);
    console.log(result);
    this.ocrResults = [result.data.text];
  }

  async recognizeImageAzure(image) {
    this.ocrResults = ['processing ...'];
    let url = 'https://westeurope.api.cognitive.microsoft.com/vision/v3.2/ocr';
    url += '?language=nl';
    url += '&detectOrientation=true';
    url += '&model-version=latest';
    const headers = new Headers();
    // headers.append('content-type','multipart/form-data');
    headers.append('Ocp-Apim-Subscription-Key','00371130b0564afbb2c608c03dae6e8a');
    const options = new RequestOptions({ headers});
    const formData = new FormData();
    const blob = this.getBlobFromBase64(this.rawImage.base64String, this.rawImage.format);
    formData.append('file', blob, 'test' + this.rawImage.format);
    this.http.post(url, formData, options).subscribe((result) => {
      console.log(result.json());
      const lines = [];
      result.json().regions.forEach((region) => {
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

  async captureImage() {
    this.rawImage = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
    console.log('image: ', this.rawImage);
    this.image = this.rawImage.dataUrl;
    this.processedImage = '';
    this.ocrResults = [];
  }

  public closeImages() {
    this.showImages = false;
  }

  async recognizeImageAzureFixed(image) {
    this.ocrResults = ['processing ...'];
    let url = 'https://westeurope.api.cognitive.microsoft.com/vision/v3.2/ocr';
    url += '?language=nl';
    url += '&detectOrientation=true';
    url += '&model-version=latest';
    const headers = new Headers();
    headers.append('content-type','application/json');
    headers.append('Ocp-Apim-Subscription-Key','00371130b0564afbb2c608c03dae6e8a');
    const options = new RequestOptions({ headers});
    const data = {
      url: 'https://content.wijkopenautos.nl/static/car_images/europese-nummerplaat-belgie.jpg'
    };
    await this.http.post(url, JSON.stringify(data), options).subscribe((result) => {
      console.log(result.json());
      const lines = [];
      result.json().regions.forEach((region) => {
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


  async selectImage() {
    const alert = await this.alertController.create({
      cssClass: 'alert',
      header: 'Kiest',
      message: 'Kies de te gebruiken foto-set.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'B',
          handler: () => {
            this.loadImages('B');
            this.showImages = true;
          }
        },
        {
          text: 'NL',
          handler: () => {
            this.loadImages('NL');
            this.showImages = true;
          }
        },
        {
          text: 'ALL',
          handler: () => {
            this.loadImages('ALL');
            this.showImages = true;
          }
        },
        {
          text: 'Text',
          handler: () => {
            this.loadImages('Text');
            this.showImages = true;
          }
        }
      ]
    });
    await alert.present();
  }

  private loadImages(type) {
    switch(type) {
      case 'NL':
        this.images = [
          'assets/images/NL/2.png',
          'assets/images/NL/3.png',
          'assets/images/NL/4.png',
          'assets/images/NL/5.png',
          'assets/images/NL/6.png'
        ];
        break;
      case 'B':
        this.images = [
          'assets/images/B/1-AAA-111.jpg',
          'assets/images/B/1-ABC-123.jpg',
          'assets/images/B/RE-585.jpg',
          'assets/images/B/32.png',
          'assets/images/B/40.png'
        ];
        break;
      case 'ALL':
        this.images = [
          'assets/images/ALL/Cars102.png',
          'assets/images/ALL/Cars244.png',
          'assets/images/ALL/Cars315.png'
        ];
        break;
      case 'Text':
        this.images = [
          'assets/images/Text/eng_bw.png',
        ];
        break;
      }
  }

  private getBlobFromBase64(base64, contentType) {
    console.log(base64);
    const sliceSize = 512;
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
