import {Component, OnDestroy} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {MQTTService} from "ionic-mqtt";


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})

export class HomePage implements OnDestroy{

    show=false;

    private _mqttClient: any;

    private MQTT_CONFIG: {
        host: string,
        port: number,
        clientId: string,
    } = {
        host: "broker.hivemq.com",
        port: 8000,
        clientId: "",
    };

    private TOPIC: string[] = [];


    async presentAlert(string) {
        const alert = await this.alertController.create({
            header: 'Alert',
            subHeader: 'Subtitle',
            message: string,
            buttons: ['OK']

        });

        await alert.present();
    }

    constructor(private modalCtrl: ModalController,private androidPermissions: AndroidPermissions,
               public alertController: AlertController,private mqttService: MQTTService) {

        /**
         *
         * Controllo se l'app è già in possesso dei permessi
         *
         */
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
            result => console.log("Risultato richiesta permessi : ",result.hasPermission),

            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
        );

        /**
         *  Richiesta permessi per la CAMERA
         */

        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);


    }

    public ngOnDestroy() {

    }


    ngOnInit(){
        console.log("Inizio mqtt");
       this._mqttClient = this.mqttService.loadingMqtt(this._onConnectionLost, this._onMessageArrived, this.TOPIC, this.MQTT_CONFIG);

    }


    private _onConnectionLost(responseObject) {
        console.log("CONNESSIONE PERSA");
        console.log(JSON.stringify(responseObject));
    }

    private _onMessageArrived(message) {
        console.log("MESSAGGIO ARRIVATO");
        console.log('message', message);
    }


    showFrame(){

                this.show = !this.show;
                var that = this;
                setTimeout(function () {
                    // that.interactOn();
                    that.genText();
                },4000);
    }

    close(){
        this.modalCtrl.dismiss();
        window.location.reload()
    }


    test;

    interactOn(){
        alert("interactOn");
        var iframe = document.getElementById('frameAR') as HTMLFrameElement;
        var innerDoc = iframe.contentWindow.document;

        innerDoc.addEventListener('touchend', function(event){

            alert('iframe touched');


        }, false);
      /*  var scene = innerDoc.getElementById("sceneAR");
        var testModel;
        var model = scene.querySelectorAll("a-entity").forEach(function (model) {
            if (model.id == "man") {
             this.testModel = model;
            }
        });
        testModel.addEventListener("touched",function (event) {
           // if(this.getAttribute("rotation") == "0 -90 0"){
                this.setAttribute("rotation","0 90 0")
           // }else{
           //     this.setAttribute("rotation","0 -90 0")
           // }
        })
        //testModel.setAttribute("rotation","90 90 90")*/

    }


    genText(){
        var iframe = document.getElementById('frameAR') as HTMLFrameElement;
        var innerDoc = iframe.contentWindow.document;
        var that = this;
        var scene = innerDoc.getElementById("sceneAR");


        scene.querySelectorAll("a-text").forEach(function (item) {
            if(item.id == "postiLiberi"){
                   item.setAttribute('value',"Posti Liberi : "+(Math.random()*20).toString().substr(0,2));
            }else if(item.id=="postiOccupati"){
                    item.setAttribute('value',"Posti Occupati : "+(Math.random()*20).toString().substr(0,2));
            }
        });

        setTimeout(function () {
            that.genText();
        },5000);


    }



}