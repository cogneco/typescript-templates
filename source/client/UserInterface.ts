export class UserInterface {
	constructor(private document: Document) {
	}
	render() {
		const h1 = this.document.createElement("h2")
		h1.textContent = "Hello World!"
		this.document.body.appendChild(h1)
	}
}
