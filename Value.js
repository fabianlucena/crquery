export class Value {
  constructor(name) {
    this.name = name;
  }
  
  static isValue(obj) { return obj instanceof Value; }
}

