import { useState } from "react";
import { T } from "../constants/theme";
import type { BtnProps } from "../types";

export function Btn({
	children,
	variant = "primary",
	onClick,
	style = {},
	className = "",
	disabled = false,
	size = "md",
}: BtnProps) {
	const [hov, setHov] = useState(false);
	const [pressed, setPressed] = useState(false);

	const pad =
		size === "sm" ? "7px 14px" : size === "lg" ? "14px 28px" : "10px 20px";
	const fs = size === "sm" ? 13 : size === "lg" ? 15 : 14;

	const styles = {
		primary: {
			background: pressed ? T.jadeHover : hov ? "#28ffA0" : T.jade,
			color: T.forest,
			border: "none",
		},
		ghost: {
			background: "transparent",
			color: hov ? T.cream : T.muted,
			border: `1px solid ${hov ? T.border : "transparent"}`,
		},
		outline: {
			background: hov ? "rgba(255,255,255,.04)" : "transparent",
			color: hov ? T.cream : T.muted,
			border: `1px solid ${hov ? "#2a4535" : T.border}`,
		},
		danger: {
			background: hov ? "#DC2626" : T.red,
			color: T.white,
			border: "none",
		},
		amber: {
			background: hov ? "#D97706" : T.amber,
			color: T.forest,
			border: "none",
		},
	};

	return (
		<button
			disabled={disabled}
			onMouseEnter={() => setHov(true)}
			onMouseLeave={() => {
				setHov(false);
				setPressed(false);
			}}
			onMouseDown={() => setPressed(true)}
			onMouseUp={() => setPressed(false)}
			onClick={onClick}
			className={className}
			style={{
				...styles[variant],
				padding: pad,
				borderRadius: 10,
				fontSize: fs,
				fontWeight: 600,
				cursor: disabled ? "not-allowed" : "pointer",
				opacity: disabled ? 0.5 : 1,
				fontFamily: "Inter, sans-serif",
				display: "inline-flex",
				alignItems: "center",
				gap: 8,
				transition: "all .15s",
				outline: "none",
				...style,
			}}
		>
			{children}
		</button>
	);
}
