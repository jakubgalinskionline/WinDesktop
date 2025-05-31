import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  imports: [],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  // Właściwości kalkulatora
  currentNumber: string = '0';  // Aktualny numer wyświetlany na kalkulatorze
  firstOperand: number | null = null; // Pierwszy operand, czyli pierwsza liczba w operacji
  operator: string | null = null; // Operator matematyczny, np. '+', '-', '*', '/', '%'
  waitForSecondNumber: boolean = false; // Flaga wskazująca, czy czekamy na drugą cyfrę

  // Konstruktor kalkulatora
  // Inicjalizuje kalkulator, ustawiając początkowe wartości
  constructor() {
    // Inicjalizacja kalkulatora
    this.clearDisplay();
  }

  // Metoda do czyszczenia wyświetlacza kalkulatora
  // Resetuje aktualny numer, pierwszy operand, operator i stan oczekiwania na drugą cyfrę
  // Ustawia aktualny numer na '0'
  // Używana przy starcie kalkulatora lub po naciśnięciu przycisku "C" (Clear)
  clearDisplay(): void {
    this.currentNumber = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitForSecondNumber = false;
  }

  // Obsługa przycisków numerycznych
  // Dodaje cyfrę do aktualnego numeru lub ustawia ją jako drugą cyfrę
  // jeśli czekamy na drugą cyfrę (waitForSecondNumber)
  addNumber(number: string): void {
    if (this.waitForSecondNumber) {
      this.currentNumber = number;
      this.waitForSecondNumber = false;
    } else {
      this.currentNumber === '0' ?
        this.currentNumber = number :
        this.currentNumber += number;
    }
  }

  // Obsługa operatorów matematycznych
  addOperation(op: string): void {
    if (this.firstOperand === null) {
      this.firstOperand = Number(this.currentNumber);
    } else if (this.operator) {
      const result = this.calculate();
      this.currentNumber = String(result);
      this.firstOperand = result;
    }
    this.operator = op;
    this.waitForSecondNumber = true;
  }

  // Obsługa obliczeń
  calculate(): number {
    if (this.firstOperand === null || this.operator === null) return 0;

    const secondOperand = Number(this.currentNumber);
    let result: number = 0;

    switch (this.operator) {
      case '+':
        result = this.firstOperand + secondOperand;
        break;
      case '-':
        result = this.firstOperand - secondOperand;
        break;
      case '*':
        result = this.firstOperand * secondOperand;
        break;
      case '/':
        result = this.firstOperand / secondOperand;
        break;
      case '%':
        result = (this.firstOperand * secondOperand) / 100;
        break;
    }

    this.firstOperand = null;
    this.operator = null;
    this.waitForSecondNumber = false;
    this.currentNumber = String(result);
    return result;
  }
  ////////////////////////////////////////////////////////// obsługa numpad
  // Obsługa klawiszy skrótów dla kalkulatora
  // przycisk "ESC" czyści ekran kalkulatora
  @HostListener('window:keyup.escape', ['$event'])
  handleEscKey(event: KeyboardEvent): void {
    this.clearDisplay();
  }

  // przycisk "Enter" wykonuje obliczenia
  @HostListener('window:keyup.enter', ['$event'])
  handleEnterKey(event: KeyboardEvent): void {
    this.calculate();
  }

  // przycisk "Backspace" usuwa ostatnią cyfrę
  @HostListener('window:keyup.backspace', ['$event'])
  handleBackspaceKey(event: KeyboardEvent): void {
    if (this.currentNumber.length > 1) {
      this.currentNumber = this.currentNumber.slice(0, -1);
    } else {
      this.currentNumber = '0';
    }
  }

  // przycisk "Del" czyści ekran kalkulatora
  @HostListener('window:keyup.delete', ['$event'])
  handleDeleteKey(event: KeyboardEvent): void {
    this.clearDisplay();
  }

  // Obsługa klawiszy numerycznych 0-9, znaku dziesiętnego i operatorów +, -, *, / z klawiatury
  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Obsługa klawiszy numerycznych (główna klawiatura)
    // if (event.key >= '0' && event.key <= '9') {
    //   this.addNumber(event.key);
    // }

    // Obsługa klawiszy numerycznych (klawiatura numeryczna)
    if (event.code >= 'Numpad0' && event.code <= 'Numpad9') {
      const number = event.code.replace('Numpad', '');
      this.addNumber(number);
    }

    // Obsługa przecinka i kropki (zamiana na kropkę dziesiętną)
    if (event.key === '.' || event.key === 'Decimal') {
      if (!this.currentNumber.includes('.')) {
        this.addNumber('.');
        // this.addNumber('0.');    // wyjątek, że jeżeli wciśnięto kropkę na numpadzie, to dodaje 0 przed kropką
      }
    }
    // Obsługa klawiatury numerycznej dla przecinka
    if (event.code === 'NumpadDecimal') {
      if (!this.currentNumber.includes('.')) {
        this.addNumber('.');
        // this.addNumber('0.');    // wyjątek, że jeżeli wciśnięto kropkę na numpadzie, to dodaje 0 przed kropką
      }
    }

    // Obsługa operatorów
    switch (event.key) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        this.addOperation(event.key);
        break;
    }
  }
  ////////////////////////////////////////////////////////// obsługa numpad
}
