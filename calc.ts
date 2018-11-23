export class Calculator {
  a: number;
  b: number;

  constructor(num1: number, num2: number) {
    this.a = num1;
    this.b = num2;
  }

  add(): number {
    return this.a + this.b;
  }

  substract(): number {
    return this.a - this.b;
  }

  multiply(): number {
    return this.a * this.b;
  }

  divide(): number {
    return this.a / this.b;
  }

  remainder(): number {
    return this.a % this.b;
  }
}