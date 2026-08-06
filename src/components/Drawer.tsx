// src/components/Drawer.tsx

import type { CSSProperties, ReactNode } from "react";
import { T } from "../constants/theme";
import { Btn } from "./Btn";
import { Icon } from "./Icon";

interface DrawerProps {
	open: boolean;
	title: string;
	width?: number;
	onClose: () => void;
	children: ReactNode;
	footer?: ReactNode;
}

export function Drawer({
	open,
	title,
	width = 420,
	onClose,
	children,
	footer,
}: DrawerProps) {
	if (!open) return null;

	return (
		<>
			<div
				onClick={onClose}
				style={{
					position: "fixed",
					inset: 0,
					background: "rgba(0,0,0,.55)",
					backdropFilter: "blur(4px)",
					zIndex: 998,
				}}
			/>

			<div
				style={{
					position: "fixed",
					top: 0,
					right: 0,
					height: "100vh",
					width,
					background: T.card,
					borderLeft: `1px solid ${T.border}`,
					display: "flex",
					flexDirection: "column",
					zIndex: 999,
					boxShadow: "-20px 0 60px rgba(0,0,0,.45)",
				}}
			>
				<div
					style={{
						padding: 22,
						borderBottom: `1px solid ${T.border}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							fontSize: 18,
							fontWeight: 700,
							color: T.white,
						}}
					>
						{title}
					</div>

					<Btn variant="ghost" size="sm" onClick={onClose}>
						<Icon name="x" size={18} color={T.white} />
					</Btn>
				</div>

				<div
					style={{
						flex: 1,
						overflowY: "auto",
						padding: 22,
					}}
				>
					{children}
				</div>

				{footer && (
					<div
						style={{
							padding: 22,
							borderTop: `1px solid ${T.border}`,
						}}
					>
						{footer}
					</div>
				)}
			</div>
		</>
	);
}

export function DrawerSection({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) {
	return (
		<div style={{ marginBottom: 22 }}>
			<div
				style={{
					fontSize: 12,
					color: T.muted,
					marginBottom: 8,
					textTransform: "uppercase",
					letterSpacing: ".08em",
				}}
			>
				{label}
			</div>

			{children}
		</div>
	);
}

export const drawerInput: CSSProperties = {
	width: "100%",
	padding: "11px 12px",
	borderRadius: 10,
	border: `1px solid ${T.border}`,
	background: T.deep,
	color: T.white,
	fontSize: 13,
	outline: "none",
	boxSizing: "border-box",
};