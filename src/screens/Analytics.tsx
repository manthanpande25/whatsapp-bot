import { Btn, Card, Icon, Stat } from "../components";
import { T } from "../constants/theme";

export function Analytics() {
	const weekData = [42, 58, 51, 74, 68, 83, 61];
	const convData = [8, 12, 9, 18, 14, 22, 16];
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	return (
		<div style={{ padding: "clamp(16px, 4vw, 28px)", overflowY: "auto", flex: 1 }}>
			<div
				style={{
					marginBottom: 24,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					gap: 16,
				}}
			>
				<div>
					<div
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 28,
							fontWeight: 800,
							color: T.white,
						}}
					>
						Analytics
					</div>
					<div style={{ color: T.muted, fontSize: 13 }}>
						Last 30 days · Updated live
					</div>
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					{["7 days", "30 days", "3 months"].map((r) => (
						<Btn
							key={r}
							variant={r === "30 days" ? "primary" : "outline"}
							size="sm"
						>
							{r}
						</Btn>
					))}
					<Btn variant="outline" size="sm">
						<Icon name="upload" size={14} color={T.muted} /> Export
					</Btn>
				</div>
			</div>

			{/* KPIs */}
			<div
				className="responsive-grid-4"
				style={{
					gap: 16,
					marginBottom: 24,
				}}
			>
				<Stat
					label="Total Conversations"
					value="1,847"
					change={23}
					icon="msg"
				/>
				<Stat
					label="Leads Captured"
					value="312"
					change={15}
					icon="users"
					color={T.blue}
				/>
				<Stat
					label="Bookings Made"
					value="89"
					change={31}
					icon="calendar"
					color={T.amber}
				/>
				<Stat
					label="AI Resolution Rate"
					value="91%"
					change={4}
					icon="bot"
					color={T.purple}
				/>
			</div>

			{/* Charts row */}
			<div
				className="responsive-grid-2"
				style={{
					gap: 16,
					marginBottom: 24,
				}}
			>
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 15,
							marginBottom: 20,
						}}
					>
						Daily Conversations
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							gap: 8,
							height: 100,
						}}
					>
						{weekData.map((v, i) => (
							<div
								key={i}
								style={{
									flex: 1,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 6,
								}}
							>
								<div
									style={{
										width: "100%",
										background: T.jade,
										borderRadius: "4px 4px 0 0",
										height: `${(v / 83) * 90}px`,
										transition: "height .5s ease",
										minHeight: 4,
									}}
								/>
								<span style={{ fontSize: 10, color: T.muted }}>
									{days[i]}
								</span>
							</div>
						))}
					</div>
				</Card>
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 15,
							marginBottom: 20,
						}}
					>
						Conversion Rate by Day
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							gap: 8,
							height: 100,
						}}
					>
						{convData.map((v, i) => (
							<div
								key={i}
								style={{
									flex: 1,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 6,
								}}
							>
								<div
									style={{
										width: "100%",
										background: T.amber,
										borderRadius: "4px 4px 0 0",
										height: `${(v / 22) * 90}px`,
										transition: "height .5s ease",
										minHeight: 4,
									}}
								/>
								<span style={{ fontSize: 10, color: T.muted }}>
									{days[i]}
								</span>
							</div>
						))}
					</div>
				</Card>
			</div>

			{/* Language + Peak Hours */}
			<div
				className="responsive-grid-3"
				style={{
					gap: 16,
				}}
			>
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 15,
							marginBottom: 16,
						}}
					>
						Language Distribution
					</div>
					{[
						{ l: "Hindi", pct: 48, color: T.jade },
						{ l: "English", pct: 36, color: T.blue },
						{ l: "Marathi", pct: 16, color: T.amber },
					].map((d) => (
						<div key={d.l} style={{ marginBottom: 14 }}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: 6,
								}}
							>
								<span style={{ fontSize: 13, color: T.cream }}>
									{d.l}
								</span>
								<span
									style={{
										fontSize: 12,
										fontWeight: 600,
										color: d.color,
									}}
								>
									{d.pct}%
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
										width: `${d.pct}%`,
										background: d.color,
										borderRadius: 3,
									}}
								/>
							</div>
						</div>
					))}
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
						Peak Hours
					</div>
					{[
						{ h: "9–11 AM", msgs: 312, pct: 90 },
						{ h: "1–3 PM", msgs: 248, pct: 72 },
						{ h: "6–8 PM", msgs: 201, pct: 58 },
						{ h: "11 PM–1 AM", msgs: 89, pct: 26 },
					].map((h) => (
						<div key={h.h} style={{ marginBottom: 12 }}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: 4,
								}}
							>
								<span style={{ fontSize: 12, color: T.cream }}>
									{h.h}
								</span>
								<span style={{ fontSize: 11, color: T.muted }}>
									{h.msgs} msgs
								</span>
							</div>
							<div
								style={{
									height: 5,
									background: T.border,
									borderRadius: 3,
								}}
							>
								<div
									style={{
										height: "100%",
										width: `${h.pct}%`,
										background: T.jade,
										borderRadius: 3,
									}}
								/>
							</div>
						</div>
					))}
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
						Customer Satisfaction
					</div>
					<div style={{ textAlign: "center", padding: "20px 0" }}>
						<div
							style={{
								fontFamily: "'Barlow Condensed', sans-serif",
								fontSize: 64,
								fontWeight: 800,
								color: T.jade,
								lineHeight: 1,
							}}
						>
							4.8
						</div>
						<div
							style={{
								color: T.amber,
								fontSize: 24,
								margin: "8px 0",
							}}
						>
							★★★★★
						</div>
						<div style={{ fontSize: 13, color: T.muted }}>
							Based on 312 ratings
						</div>
					</div>
					{[
						{ stars: "5★", pct: 72 },
						{ stars: "4★", pct: 18 },
						{ stars: "3★", pct: 7 },
						{ stars: "1-2★", pct: 3 },
					].map((r) => (
						<div
							key={r.stars}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
								marginBottom: 6,
							}}
						>
							<span
								style={{
									fontSize: 11,
									color: T.muted,
									width: 30,
								}}
							>
								{r.stars}
							</span>
							<div
								style={{
									flex: 1,
									height: 5,
									background: T.border,
									borderRadius: 3,
								}}
							>
								<div
									style={{
										height: "100%",
										width: `${r.pct}%`,
										background: T.amber,
										borderRadius: 3,
									}}
								/>
							</div>
							<span
								style={{
									fontSize: 11,
									color: T.muted,
									width: 28,
								}}
							>
								{r.pct}%
							</span>
						</div>
					))}
				</Card>
			</div>
		</div>
	);
}
