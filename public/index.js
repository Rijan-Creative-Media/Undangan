const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const createElement = document.createElement.bind(document);

window.MAX_VOLUME = 0.5;
window.Volume = new Smooth(MAX_VOLUME, 0.05, 0);

window.addEventListener("load", function () {
	let isPlaying = false;

	const audio = new Audio('./Maher Zain - Baraka Allahu Lakuma.mp3')
	if (localStorage.seek) audio.currentTime = localStorage.seek
	audio.addEventListener("ended", function () {
		audio.currentTime = 0
		audio.play()
		isPlaying = true
	})

	window.addEventListener('beforeunload', () => {
		localStorage.seek = audio.currentTime
	})

	const openBtn = $("#open-btn");
	const muteBtn = $("#mute-toggle");
	const submitBtn = $("button.submit");
	const header = $(".header");
	const form = $("form");
	window.document.body.style.overflow = "hidden";
	openBtn.addEventListener("click", function () {
		header.classList.toggle("hide-slide-up");
		window.document.body.style.overflow = "";
		audio.play()
		isPlaying = true;

		const audioCtx = new AudioContext()
		const analyser = audioCtx.createAnalyser()
		const gainNode = audioCtx.createGain()
		const source = audioCtx.createMediaElementSource(audio)

		source.connect(analyser).connect(gainNode).connect(audioCtx.destination)

		analyser.fftSize = 2 ** 12;
		analyser.maxDecibels = -32;
		analyser.minDecibels = -35;

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);
		let MaxPeak = new Array(bufferLength).fill().map(() => new Peak(0, 0.09))
		if (true) {
			const WIN = window.open('', '_blank', "width=200,height=100")
			let VISUALIZER = true
			window.onbeforeunload = function () {
				WIN.close()
			}
			WIN.onbeforeunload = function () {
				VISUALIZER = false
			}
			const document = WIN.document
			document.body.style.margin = 0
			const canvas = document.createElement('canvas')
			document.body.appendChild(canvas)
			const ctx = canvas.getContext('2d');

			function drawGraph(arr, minValue, maxValue) {
				ctx.beginPath()
				for (let i in arr) {
					const x = i / arr.length * canvas.width
					const y = canvas.height - ((arr[i] - minValue) / (maxValue - minValue) * canvas.height)

					if (i === 0) {
						ctx.beginPath();
						ctx.moveTo(x, y);
					} else ctx.lineTo(x, y);
					if (i === arr.length - 1) ctx.closePath();
				}
				ctx.stroke();
			}

			loop()
			function loop() {
				canvas.width = WIN.innerWidth
				canvas.height = WIN.innerHeight

				for (let i in dataArray) {
					MaxPeak[i].value = dataArray[i]
					MaxPeak[i].update()
				}

				ctx.lineWidth = 1;

				ctx.strokeStyle = '#f00';
				drawGraph(dataArray.slice(0, 20), 0, 256)
				ctx.strokeStyle = '#00f';
				drawGraph(MaxPeak.slice(0, 20).map(v => v.value), 0, 256)

				if (VISUALIZER) WIN.requestAnimationFrame(loop)
			}
		}

		Volume.onUpdate(function (vol) {
			if (vol < 0.001) {
				if (isPlaying) {
					audio.pause()
					isPlaying = false
				}
			} else if (!isPlaying) {
				audio.play()
				isPlaying = true
			}

			if (gainNode) gainNode.gain.setValueAtTime(vol, audioCtx.currentTime)
		})
		const el = $(".analyser")
		let lastConfetti = 0
		const colors = ['#6b8df3', '#0d6efd', '#2e4b7d']
		setInterval(function () {
			if (document.hidden) return
			analyser.getByteFrequencyData(dataArray)

			for (let i in dataArray) {
				MaxPeak[i].value = dataArray[i]
				MaxPeak[i].update()
			}

			const v = MaxPeak.slice(4, 6).reduce((prev, curr) => prev + Math.sqrt(curr.value, 2), 0) / 2 / 256 * 10
			const now = Number(new Date())
			if (v > 0.5 && now - lastConfetti > 200) {
				lastConfetti = now;
				confetti({
					particleCount: 40,
					angle: 60,
					spread: 55,
					origin: { x: 0 },
					colors: colors,
					scalar: 0.85,
				});

				confetti({
					particleCount: 40,
					angle: 120,
					spread: 55,
					origin: { x: 1 },
					colors: colors,
					scalar: 0.85
				});
			}
			el.style.opacity = v > 0.01 ? Math.floor(v * 100) * 0.01 : 0
			// console.log(sum / dataArray.length / 255)
		})
	});
	muteBtn.addEventListener("click", function () {
		const buttonIcon = $('#mute-toggle [class*=fa-]')
		buttonIcon.classList.toggle("fa-beat-fade");
		Volume.value = buttonIcon.classList.contains("fa-beat-fade") ? MAX_VOLUME : 0
	});
	form.addEventListener("change", function () {
		validate(form)
	})
	form.addEventListener('submit', function (event) {
		event.preventDefault()
		event.stopPropagation()

		submitForm(form).catch(err => {
			validate(form, {
				[err.param]: true
			})
		})
	})
	submitBtn.addEventListener("click", function () {
		submitForm(form)
	});
	AOS.init();

	ShowGreetings();

	var COUNTDOWN = [
		{
			countdown: new CountDown('19 June 2024 15:00:00'),
			selector: '.container#countdownAkad1'
		},
		{
			countdown: new CountDown('30 June 2024 08:00:00'),
			selector: '.container#countdownAkad2'
		},
		{
			countdown: new CountDown('04 August 2024 09:00:00'),
			selector: '.container#countdownResepsi1'
		},
		{
			countdown: new CountDown('30 June 2024 10:30:00'),
			selector: '.container#countdownResepsi2'
		},
		{
			countdown: new CountDown('18 August 2024 14:00:00'),
			selector: '.container#countdown'
		},
	]
	for (const C of COUNTDOWN) {
		console.log(document.querySelector(C.selector))
	}
	setInterval(function () {
		for (const C of COUNTDOWN) {
			document.querySelector(C.selector).querySelectorAll('span').forEach((el, i) => {
				el.innerText = C.countdown.countdown[i].toString().padStart(2, '0')
			})
		}
	}, 250)
});

