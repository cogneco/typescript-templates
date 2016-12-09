import * as http from "http"
import * as url from "url"
import * as express from "express"

import injectStaticServer from "./StaticServer"

export class Server {
	private server: http.Server
	private application: express.Application
	constructor(private port: number) {
		this.application = express()
		injectStaticServer(this.application)
	}
	start() {
		this.server = this.application.listen(this.port, () => {
			console.info("Server started on port " + this.port)
		})
	}
	stop() {
		this.server.close(() => {
			console.info("Server stoped")
		})
	}
}

const server = new Server(8080)
// CTRL+C
process.on("SIGINT", () => {
	server.stop()
	process.exit()
})
server.start()
