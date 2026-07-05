import { T } from "../constants/theme";

export interface AvatarProps {
	name?: string;
	size?: number;
	bg?: string;
	color?: string;
}

export function Avatar({
	name = "U",
	size = 32,
	bg = T.jadeDim,
	color = T.jade,
}: AvatarProps) {
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: "50%",
				background: bg,
				color,
				fontFamily: "'Barlow Condensed', sans-serif",
				fontWeight: 800,
				fontSize: size * 0.38,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexShrink: 0,
			}}
		>
			{(name[0] || "U").toUpperCase()}
		</div>
	);
}
