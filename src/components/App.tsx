import * as React from "react"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import * as md5 from "md5"

const text = new Value("")

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
					letter={text.get()[0]}
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

export class Examples extends Component<{}> {
	view() {
		return (
			<div
				style={{
					display: "inline-flex",
					flexWrap: "wrap",
				}}
			>
				<Group title="Linear and Radial">
					<Scheme gradient="linear-gradient(-90deg, red, orange)" />
					<Scheme gradient="linear-gradient(-37deg, red, orange)" />
					<Scheme gradient="radial-gradient(red, orange)" />
				</Group>
				<Group title="More than two colors">
					<Scheme gradient="linear-gradient(-90deg, red, orange, black)" />
					<Scheme gradient="linear-gradient(-37deg, red, orange, black)" />
					<Scheme gradient="radial-gradient(red, orange, black)" />
				</Group>
				<Group title="Complementary colors">
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(180, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(10, 100%, 50%), hsl(190, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(80, 100%, 50%), hsl(260, 100%, 50%))`}
					/>
				</Group>
				<Group title="Complementary colors">
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(180, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(10, 100%, 50%), hsl(190, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(80, 100%, 50%), hsl(260, 100%, 50%))`}
					/>
				</Group>
				<Group title="Analogous colors">
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(30, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(210, 100%, 50%), hsl(180, 100%, 50%))`}
					/>
				</Group>
				<Group title="Triad colors">
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(120, 100%, 50%), hsl(240, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(60, 100%, 50%), hsl(180, 100%, 50%), hsl(300, 100%, 50%))`}
					/>
				</Group>
				<Group title="Split complementary colors">
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(150, 100%, 50%), hsl(210, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(0, 100%, 50%), hsl(210, 100%, 50%))`}
					/>
				</Group>
				<Group title="60 degrees colors">
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(210, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(180, 100%, 50%), hsl(240, 100%, 50%))`}
					/>
				</Group>
				<Group title="150 degrees colors">
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(0, 100%, 50%), hsl(150, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(150, 100%, 50%), hsl(300, 100%, 50%))`}
					/>
					<Scheme
						gradient={`linear-gradient(-37deg, hsl(180, 100%, 50%), hsl(330, 100%, 50%))`}
					/>
				</Group>
				<InteractiveTwoExamples />
				<InteractiveThreeExamples />
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
						<Scheme
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
						<Scheme
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

function Group(props: { title: string; children: any }) {
	return (
		<div style={{ margin: 40 }}>
			<p style={{ textAlign: "center" }}>{props.title}</p>
			<div style={{ display: "inline-flex", flexWrap: "wrap", maxWidth: 700 }}>
				{props.children}
			</div>
		</div>
	)
}

export class Scheme extends Component<{ gradient: string }> {
	view() {
		return (
			<div
				style={{
					height: 100,
					width: 100,
					borderRadius: 100,
					// fallback
					// backgroundColor: "red",
					// gradient
					backgroundImage: this.props.gradient,
					margin: 8,
				}}
			/>
		)
	}
}

export class Badge extends Component<{ gradient: string; letter: string }> {
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
							{(this.props.letter || "").toUpperCase()}
						</text>
					</mask>
				</svg>
			</div>
		)
	}
}

export default Username
// export default Examples
