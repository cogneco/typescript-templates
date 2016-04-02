/// <reference path="tsd.d.ts" />

export class Timer {
	private histogram: Histogram
	private failures: { [index: string]: number } = {}
	private started = 0
	private succeded = 0
	private failed = 0
	private start = Date.now()
	constructor(divisor?: number) {
		this.histogram = new Histogram(divisor ? divisor : 10)
	}
	getHistogram(): Histogram {
		return this.histogram
	}
	getFailures(): { [index: string]: number } {
		return this.failures
	}
	getSucceded(): number {
		return this.succeded
	}
	getFailed(): number {
		return this.failed
	}
	printStatus() {
		var end = Date.now()
		console.log("Timer Histogram:")
		console.log(this.histogram.toString())
		console.log(this.histogram.toCsv())
		console.log("Failures:")
		console.log(this.failures)
		var finished = this.succeded + this.failed
		console.log("Ongoing: " + (this.started - finished) + " of " + this.started + " (" + Math.round((this.started - finished) / this.started * 1000) / 10 + "%)")
		console.log("Failed: " + this.failed + " (" + Math.round(this.failed / finished * 100) / 10 + "%)")
		console.log("Average time to successfull response: " + Math.round(this.histogram.getAverage()) + "ms.")
		console.log(this.succeded + " successfull responses in " + Math.round(end - this.start) / 1000 + "s, " + (Math.round(this.succeded * 10000 / (end - this.start)) / 10) + " responses / second")
	}
	wrap<T>(promise: Promise<T>): Promise<T> {
		var start = Date.now()
		this.started++
		return promise.then(value => {
			this.succeded++
			this.histogram.add(Date.now() - start)
			return value
		}, (reason: any) => {
			var index: string
			this.failed++
			if (reason)
				index = "code" in reason ? reason.code : "errno" in reason ? reason.errno : "unknown"
			else
				index = "unknown"
			var current = this.failures[index]
			this.failures[index] = (current ? current : 0) + 1
			return null
		})
	}
}
export class Histogram {
	private data = <number[]> []
	constructor(private divisor: number) {
	}
	getAverage(): number {
		var count = 0
		var sum = 0
		this.data.forEach((value, key) => { count += value; sum += key * value })
		return sum / count * this.divisor
	}
	add(time: number) {
		var index = Math.round(time / this.divisor)
		var current = this.data[index]
		this.data[index] = (current ? current : 0) + 1
	}
	addFailure() {
		var current = this.data[0]
		this.data[0] = (current ? current : 0) + 1
	}
	merge(other: Histogram) {
		other.data.forEach((value, index) => this.data[index] += value)
	}
	toString(): string {
		var result: {[center: number]: number } = {}
		this.data.forEach((value, key) => result[key * this.divisor] = value)
		return JSON.stringify(result, undefined, " ")
	}
	toCsv(): string {
		return  this.data.map((value, key) => key && key.toString() != "" ? key * this.divisor : 0).join(",") + "\n" + this.data.map(value => value && value.toString() != "" ? value : 0).join(",")
	}
}