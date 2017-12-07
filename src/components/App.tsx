import * as React from "react"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { css } from "glamor"

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
const randomN = (random: () => number, min: number, max: number) =>
	min + Math.floor(random() * (max + 1 - min))

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

class LinearRandom extends Component<{ samples: number; colors: number }> {
	view() {
		return (
			<Section title={`${this.props.colors} colors`}>
				{iter(this.props.samples, i => {
					const angle = random() * 360
					const allColors = anglesWithSeparation(30)
					const colors = sampleWithoutReplacement(this.props.colors, allColors)
					const gradient = colors.map(hsl).join(", ")
					return (
						<Circle gradient={`linear-gradient(-${angle}deg, ${gradient})`} />
					)
				})}
			</Section>
		)
	}
}

class RadialRandom extends Component<{ samples: number; colors: number }> {
	view() {
		return (
			<Section title={`${this.props.colors} colors`}>
				{iter(this.props.samples, i => {
					const allColors = anglesWithSeparation(30)
					const colors = sampleWithoutReplacement(this.props.colors, allColors)
					const gradient = colors.map(hsl).join(", ")
					return <Circle gradient={`radial-gradient(${gradient})`} />
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

class App extends Component<{}> {
	view() {
		const components: Array<React.ReactNode> = [
			<Demo />,
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
			<Group title="Linear gradient, > 2 colors">
				<LinearRandom samples={30} colors={3} />
				<LinearRandom samples={30} colors={4} />
				<LinearRandom samples={30} colors={5} />
				<LinearRandom samples={30} colors={6} />
				<LinearRandom samples={30} colors={7} />
			</Group>,
			<Group title="Radial gradient, > 2 colors">
				<RadialRandom samples={30} colors={3} />
				<RadialRandom samples={30} colors={4} />
				<RadialRandom samples={30} colors={5} />
				<RadialRandom samples={30} colors={6} />
				<RadialRandom samples={30} colors={7} />
			</Group>,
			<InteractiveTwoExamples />,
			<InteractiveThreeExamples />,
			<Group title="User Badge Ideas">
				<Section title="Radial">
					{iter(100, i => {
						const allColors = anglesWithSeparation(30)
						const nColors = randomN(random, 3, 4)
						const colors = sampleWithoutReplacement(nColors, allColors)
						const gradient = colors.map(hsl).join(", ")
						const letter = String.fromCharCode(randomN(random, 65, 65 + 25))
						return (
							<Badge gradient={`radial-gradient(${gradient})`} name={letter} />
						)
					})}
				</Section>
				<Section title="Linear">
					{iter(100, i => {
						const angle = random() * 360
						const allColors = anglesWithSeparation(30)
						const nColors = randomN(random, 2, 6)
						const colors = sampleWithoutReplacement(nColors, allColors)
						const gradient = colors.map(hsl).join(", ")
						const letter = String.fromCharCode(randomN(random, 65, 65 + 25))
						return (
							<Badge
								gradient={`linear-gradient(-${angle}deg, ${gradient})`}
								name={letter}
							/>
						)
					})}
				</Section>
			</Group>,
			<Group title="User Badge Examples">
				<Section title="Random Samples">
					{iter(500, i => {
						const letter = [
							String.fromCharCode(randomN(random, 65, 65 + 25)),
							String.fromCharCode(randomN(random, 65, 65 + 25)),
							String.fromCharCode(randomN(random, 65, 65 + 25)),
							String.fromCharCode(randomN(random, 65, 65 + 25)),
							String.fromCharCode(randomN(random, 65, 65 + 25)),
							String.fromCharCode(randomN(random, 65, 65 + 25)),
							String.fromCharCode(randomN(random, 65, 65 + 25)),
						].join("")
						return <UserBadge text={letter} />
					})}
				</Section>
			</Group>,
		]
		return components
	}
}

class UserBadge extends Component<{ text: string }> {
	view() {
		const string = this.props.text

		const seed = Array.from(string)
			.map((c, i) => c.charCodeAt(0) * Math.pow(2, 8 * i))
			.reduce((x, y) => x + y, 0)
		const rand = generator(seed)

		const allColors = anglesWithSeparation(30)
		// const linear = randomN(rand, 0, 1) === 0
		let cssGradient: string
		const angle = randomN(rand, 1, 360)
		const baseColor = randomN(rand, 1, 360)
		const sweep = randomN(rand, 30, 40)
		const gradient = [baseColor, baseColor + sweep].map(hsl).join(", ")
		// if (linear) {
		cssGradient = `linear-gradient(-${angle}deg, ${gradient})`
		// } else {
		// 	cssGradient = `radial-gradient(${gradient})`
		// }

		return <Badge gradient={cssGradient} name={string} />
	}
}

const text = new Value("")

class Demo extends Component<{}> {
	view() {
		const string = text.get()
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
				}}
			>
				<UserBadge text={string} />
				<input
					placeholder="Type something..."
					style={{ margin: 8 }}
					value={string}
					onChange={e => text.set(e.target.value)}
				/>
			</div>
		)
	}
}

const spread = new Value(80)

class InteractiveTwoExamples extends Component<{}> {
	view() {
		const allColors = anglesWithSeparation(30)
		return (
			<Group title="Interactive 2 colors">
				<div>
					<div style={{ width: 60 }}>{Math.round(spread.get())}</div>
					<input
						type="range"
						value={spread.get() / 360 * 100}
						onChange={(e: any) => spread.set(e.target.value / 100 * 360)}
					/>
				</div>
				<Section title="Linear">
					{allColors.map(angle => (
						<Circle
							key={angle}
							gradient={`linear-gradient(-37deg, ${hsl(angle)},${hsl(
								angle + spread.get()
							)})`}
						/>
					))}
				</Section>
				<Section title="Radial">
					{allColors.map(angle => (
						<Circle
							key={angle}
							gradient={`radial-gradient(${hsl(angle)},${hsl(
								angle + spread.get()
							)})`}
						/>
					))}
				</Section>
			</Group>
		)
	}
}

const split = new Value(60)
class InteractiveThreeExamples extends Component<{}> {
	view() {
		const allColors = anglesWithSeparation(30)
		return (
			<Group title="Interactive 3 color split complementary">
				<div>
					<div style={{ width: 60 }}>{Math.round(split.get())}</div>
					<input
						value={split.get() / 360 * 100}
						type="range"
						onChange={(e: any) => split.set(e.target.value / 100 * 360)}
					/>
				</div>
				<Section title="Linear">
					{allColors.map(angle => {
						const gradient = [
							angle + 180 + split.get() / 2,
							angle,
							angle + 180 - split.get() / 2,
						]
							.map(hsl)
							.join(", ")
						return (
							<Circle
								key={angle}
								gradient={`linear-gradient(-37deg, ${gradient})`}
							/>
						)
					})}
				</Section>
				<Section title="Radial">
					{allColors.map(angle => {
						const gradient = [
							angle + 180 + split.get() / 2,
							angle,
							angle + 180 - split.get() / 2,
						]
							.map(hsl)
							.join(", ")
						return (
							<Circle key={angle} gradient={`radial-gradient(${gradient})`} />
						)
					})}
				</Section>
			</Group>
		)
	}
}

class Group extends Component<{ title: string }> {
	private open = new Value(false)

	private renderButton() {
		if (this.open.get()) {
			return (
				<button
					style={{
						border: 0,
						outline: "none",
						margin: 0,
						padding: 2,
						borderRadius: 99,
						marginRight: 5,
						transform: "rotate(90deg)",
						transition: "transform 200ms ease-in-out",
						cursor: "pointer",
					}}
					onClick={() => this.open.set(false)}
				>
					▶
				</button>
			)
		} else {
			return (
				<button
					style={{
						border: 0,
						outline: "none",
						margin: 0,
						padding: 2,
						borderRadius: 99,
						marginRight: 5,
						transform: "rotate(0deg)",
						transition: "transform 200ms ease-in-out",
						cursor: "pointer",
					}}
					onClick={() => this.open.set(true)}
				>
					▶
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
						style={{
							display: "flex",
							flexDirection: "column",
							maxWidth: 1400,
							marginLeft: 20,
							marginTop: "-1em",
							// marginBottom: "-1em",
						}}
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
				<p style={{ textAlign: "left" }}>
					<strong>{this.props.title}</strong>
				</p>
				<div
					style={{ display: "inline-flex", flexWrap: "wrap", maxWidth: "100%" }}
				>
					{this.props.children}
				</div>
			</div>
		)
	}
}

class Circle extends Component<{ gradient: string }> {
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

class Badge extends Component<{ gradient: string; name: string }> {
	view() {
		const letter = (this.props.name[0] || "").toUpperCase()
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
						mask={`url(#knockout-text${letter})`}
					/>

					<mask id={`knockout-text${letter}`}>
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
							{letter}
						</text>
					</mask>
				</svg>
			</div>
		)
	}
}

export default App
