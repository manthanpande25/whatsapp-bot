import React from "react";
import { T } from "../constants/theme";
import { Icon } from "./Icon";

export interface TopbarProps {
	title: string;
	subtitle?: string;
	actions?: React.ReactNode;
	onMenuClick?: () => void;
}

export function Topbar({ title, subtitle, actions, onMenuClick }: TopbarProps) {
	return (
		<div
			style={{
				height: 64,
				borderBottom: `1px solid ${T.border}`,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0 20px",
				flexShrink: 0,
				background: T.forest,
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
				{onMenuClick && (
					<button
						className="mobile-menu-btn"
						onClick={onMenuClick}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: 4,
							alignItems: "center",
							justifyContent: "center",
							display: "none", // hidden on desktop, shown via CSS in App.tsx
						}}
					>
						<Icon name="menu" size={20} color={T.muted} />
					</button>
				)}
				<div>
					<div
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 20,
							fontWeight: 800,
							color: T.white,
							lineHeight: 1,
						}}
					>
						{title}
					</div>
					{subtitle && (
						<div
							style={{
								fontSize: 12,
								color: T.muted,
								marginTop: 2,
							}}
							className="hide-on-mobile"
						>
							{subtitle}
						</div>
					)}
				</div>
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
				{actions}
				<button
					style={{
						background: T.jadeDim,
						border: `1px solid ${T.border}`,
						borderRadius: 10,
						width: 36,
						height: 36,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						position: "relative",
					}}
				>
					<Icon name="bell" size={16} color={T.jade} />
					<span
						style={{
							position: "absolute",
							top: 6,
							right: 6,
							width: 6,
							height: 6,
							background: T.amber,
							borderRadius: "50%",
						}}
					/>
				</button>
			</div>
		</div>
	);
}
