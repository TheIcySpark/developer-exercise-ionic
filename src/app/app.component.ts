import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  wholeNumber: number = 1; // Initialize the wholeNumber property
  numbers: number[] = []; // Array to store the numbers
  db: any

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyDtvhaO-wMqG74SG28FWK29mzYnxwXv1Ag",
      authDomain: "developer-exercise-12332.firebaseapp.com",
      projectId: "developer-exercise-12332",
      storageBucket: "developer-exercise-12332.appspot.com",
      messagingSenderId: "108224907823",
      appId: "1:108224907823:web:1bd75bafd8173e15c414da"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
  }

  validateWholeNumber(event: any) {
    const input = event.target.value;
    const parsedValue = Number(input);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
      event.target.value = '';
      this.wholeNumber = 1; // Reset to default value if invalid
    } else {
      this.wholeNumber = parsedValue;
    }
  }

  submit() {
    if (this.wholeNumber > 0) {
      this.numbers = Array.from({ length: this.wholeNumber + 1 }, (_, i) => i);
      const colors = this.numbers.map(number => this.getStyles(number));
      this.saveToFirebase(this.wholeNumber, this.numbers, colors);
    } else {
      console.log('Please enter a whole number greater than 0');
    }
  }

  getStyles(number: number): { color: string, backgroundColor: string } {
    if (number !== 0) {
      if (number % 3 === 0) return { color: 'green', backgroundColor: '#ccffcc' };
      if (number % 5 === 0) return { color: 'red', backgroundColor: '#ffcccc' };
      if (number % 7 === 0) return { color: 'blue', backgroundColor: '#ccccff' };
    }
    return { color: 'black', backgroundColor: 'white' };
  }

  async saveToFirebase(request: number, response: number[], colors: { color: string, backgroundColor: string }[]) {
    const data = {
      request: request,
      response: response,
      colors: colors,
      timestamp: new Date()
    };

    try {
      const docRef = await addDoc(collection(this.db, 'submissions'), data);
      console.log('Document written with ID: ', docRef.id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
}
