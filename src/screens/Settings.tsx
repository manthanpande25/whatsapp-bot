import { useState } from "react";
import { Avatar, Badge, Btn, Card, Input } from "../components";
import { T } from "../constants/theme";

export interface SettingsProps {
	showToast: (msg: string, type?: "success" | "error") => void;
}

export function Settings({ showToast }: SettingsProps) {
	const [name, setName] = useState("Yasir Sheikh");
	const [biz, setBiz] = useState("Dr. Sharma's Clinic");
	const [phone, setPhone] = useState("+91 98765 43210");

	return (
		<div style={{ padding: 28, flex: 1, overflowY: "auto", maxWidth: 720 }}>
			<div
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					fontSize: 28,
					fontWeight: 800,
					color: T.white,
					marginBottom: 24,
				}}
			>
				Settings
			</div>

			{/* Profile */}
			<Card style={{ marginBottom: 16 }}>
				<div
					style={{
						fontWeight: 700,
						color: T.white,
						fontSize: 15,
						marginBottom: 20,
					}}
				>
					Profile
				</div>
				<div
					style={{
						display: "flex",
						gap: 16,
						marginBottom: 20,
						alignItems: "center",
					}}
				>
					<Avatar name="Y" size={56} />
					<div>
						<Btn variant="outline" size="sm">
							Change photo
						</Btn>
						<div
							style={{
								fontSize: 11,
								color: T.muted,
								marginTop: 4,
							}}
						>
							JPG, PNG up to 5 MB
						</div>
					</div>
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: 14,
					}}
				>
					<div>
						<div
							style={{
								fontSize: 12,
								color: T.muted,
								marginBottom: 6,
							}}
						>
							Full name
						</div>
						<Input value={name} onChange={setName} />
					</div>
					<div>
						<div
							style={{
								fontSize: 12,
								color: T.muted,
								marginBottom: 6,
							}}
						>
							Business name
						</div>
						<Input value={biz} onChange={setBiz} />
					</div>
					<div>
						<div
							style={{
								fontSize: 12,
								color: T.muted,
								marginBottom: 6,
							}}
						>
							WhatsApp number
						</div>
						<Input value={phone} onChange={setPhone} />
					</div>
					<div>
						<div
							style={{
								fontSize: 12,
								color: T.muted,
								marginBottom: 6,
							}}
						>
							Email
						</div>
						<Input value="yasir@wabot.ai" onChange={() => {}} />
					</div>
				</div>
				<div style={{ marginTop: 16 }}>
					<Btn onClick={() => showToast("Profile saved ✓")}>
						Save changes
					</Btn>
				</div>
			</Card>

			{/* WhatsApp API */}
			<Card style={{ marginBottom: 16 }}>
				<div
					style={{
						fontWeight: 700,
						color: T.white,
						fontSize: 15,
						marginBottom: 4,
					}}
				>
					WhatsApp API
				</div>
				<div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>
					Connected via Gupshup (Official Meta BSP)
				</div>
				<div
					style={{
						display: "flex",
						gap: 10,
						alignItems: "center",
						marginBottom: 14,
					}}
				>
					<Badge color={T.jade} bg={T.jadeDim}>
						● Connected
					</Badge>
					<span style={{ fontSize: 12, color: T.muted }}>
						+91 98765 43210
					</span>
				</div>
				<div style={{ display: "flex", gap: 10 }}>
					<Btn variant="outline" size="sm">
						Reconnect
					</Btn>
					<Btn variant="outline" size="sm">
						View webhook logs
					</Btn>
				</div>
			</Card>

			{/* Notifications */}
			<Card>
				<div
					style={{
						fontWeight: 700,
						color: T.white,
						fontSize: 15,
						marginBottom: 16,
					}}
				>
					Notifications
				</div>
				{[
					{
						l: "New lead captured",
						d: "Alert when bot captures a new contact",
					},
					{
						l: "Appointment booked",
						d: "Notify on every new booking",
					},
					{
						l: "Human takeover needed",
						d: "Alert when customer requests a human",
					},
					{ l: "Daily summary", d: "Daily report at 9 PM" },
				].map((n, i) => (
					<div
						key={i}
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "12px 0",
							borderBottom: `1px solid ${T.border}`,
						}}
					>
						<div>
							<div
								style={{
									fontSize: 13,
									fontWeight: 600,
									color: T.cream,
								}}
							>
								{n.l}
							</div>
							<div style={{ fontSize: 11, color: T.muted }}>
								{n.d}
							</div>
						</div>
						<div
							style={{
								width: 44,
								height: 24,
								background: T.jade,
								borderRadius: 12,
								cursor: "pointer",
								position: "relative",
								flexShrink: 0,
							}}
						>
							<div
								style={{
									width: 20,
									height: 20,
									background: T.white,
									borderRadius: "50%",
									position: "absolute",
									right: 2,
									top: 2,
									transition: "all .2s",
								}}
							/>
						</div>
					</div>
				))}
			</Card>
		</div>
	);
}
