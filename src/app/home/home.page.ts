import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonToolbar, 
  IonTitle 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ChangeDetectorRef } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { caretDownOutline, caretUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonContent, 
    IonButton, 
    IonIcon, 
    IonToolbar, 
    IonTitle
  ],
})
export class HomePage {
  private cdr = inject(ChangeDetectorRef);

  public numero: number = 0;
  public readonly MINIMO: number = 0;
  public readonly MAXIMO: number = 10;
  private readonly KEY_NUMBER: string = 'ddr_key_number';

  constructor() {
    addIcons({
      caretUpOutline,
      caretDownOutline
    });
  }

  // Se ejecuta cada vez que entras a la vista o actualizas
  async ionViewWillEnter() {
    await this.loadNumber();
  }

  // Carga el número guardado usando Capacitor Preferences
  private async loadNumber() {
    const { value } = await Preferences.get({ key: this.KEY_NUMBER });
    
    if (value !== null && value !== undefined) {
      const parsed = Number(value);
      if (!isNaN(parsed) && parsed >= this.MINIMO && parsed <= this.MAXIMO) {
        this.numero = parsed;
      } else {
        this.numero = this.MINIMO;
        await this.saveNumber();
      }
    } else {
      this.numero = this.MINIMO;
      await this.saveNumber();
    }
    
    this.cdr.markForCheck();
  }

  // Guarda el número usando Capacitor Preferences
  private async saveNumber() {
    await Preferences.set({
      key: this.KEY_NUMBER,
      value: this.numero.toString(),
    });
  }

  async counterup() {
    if (this.numero < this.MAXIMO) {
      this.numero++;
      await this.saveNumber();
      this.cdr.markForCheck();
    }
  }

  async counterdown() {
    if (this.numero > this.MINIMO) {
      this.numero--;
      await this.saveNumber();
      this.cdr.markForCheck();
    }
  }
}