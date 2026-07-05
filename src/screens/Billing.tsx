import { Badge, Btn, Card, Divider } from "../components";
import { T } from "../constants/theme";

export function Billing() {
	return (
		<div style={{ padding: 28, flex: 1, overflowY: "auto" }}>
			<div
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					fontSize: 28,
					fontWeight: 800,
					color: T.white,
					marginBottom: 24,
				}}
			>
				Billing
			</div>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 16,
					marginBottom: 24,
				}}
			>
				<Card
					style={{
						background: `linear-gradient(135deg, rgba(31,232,138,.12) 0%, ${T.card} 60%)`,
						border: `1px solid ${T.jade}44`,
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
						}}
					>
						<div>
							<Badge>Current Plan</Badge>
							<div
								style={{
									fontFamily:
										"'Barlow Condensed', sans-serif",
									fontSize: 36,
									fontWeight: 800,
									color: T.white,
									marginTop: 12,
									marginBottom: 4,
								}}
							>
								Growth
							</div>
							<div style={{ color: T.muted, fontSize: 13 }}>
								₹3,000 / month · Renews Jan 15, 2027
							</div>
						</div>
						<div
							style={{
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 44,
								fontWeight: 800,
								color: T.jade,
							}}
						>
							₹3K
						</div>
					</div>
					<Divider />
					<div style={{ display: "flex", gap: 10, marginTop: 12 }}>
						<Btn size="sm">Upgrade to Pro</Btn>
						<Btn variant="outline" size="sm">
							Manage plan
						</Btn>
					</div>
				</Card>
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 15,
							marginBottom: 16,
						}}
					>
						Usage This Month
					</div>
					{[
						{
							l: "AI Replies",
							used: 1482,
							total: 2000,
							color: T.jade,
						},
						{ l: "Contacts", used: 89, total: 500, color: T.blue },
						{ l: "Broadcasts", used: 3, total: 10, color: T.amber },
					].map((u) => (
						<div key={u.l} style={{ marginBottom: 16 }}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: 6,
								}}
							>
								<span style={{ fontSize: 13, color: T.cream }}>
									{u.l}
								</span>
								<span style={{ fontSize: 12, color: T.muted }}>
									{u.used.toLocaleString()} /{" "}
									{u.total.toLocaleString()}
								</span>
							</div>
							<div
								style={{
									height: 6,
									background: T.border,
									borderRadius: 3,
								}}
							>
								<div
									style={{
										height: "100%",
										width: `${(u.used / u.total) * 100}%`,
										background: u.color,
										borderRadius: 3,
									}}
								/>
							</div>
						</div>
					))}
				</Card>
			</div>
			<Card>
				<div
					style={{
						fontWeight: 700,
						color: T.white,
						fontSize: 15,
						marginBottom: 16,
					}}
				>
					Invoice History
				</div>
				<table style={{ width: "100%", borderCollapse: "collapse" }}>
					<thead>
						<tr>
							{[
								"Invoice",
								"Date",
								"Plan",
								"Amount",
								"Status",
								"",
							].map((h) => (
								<th
									key={h}
									style={{
										padding: "10px 16px",
										textAlign: "left",
										fontSize: 11,
										fontWeight: 600,
										color: T.muted,
										textTransform: "uppercase",
										letterSpacing: ".06em",
										borderBottom: `1px solid ${T.border}`,
									}}
								>
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{[
							{
								inv: "#WB-2026-012",
								date: "Dec 1, 2026",
								plan: "Growth",
								amt: "₹3,000",
								status: "Paid",
							},
							{
								inv: "#WB-2026-011",
								date: "Nov 1, 2026",
								plan: "Growth",
								amt: "₹3,000",
								status: "Paid",
							},
							{
								inv: "#WB-2026-010",
								date: "Oct 1, 2026",
								plan: "Starter",
								amt: "₹1,500",
								status: "Paid",
							},
						].map((r, i) => (
							<tr
								key={i}
								style={{
									borderBottom: `1px solid ${T.border}`,
								}}
							>
								<td
									style={{
										padding: "14px 16px",
										fontSize: 13,
										color: T.cream,
										fontFamily: "monospace",
									}}
								>
									{r.inv}
								</td>
								<td
									style={{
										padding: "14px 16px",
										fontSize: 13,
										color: T.muted,
									}}
								>
									{r.date}
								</td>
								<td style={{ padding: "14px 16px" }}>
									<Badge>{r.plan}</Badge>
								</td>
								<td
									style={{
										padding: "14px 16px",
										fontSize: 13,
										fontWeight: 700,
										color: T.white,
									}}
								>
									{r.amt}
								</td>
								<td style={{ padding: "14px 16px" }}>
									<Badge color={T.jade} bg={T.jadeDim}>
										{r.status}
									</Badge>
								</td>
								<td style={{ padding: "14px 16px" }}>
									<Btn variant="ghost" size="sm">
										Download
									</Btn>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Card>
		</div>
	);
}
