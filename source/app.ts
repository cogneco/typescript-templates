
import * as Rest from "./RestClient"
import { Timer } from "./Timer"
import * as Runner from "./Runner"

function testPost(timer: Timer) {
	var connection = new Rest.Connection("jsonplaceholder.typicode.com", false, undefined, timer)
	return (serial: number) => connection.post("/posts", { title: "foo", body: "bar", userId: 1 }).when(response => response.status.code == 201)
}
function testGet(timer: Timer) {
	var connection = new Rest.Connection("jsonplaceholder.typicode.com", false, undefined, timer)
	return (serial: number) => connection.get("/posts/1").when(response => response.status.code == 200 ? response.body : undefined).then(body => !!body)
}
function gitHubGet(timer: Timer) {
	var connection = new Rest.Connection("api.github.com", true, undefined, timer)
	return (serial: number) => connection.get("/users/cogneco/repos").when(response => response.status.code == 200 ? response.body : undefined).then(body => body != undefined)
}
function localGet(timer: Timer) {
	var connection = new Rest.Connection("127.0.0.1", false, 8080, timer)
	return (serial: number) => connection.get("/posts/1").when(response => response.status.code == 200 ? response.body : undefined).then(body => body != undefined)
}
async function doNothing(timer: Timer) {
	return (serial: number) => new Promise((resolve, reject) => resolve(true))
}
async function main(iterationCount?: number, parallellCount?: number, rampUpTime?: number) {
	if (iterationCount)
		console.log("Running " + iterationCount + " iterations.")
	else
		console.log("Running 1 iteration.")
	if (parallellCount)
		console.log("Divided on " + parallellCount + " virtual users.")
	if (rampUpTime)
		console.log("Users ramp up over " + rampUpTime + " seconds.")
	var timer: Timer =new Timer(100)
	process.on("SIGINT", () => timer.printStatus())
	var start = Date.now()
	await Runner.start(
		//testPost(timer),
		//testGet(timer),
		//gitHubGet(timer),
		localGet(timer),
		//doNothing(timer),
		iterationCount, parallellCount, rampUpTime)
	var end = Date.now()
	timer.printStatus()
	if (!iterationCount)
		iterationCount = 1
	if (!parallellCount)
		parallellCount = iterationCount
	console.log(iterationCount + " sessions on " + parallellCount + " users" + (rampUpTime ? " ramp uped in " + rampUpTime + "s" : ""))
	console.log(iterationCount / parallellCount + " responses in " + Math.round(end - start) / 1000 + "s, " + (Math.round(iterationCount / parallellCount * 10000 / (end - start)) / 10) + " sessions / user / second")
	console.log(iterationCount + " sessions in " + Math.round(end - start) / 1000 + "s, " + (Math.round(iterationCount * 10000 / (end - start)) / 10) + " sessions / second")
}

main(parseInt(process.argv[2]), parseInt(process.argv[3]), parseInt(process.argv[4]));
