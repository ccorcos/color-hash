import * as React from "react"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import * as md5 from "md5"

// The Central Randomizer 1.3 (C) 1997 by Paul Houle (paul@honeylocust.com)
// See:  http://www.honeylocust.com/javascript/randomizer.html
// https://medium.freecodecamp.org/a-brief-history-of-random-numbers-9498737f5b6c
function generator(init: number) {
	let seed = init
	return function() {
		seed = (seed * 9301 + 49297) % 233280
		return seed / 233280.0
	}
}

const random = generator(0)

function iter<T>(n: number, fn: (i: number) => T): Array<T> {
	const result: Array<T> = []
	for (let i = 0; i < n; i++) {
		result.push(fn(i))
	}
	return result
}

function sampleWithoutReplacement<T>(n: number, list: Array<T>) {
	const sampled = [...list]
	const result: Array<T> = []
	for (let i = 0; i < n; i++) {
		const index = Math.floor(random() * sampled.length)
		result.push(sampled[index])
		sampled.splice(index, 1)
	}
	return result
}

function sampleOne<T>(list: Array<T>) {
	const index = Math.floor(random() * list.length)
	return list[index]
}

function anglesWithSeparation(sep: number) {
	const angles: Array<number> = [0]
	while (angles[angles.length - 1] < 360) {
		angles.push(angles[angles.length - 1] + sep)
	}
	return angles.slice(0, angles.length - 1)
}

function hsl(angle: number) {
	return `hsl(${angle}, 100%, 50%)`
}

const text = new Value("")

class LinearSeparation extends Component<{ sep: number }> {
	view() {
		return (
			<Section title={`${this.props.sep}°`}>
				{iter(6, i => {
					const angle = random() * 360
					const color = random() * 360
					const gradient = [color, color + this.props.sep].map(hsl).join(", ")
					return (
						<Circle gradient={`linear-gradient(-${angle}deg, ${gradient})`} />
					)
				})}
			</Section>
		)
	}
}

class RadialSeparation extends Component<{ sep: number }> {
	view() {
		return (
			<Section title={`${this.props.sep}°`}>
				{iter(6, i => {
					const color = random() * 360
					const gradient = [color, color + this.props.sep].map(hsl).join(", ")
					return <Circle gradient={`radial-gradient(${gradient})`} />
				})}
			</Section>
		)
	}
}

