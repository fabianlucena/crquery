export class Property {
  constructor(name) {
    this.name = name;
  }
  
  static isProperty(obj) { return obj instanceof Property; }
}

