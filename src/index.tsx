import * as React from "react"
import * as ReactDOM from "react-dom"
import * as glamor from "glamor"
import App from "./components/App"

glamor.css.global("html, body", {
	padding: "2em",
	maxWidth: "200em",
	margin: "0 auto",
	fontFamily: '-apple-system, "Helvetica", "Arial", sans-serif',
	color: "#444",
	tabSize: 4,
})

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(<App />, root)
