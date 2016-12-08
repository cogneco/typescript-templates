import { UserInterface } from "./UserInterface"
console.log("App starting.")
const ui = new UserInterface(window.document)
ui.render()
console.log("App running.")

if (development) {
	if (module["hot"]) {
		module["hot"].accept();
	}
}