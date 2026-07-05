import React, { useState } from "react";
import { T } from "../constants/theme";
import type { InputProps } from "../types";

export function Input({
	placeholder,
	value,
	onChange,
	type = "text",
	style = {},
	className = "",
	prefix,
	multiline = false,
}: InputProps) {
	const [focused, setFocused] = useState(false);

	const base: React.CSSProperties = {
		background: T.deep,
		border: `1px solid ${focused ? T.jade + "66" : T.border}`,
		borderRadius: 10,
		padding: prefix ? "10px 14px 10px 36px" : "10px 14px",
		color: T.cream,
		fontSize: 14,
		fontFamily: "Inter, sans-serif",
		outline: "none",
		width: "100%",
		transition: "border-color .2s",
		boxSizing: "border-box",
		...style,
	};

	return (
		<div
			className={className}
			style={{ position: "relative", width: "100%" }}
		>
			{prefix && (
				<span
					style={{
						position: "absolute",
						left: 12,
						top: "50%",
						transform: "translateY(-50%)",
						pointerEvents: "none",
						display: "flex",
						alignItems: "center",
					}}
				>
					{prefix}
				</span>
			)}
			{multiline ? (
				<textarea
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					style={{ ...base, resize: "vertical", minHeight: 100 }}
				/>
			) : (
				<input
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					style={base}
				/>
			)}
		</div>
	);
}
