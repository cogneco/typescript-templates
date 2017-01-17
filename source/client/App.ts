import { UserInterface } from "./UserInterface"
console.info("App starting.")
const ui = new UserInterface(window.document)
ui.render()
console.info("App running.")

if (development) {
	type HotModule = NodeModule & { hot?: { accept() } }
	if ((module as HotModule).hot) {
		(module as HotModule).hot.accept()
	}
}
