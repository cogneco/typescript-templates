/// <reference path="tsd.d.ts" />
export class Result {
	private promise: Promise<void>
	constructor(private task: (serial: number) => Promise<boolean>, private iterationCount?: number, private parallellCount?: number, private rampUpTime?: number) {
		if (!this.iterationCount)
			this.iterationCount = 1
		if (!this.parallellCount)
			this.parallellCount = this.iterationCount
		if (!this.rampUpTime)
			this.rampUpTime = 0
	}
	private async delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	private async runTask() {
		var serial = this.iterationCount--
		if (serial > 0) {
			await this.task(serial)
			await this.runTask()
		}
	}
	async run() {
		var sessions: Promise<void>[] = []
		if (this.rampUpTime) {
			var rampUpDelay = this.rampUpTime * 1000 / this.parallellCount
			for (var index = 0; index < this.parallellCount; index++) {
				sessions[index] = this.runTask()
				await this.delay(rampUpDelay)
			}
		} else
			for (var index = 0; index < this.parallellCount; index++)
				sessions[index] = this.runTask()
		await Promise.all(sessions)
	}
}
export async function start(task: (serial: number) => Promise<boolean>, iterationCount?: number, parallellCount?: number, rampUpTime?: number): Promise<Result> {
	var result = new Result(task, iterationCount, parallellCount, rampUpTime)
	return result.run().then(() => result)
}
