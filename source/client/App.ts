import { UserInterface } from "./UserInterface"
console.info("App starting.")
const ui = new UserInterface(window.document)
ui.render()
console.info("App running.")

if (development) {
	if (module.hot) {
		module.hot.accept()
	}
}