export class App extends Component<{}> {
	view() {
		const components: Array<React.ReactNode> = [
			<Group title="Linear gradient, 2 colors">
				<Section title="Random">
					{iter(18, i => {
						const angle = random() * 360
						const allColors = anglesWithSeparation(30)
						const colors = sampleWithoutReplacement(2, allColors)
						const gradient = colors.map(hsl).join(", ")
						return (
							<Circle gradient={`linear-gradient(-${angle}deg, ${gradient})`} />
						)
					})}
				</Section>
				<LinearSeparation sep={30} />
				<LinearSeparation sep={60} />
				<LinearSeparation sep={90} />
				<LinearSeparation sep={120} />
				<LinearSeparation sep={150} />
				<LinearSeparation sep={180} />
			</Group>,
			<Group title="Radial gradient, 2 colors">
				<Section title="Random">
					{iter(18, i => {
						const allColors = anglesWithSeparation(30)
						const colors = sampleWithoutReplacement(2, allColors)
						const gradient = colors.map(hsl).join(", ")
						return <Circle gradient={`radial-gradient(${gradient})`} />
					})}
				</Section>
				<RadialSeparation sep={30} />
				<RadialSeparation sep={60} />
				<RadialSeparation sep={90} />
				<RadialSeparation sep={120} />
				<RadialSeparation sep={150} />
				<RadialSeparation sep={180} />
			</Group>,
			<Group title="More than two colors">
				{iter(100, i => {
					// Generate an angle
					const angle = random() * 360
					// Up to 7 different colors
					const nColors = Math.ceil(1 + random() * 6)
					const allColors = [
						0,
						30,
						60,
						80,
						120,
						150,
						180,
						210,
						240,
						270,
						300,
						330,
					]
					const colors = sampleWithoutReplacement(nColors, allColors)
					const gradient = colors
						.map(angle => {
							return `hsl(${angle}, 100%, 50%)`
						})
						.join(", ")
					return (
						<Circle gradient={`linear-gradient(-${angle}deg, ${gradient})`} />
					)
				})}
				<Circle gradient="linear-gradient(-90deg, red, orange, black)" />
				<Circle gradient="linear-gradient(-37deg, red, black, orange)" />
				<Circle gradient="linear-gradient(-37deg, red, orange, green)" />
				<Circle gradient="linear-gradient(-37deg, red, blue, orange)" />
				<Circle gradient="linear-gradient(-37deg, red, blue, orange, green)" />
				<Circle gradient="linear-gradient(-37deg, red, green, orange, blue, yellow, purple)" />
				<Circle gradient="radial-gradient(red, orange, black)" />
				<Circle gradient="radial-gradient(red, black, orange)" />
				<Circle gradient="radial-gradient(red, blue, orange)" />
				<Circle gradient="radial-gradient(red, yellow, blue)" />
				<Circle gradient="radial-gradient(red, blue, orange, green)" />
				<Circle gradient="radial-gradient(red, green, orange, blue, yellow, purple)" />
			</Group>,
			<Group title="Complementary colors (180°)">
				<Circle
					gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(180, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(10, 100%, 50%), hsl(190, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(80, 100%, 50%), hsl(260, 100%, 50%))`}
				/>
			</Group>,
			<Group title="Analogous colors">
				<Circle
					gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(30, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(210, 100%, 50%), hsl(180, 100%, 50%))`}
				/>
			</Group>,
			<Group title="Triad colors">
				<Circle
					gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(120, 100%, 50%), hsl(240, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(60, 100%, 50%), hsl(180, 100%, 50%), hsl(300, 100%, 50%))`}
				/>
			</Group>,
			<Group title="Split complementary colors">
				<Circle
					gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(150, 100%, 50%), hsl(210, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(0, 100%, 50%), hsl(210, 100%, 50%))`}
				/>
			</Group>,
			<Group title="60 degrees colors">
				<Circle
					gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(210, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(180, 100%, 50%), hsl(240, 100%, 50%))`}
				/>
			</Group>,
			<Group title="150 degrees colors">
				<Circle
					gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(150, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(300, 100%, 50%))`}
				/>
				<Circle
					gradient={`linear-gradient(-37deg, hsl(180, 100%, 50%), hsl(330, 100%, 50%))`}
				/>
			</Group>,
			<InteractiveTwoExamples />,
			<InteractiveThreeExamples />,
		]
		return components
	}
}

export class Username extends Component<{}> {
	private handleChange = e => {
		text.set(e.target.value)
	}

	view() {
		const hash = md5(text.get())

		const base = Math.pow(2, 40)
		const a = parseInt(hash.slice(0, 10), 16) / base
		const b = parseInt(hash.slice(10, 20), 16) / base
		const c = parseInt(hash.slice(20, 30), 16) / base

		const angle = a * 360
		const anchor = b * 360
		const sweep = anchor + 80 + c * 40

		return (
			<div
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<Badge
					name={text.get()[0]}
					gradient={`linear-gradient(${angle}deg, hsl(${
						anchor
					}, 100%, 50%), hsl(${sweep}, 100%, 50%))`}
				/>
				<input
					placeholder="Type something..."
					style={{ margin: 8 }}
					value={text.get()}
					onChange={this.handleChange}
				/>
			</div>
		)
	}
}

const spread = new Value(80)
const starts = Array(12)
	.fill(0)
	.map((_, i) => i * 30)

export class InteractiveTwoExamples extends Component<{}> {
	private handleChange = e => {
		spread.set(e.target.value / 100 * 360)
	}

