import { T } from "../constants/theme";
import type { IconName } from "../types";
import { Badge } from "./Badge";
import { Card } from "./Card";
import { Icon } from "./Icon";

export interface StatProps {
	label: string;
	value: string | number;
	change?: number;
	icon: IconName;
	color?: string;
}

export function Stat({
	label,
	value,
	change,
	icon,
	color = T.jade,
}: StatProps) {
	return (
		<Card hover style={{ flex: 1, minWidth: 160 }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					marginBottom: 16,
				}}
			>
				<div
					style={{
						background: color + "22",
						width: 40,
						height: 40,
						borderRadius: 10,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Icon name={icon} size={18} color={color} />
				</div>
				{change !== undefined && (
					<Badge
						color={change > 0 ? T.jade : T.red}
						bg={change > 0 ? T.jadeDim : "#EF444422"}
					>
						{change > 0 ? "+" : ""}
						{change}%
					</Badge>
				)}
			</div>
			<div
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					fontSize: 36,
					fontWeight: 800,
					color: T.white,
					lineHeight: 1,
				}}
			>
				{value}
			</div>
			<div style={{ fontSize: 13, color: T.muted, marginTop: 6 }}>
				{label}
			</div>
		</Card>
	);
}
