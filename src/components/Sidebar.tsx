import { Link } from "react-router-dom";
import { T } from "../constants/theme";
import type { IconName } from "../types";
import { Avatar } from "./Avatar";
import { Divider } from "./Divider";
import { Icon } from "./Icon";

export interface NavItem {
	id: string;
	label: string;
	icon: IconName;
	section: "product" | "main" | "account";
}

export const NAV_ITEMS: NavItem[] = [
	// { id: "landing", label: "Landing Page", icon: "globe", section: "product" },
	{ id: "dashboard", label: "Dashboard", icon: "dashboard", section: "main" },
	{ id: "inbox", label: "Inbox", icon: "inbox", section: "main" },
	{ id: "ai-builder", label: "AI Builder", icon: "bot", section: "main" },
	{ id: "analytics", label: "Analytics", icon: "analytics", section: "main" },
	{ id: "crm", label: "CRM", icon: "crm", section: "main" },
	{ id: "bookings", label: "Bookings", icon: "calendar", section: "main" },
	{ id: "knowledge", label: "Knowledge Base", icon: "book", section: "main" },
	{ id: "billing", label: "Billing", icon: "billing", section: "account" },
	{ id: "settings", label: "Settings", icon: "settings", section: "account" },
];

export interface SidebarProps {
	active: string;
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	onClose?: () => void;
	isOpenMobile?: boolean;
}

export function Sidebar({
	active,
	collapsed,
	setCollapsed,
	onClose,
	isOpenMobile,
}: SidebarProps) {
	const sections = {
		product: "Product",
		main: "Platform",
		account: "Account",
	};

	// Group navigation items by section
	const grouped = NAV_ITEMS.reduce(
		(acc, item) => {
			(acc[item.section] = acc[item.section] || []).push(item);
			return acc;
		},
		{} as Record<string, NavItem[]>,
	);

	return (
		<>
			{isOpenMobile && (
				<div
					className="sidebar-backdrop"
					onClick={onClose}
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0, 0, 0, 0.6)",
						backdropFilter: "blur(4px)",
						zIndex: 999,
					}}
				/>
			)}
			<div
				className={`sidebar-container ${isOpenMobile ? "open" : ""}`}
				style={{
					width: collapsed ? 60 : 220,
					background: T.forest,
					borderRight: `1px solid ${T.border}`,
					display: "flex",
					flexDirection: "column",
					height: "100vh",
					transition: "width .25s, transform 0.3s ease",
					flexShrink: 0,
				}}
			>
				<div
					style={{
						padding: collapsed ? "20px 12px" : "20px 20px",
						display: "flex",
						alignItems: "center",
						justifyContent: collapsed ? "center" : "space-between",
						borderBottom: `1px solid ${T.border}`,
					}}
				>
					{!collapsed && (
						<div
							style={{
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 22,
								fontWeight: 800,
								color: T.white,
							}}
						>
							Wa<span style={{ color: T.jade }}>Bot</span>.ai
						</div>
					)}
					{collapsed && (
						<div
							style={{
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 18,
								fontWeight: 800,
								color: T.jade,
							}}
						>
							W
						</div>
					)}
					<button
						className="sidebar-collapse-btn"
						onClick={() => setCollapsed(!collapsed)}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: 4,
							display: "flex",
							alignItems: "center",
						}}
					>
						<Icon name="menu" size={18} color={T.muted} />
					</button>
					<button
						className="sidebar-close-btn"
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: 4,
							display: "none",
							alignItems: "center",
						}}
					>
						<Icon name="x" size={20} color={T.muted} />
					</button>
				</div>

				<div
					style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}
				>
					{Object.entries(grouped).map(([sec, items]) => (
						<div key={sec}>
							{!collapsed && (
								<div
									style={{
										fontSize: 10,
										fontWeight: 700,
										color: T.muted,
										letterSpacing: ".1em",
										textTransform: "uppercase",
										padding: "12px 12px 6px",
									}}
								>
									{sections[sec as keyof typeof sections]}
								</div>
							)}
							{items.map((item) => {
								const isActive = active === item.id;
								return (
									<Link
										key={item.id}
										to={
											item.id === "landing"
												? "/"
												: `/${item.id}`
										}
										onClick={() => {
											if (onClose) onClose();
										}}
										style={{
											width: "100%",
											display: "flex",
											alignItems: "center",
											gap: 10,
											padding: "10px 12px",
											borderRadius: 10,
											textDecoration: "none",
											background: isActive
												? T.jadeDim
												: "transparent",
											cursor: "pointer",
											marginBottom: 2,
											transition: "background .15s",
											justifyContent: collapsed
												? "center"
												: "flex-start",
										}}
										title={collapsed ? item.label : ""}
									>
										<Icon
											name={item.icon}
											size={16}
											color={isActive ? T.jade : T.muted}
										/>
										{!collapsed && (
											<span
												style={{
													fontSize: 13,
													fontWeight: isActive
														? 600
														: 400,
													color: isActive
														? T.cream
														: T.muted,
												}}
											>
												{item.label}
											</span>
										)}
									</Link>
								);
							})}
							<Divider />
						</div>
					))}
				</div>

				<div
					style={{
						padding: collapsed ? "12px 8px" : "12px 16px",
						borderTop: `1px solid ${T.border}`,
						display: "flex",
						alignItems: "center",
						gap: 10,
					}}
				>
					<Avatar name="Y" size={32} />
					{!collapsed && (
						<div style={{ flex: 1, minWidth: 0 }}>
							<div
								style={{
									fontSize: 13,
									fontWeight: 600,
									color: T.cream,
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								Yasir Sheikh
							</div>
							<div style={{ fontSize: 11, color: T.muted }}>
								Founder · Growth Plan
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
