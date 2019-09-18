import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    pikachu=false;

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {

    }

    showPikachu(){
        this.pikachu = !this.pikachu;
    }

    close(){
        this.modalCtrl.dismiss();
        window.location.reload()
    }
}
