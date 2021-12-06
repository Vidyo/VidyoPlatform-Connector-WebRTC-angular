import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app-config';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

  img: string = AppConfig.settings.imgPath;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Not implemented
   */
  joinViaApp(): void {
    console.log("Join via app");
  }

}
