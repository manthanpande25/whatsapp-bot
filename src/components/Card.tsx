import { useState } from "react";
import { T } from "../constants/theme";
import type { CardProps } from "../types";

export function Card({
	children,
	style = {},
	className = "",
	hover = false,
}: CardProps) {
	const [hovered, setHovered] = useState(false);
	return (
		<div
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			className={className}
			style={{
				background: T.card,
				border: `1px solid ${hovered && hover ? T.jade + "55" : T.border}`,
				borderRadius: 16,
				padding: 24,
				transition: "border-color .2s, transform .2s, box-shadow .2s",
				transform: hovered && hover ? "translateY(-2px)" : "none",
				boxShadow:
					hovered && hover
						? `0 8px 32px rgba(31,232,138,.08)`
						: "none",
				...style,
			}}
		>
			{children}
		</div>
	);
}
