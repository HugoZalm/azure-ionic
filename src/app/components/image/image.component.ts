import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit, OnChanges {

  @ViewChild('canvas', { read: ElementRef }) myCanvas: ElementRef;
  @Input() img: any;
  @Input() obj: any;

  public result = '';

  private image = new Image();
  private canvas;
  private ctx: CanvasRenderingContext2D;
  private ratio: number;

  constructor() { }

  ngOnInit() {
    this.image.src = 'assets/images/no-image.png';
    this.image.onload = () => {
      setTimeout(() => {
        this.setupCanvas();
        this.loadImage();
      }, 1000);
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'img':
            const base64 = (
              changes.img.currentValue.base64String !== undefined
              && changes.img.currentValue.base64String !== null
              && changes.img.currentValue.base64String !== ''
              ) ? true : false;
            this.image.src = (base64)
              ? 'data:image/' + changes.img.currentValue.format + ';base64,' + changes.img.currentValue.base64String
              : changes.img.currentValue.dataUrl;
            this.image.onload = () => {
              setTimeout(() => {
                this.loadImage();
                // this.predict();
              }, 1000);
            };
            break;
          case 'obj':
            // this.doSomething(change.currentValue);
            break;
        }
      }
    }
  }

  private setupCanvas() {
    this.canvas = this.myCanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d');
  }

  private loadImage() {
    this.ratio = this.image.width / this.canvas.width;
    this.canvas.height = this.image.height / this.ratio;
    this.ctx.drawImage(this.image, 0, 0, this.image.width / this.ratio, this.image.height / this.ratio);
  }

  private predict() {
    // this.aiService.detect(this.image).then((res) => {
    //   res.forEach((r) => this.drawBox(r));
    // });
  }

  private drawBox(result) {
    const x = result.x / this.ratio;
    const y = result.y / this.ratio;
    const width = result.width / this.ratio;
    const height = result.height / this.ratio;
    const font = 14;
    const padding = 3;

    this.ctx.strokeRect( x, y, width, height);
    this.ctx.font = font + 'px serif';
    this.ctx.fillStyle = '#0000ff';
    this.ctx.fillRect( x , y, width, font + (padding * 2));
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(result.label, x + padding, y + font/2 + padding);
  }

}
