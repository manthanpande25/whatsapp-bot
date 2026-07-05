export const T = {
	forest: "#0A2218",
	deep: "#112B1E",
	card: "#0F2419",
	border: "#1A3828",
	jade: "#1FE88A",
	jadeHover: "#16A362",
	jadeDim: "rgba(31,232,138,0.12)",
	amber: "#F59E0B",
	cream: "#EFF6F2",
	muted: "#7FA897",
	white: "#FFFFFF",
	red: "#EF4444",
	blue: "#3B82F6",
	purple: "#8B5CF6",
	glass: "rgba(17,43,30,0.6)",
} as const;

export type ThemeType = typeof T;
