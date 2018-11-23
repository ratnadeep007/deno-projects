export class Calculator {
  a: number;
  b: number;

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
}