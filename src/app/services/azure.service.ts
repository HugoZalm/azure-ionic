import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AzureService {

  constructor(private http: HttpClient) { }

  public ocr(rawImage): Observable<any> {
    let url = 'https://westeurope.api.cognitive.microsoft.com/vision/v3.2/ocr';
    url += '?language=nl';
    url += '&detectOrientation=true';
    url += '&model-version=latest';
    const headers = new HttpHeaders();
    headers.append('Ocp-Apim-Subscription-Key', '00371130b0564afbb2c608c03dae6e8a');
    const options = { headers };
    const httpOptions = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ 'Ocp-Apim-Subscription-Key': '00371130b0564afbb2c608c03dae6e8a' })
    };
    const formData = new FormData();
    const blob = this.getBlobFromBase64(rawImage.base64String, rawImage.format);
    formData.append('file', blob, 'test' + rawImage.format);
    return this.http.post(url, formData, httpOptions);
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
