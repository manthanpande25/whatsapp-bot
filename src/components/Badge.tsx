import { T } from "../constants/theme";
import type { BadgeProps } from "../types";

export function Badge({
	children,
	color = T.jade,
	bg = T.jadeDim,
	style = {},
	className = "",
}: BadgeProps) {
	return (
		<span
			className={className}
			style={{
				background: bg,
				color,
				fontSize: 11,
				fontWeight: 600,
				padding: "3px 10px",
				borderRadius: 100,
				letterSpacing: ".04em",
				textTransform: "uppercase",
				whiteSpace: "nowrap",
				...style,
			}}
		>
			{children}
		</span>
	);
}
