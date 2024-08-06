export default class Dto {
  constructor(name: string, properties: { [key: string]: any[] }) {
    const _class = class {};
    Object.defineProperty(_class, 'name', { value: name });
    for (const [property, decorators] of Object.entries(properties)) {
      decorators.forEach((decorator) => {
        decorator(_class.prototype, property);
      });
    }
    return _class;
  }
}