async function loadGreetings() {
	const res = await fetch("/comment");
	if (res.status !== 200) throw new Error("Something went wrong");
	const json = await res.json();
	return json;
}

class CountDown {
	constructor(eventTime) {
		this.eventTime = moment(eventTime);
	}

	get countdown() {
		const c = moment()
		const D = this.eventTime.diff(c)
		if (D < 0) return [0, 0, 0, 0]
		const d = moment.duration(D)
		const r = ['', 'hours', 'minutes', 'seconds'].map(v => d[v] ? d[v]() : '')
		r[0] = this.eventTime.diff(c, 'days')
		return r
	}
}
function countdown(eventTime) {
	const d = moment.duration(moment(eventTime).diff(moment()))
	return r
}

function validate(form = document.querySelector('form'), isInvalidOverride = {}) {
	const inputs = form.querySelectorAll('[name]')
	for (let input of inputs) {
		let isInvalid = false
		const value = input.value.trim()

		input.classList.remove('is-invalid')
		const name = input.getAttribute('name')
		switch (name) {
			case 'name':
				isInvalid = value === undefined || value == '' || value.length < 1 || value.length > 100
				break
			case 'attendance':
				break
			case 'greet':
				isInvalid = value === undefined || value == '' || value.length < 1 || value.length > 32678
				break
		}
		isInvalid = isInvalidOverride[name] || isInvalid
		if (isInvalid) input.classList.add('is-invalid')
	}
}

async function submitForm(form = document.querySelector('form')) {
	const body = new URLSearchParams(new FormData(form))
	form.querySelectorAll('[name]').forEach(el => el.disabled = true)
	const res = await fetch(form.action, {
		method: "post",
		body,
	});
	form.querySelectorAll('[name]').forEach(el => el.disabled = false)
	if (res.status == 200) {
		form.querySelectorAll('[name]:not(select)').forEach(el => el.value = '')
		await ShowGreetings();
	} else {
		const json = await res.json()
		const err = new TypeError(json.message)
		err.param = json.param
		throw err
	}
}

async function ShowGreetings() {
	const values = await loadGreetings();
	const COMMENT_ELEMENT = $("div.comments");
	const COMMENT_TEMPLATE = $("template.comments");

	COMMENT_ELEMENT.innerHTML = "";
	for (const comment of values) {
		const cloned = COMMENT_TEMPLATE.content.cloneNode(true);
		const date = new Date(comment.d);
		const dateFormat = date
			.toLocaleString("id-ID", {
				day: "numeric",
				month: "long",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
			})
			.replace("pukul ", "")
			.replace(".", ":")
			.toString();
		const attendance = Object.fromEntries(
			[...$("#attendance").options].map((v) => [v.value, v.textContent]),
		)[comment.a];;
		const color = {
			attend: 'green',
			'not-attend': 'red',
			unsure: 'yellow',
		}[comment.a]

		cloned.querySelector(".block span:nth-child(1)").textContent =
			comment.n || "";

		const attendanceEl = cloned.querySelector(".block span:nth-child(2)")
		attendanceEl.className += ` bg-${color}-100 text-${color}-800`
		attendanceEl.textContent = attendance || "";

		cloned.querySelector(".block div.text-sm").textContent = comment.t || "";
		cloned.querySelector("small").textContent = dateFormat || "";

		COMMENT_ELEMENT.prepend(cloned);
	}
}