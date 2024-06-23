export class AuthenticatedUser {
  #id: string
  #email: string

  get id() {
    return this.#id
  }

  get email() {
    return this.#email
  }

  constructor(id: string, email: string) {
    this.#id = id
    this.#email = email
  }
}
