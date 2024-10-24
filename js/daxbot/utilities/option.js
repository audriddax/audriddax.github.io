class Some {
  #value;

  constructor(value) {
    this.#value = value;
  }

  match(onSome, onNone) {
    return onSome(this.#value);
  }

  static of(value) {
    return new Some(value);
  }
}

class None {
  match(onSome, onNone = () => {}) {
    return onNone();
  }

  static of() {
    return new None();
  }
}

export { Some, None };
