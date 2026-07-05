import { T } from "../constants/theme";

export interface MiniChartProps {
	data?: number[];
	color?: string;
	height?: number;
}

export function MiniChart({
	data = [],
	color = T.jade,
	height = 48,
}: MiniChartProps) {
	const max = Math.max(...data, 1);
	const w = 200;
	const h = height;
	const divisor = data.length - 1 || 1;
	const pts = data
		.map((v, i) => `${(i / divisor) * w},${h - (v / max) * h}`)
		.join(" ");

	return (
		<svg
			width="100%"
			viewBox={`0 0 ${w} ${h}`}
			preserveAspectRatio="none"
			style={{ display: "block" }}
		>
			<polyline
				points={pts}
				fill="none"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<polygon
				points={`${pts} ${w},${h} 0,${h}`}
				fill={color}
				fillOpacity=".08"
			/>
		</svg>
	);
}