	view() {
		return (
			<div
				style={{
					display: "inline-flex",
					flexWrap: "wrap",
				}}
			>
				<Group title="2 color spread">
					<div>
						<div style={{ width: 60 }}>{Math.round(spread.get())}</div>
						<input
							value={spread.get() / 360 * 100}
							type="range"
							onChange={this.handleChange}
						/>
					</div>
					{starts.map(angle => (
						<Circle
							key={angle}
							gradient={`linear-gradient(-37deg, hsl(${
								angle
							}, 100%, 50%), hsl(${angle + spread.get()}, 100%, 50%))`}
						/>
					))}
				</Group>
			</div>
		)
	}
}

const split = new Value(60)

export class InteractiveThreeExamples extends Component<{}> {
	private handleChange = e => {
		split.set(e.target.value / 100 * 360)
	}

	view() {
		return (
			<div
				style={{
					display: "inline-flex",
					flexWrap: "wrap",
				}}
			>
				<Group title="Split complementary spread">
					<div>
						<div style={{ width: 60 }}>{Math.round(split.get())}</div>
						<input
							value={split.get() / 360 * 100}
							type="range"
							onChange={this.handleChange}
						/>
					</div>
					{starts.map(angle => (
						<Circle
							key={angle}
							gradient={`linear-gradient(-37deg, hsl(${angle +
								180 +
								split.get() / 2}, 100%, 50%),
								hsl(${angle}, 100%, 50%), hsl(${angle + 180 - split.get() / 2}, 100%, 50%))`}
						/>
					))}
				</Group>
			</div>
		)
	}
}

class Group extends Component<{ title: string }> {
	private open = new Value(false)

	private renderButton() {
		if (this.open.get()) {
			return (
				<button style={{ marginRight: 5 }} onClick={() => this.open.set(false)}>
					close
				</button>
			)
		} else {
			return (
				<button style={{ marginRight: 5 }} onClick={() => this.open.set(true)}>
					open
				</button>
			)
		}
	}

	view() {
		return (
			<div>
				<p>
					{this.renderButton()}
					<strong>{this.props.title}</strong>
				</p>
				{this.open.get() && (
					<div
						style={{ display: "inline-flex", flexWrap: "wrap", maxWidth: 700 }}
					>
						{this.props.children}
					</div>
				)}
			</div>
		)
	}
}

class Section extends Component<{ title: string }> {
	view() {
		return (
			<div>
				<p style={{ textAlign: "center" }}>
					<strong>{this.props.title}</strong>
				</p>
				<div
					style={{ display: "inline-flex", flexWrap: "wrap", maxWidth: 700 }}
				>
					{this.props.children}
				</div>
			</div>
		)
	}
}

export class Circle extends Component<{ gradient: string }> {
	view() {
		return (
			<div
				style={{
					height: 100,
					width: 100,
					borderRadius: 100,
					backgroundImage: this.props.gradient,
					margin: 8,
				}}
			/>
		)
	}
}

export class Badge extends Component<{ gradient: string; name: string }> {
	view() {
		return (
			<div
				style={{
					height: 100,
					width: 100,
					borderRadius: 100,
					margin: 8,
					backgroundImage: this.props.gradient,
				}}
			>
				<svg width="100%" height="100%">
					<circle
						cx="50%"
						cy="50%"
						r="45%"
						fill="#fff"
						fillOpacity="1"
						mask="url(#knockout-text)"
					/>

					<mask id="knockout-text">
						<rect width="100%" height="100%" fill="#fff" x="0" y="0" />
						<text
							x="50%"
							y="50%"
							fill="#000"
							textAnchor="middle"
							fontSize="50"
							alignmentBaseline="central"
							fontFamily={`-apple-system, "Helvetica", "Arial", sans-serif`}
							fontStyle="bold"
						>
							{(this.props.name[0] || "").toUpperCase()}
						</text>
					</mask>
				</svg>
			</div>
		)
	}
}

export default App
// export default Examples
