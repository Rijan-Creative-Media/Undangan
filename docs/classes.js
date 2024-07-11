class Smooth {
	constructor(initialValue = 0, step = 0.1, updateSpeed = -1) {
		this.step = step
		this._updateSpeed = updateSpeed

		this._target = initialValue
		this._value = initialValue
		this._interval = updateSpeed === -1 ? 0 : setInterval(() => {
            this.update()
        }, updateSpeed)
		this._onUpdate = new Function
	}

	update() {
		this._value += (this._target - this._value) * this.step
		if (this._onUpdate) this._onUpdate.apply(this, [this.value])
	}

	onUpdate(callback) {
		this._onUpdate = callback.bind(this)
	}

	get updateSpeed() {
		return this._updateSpeed
	}

	set value(value) {
		this._target = value
	}

	get value() {
		return this._value
	}
}

class Peak extends Smooth {
	constructor(initialValue = 0, step = 0.1, updateSpeed = -1) {
		super(initialValue, step, updateSpeed)

		this._target = 0
	}

	set value(value) {
		if (value > this._value) this._value = value
	}

	get value() {
		return this._value
	}
}