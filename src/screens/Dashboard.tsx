import { Avatar, Badge, Btn, Card, Icon, MiniChart, Stat } from "../components";
import { T } from "../constants/theme";

export function Dashboard() {
	const chartData = [12, 19, 15, 28, 22, 35, 42, 38, 45, 52, 48, 61];
	const activities = [
		{
			name: "Priya Meshram",
			action: "Booked appointment",
			time: "2 min ago",
			avatar: "P",
		},
		{
			name: "Rahul Deshmukh",
			action: "New lead captured",
			time: "8 min ago",
			avatar: "R",
		},
		{
			name: "Sunita Agrawal",
			action: "Follow-up sent",
			time: "15 min ago",
			avatar: "S",
		},
		{
			name: "Amit Joshi",
			action: "AI answered 3 queries",
			time: "22 min ago",
			avatar: "A",
		},
		{
			name: "Neha Sharma",
			action: "Human takeover requested",
			time: "31 min ago",
			avatar: "N",
		},
	];
	const topQs = [
		{ q: "What are your timings?", count: 142, pct: 88 },
		{ q: "What is the consultation fee?", count: 98, pct: 61 },
		{ q: "Is tomorrow available?", count: 76, pct: 47 },
		{ q: "Do you take insurance?", count: 54, pct: 34 },
		{ q: "How to reschedule?", count: 41, pct: 26 },
	];

	return (
		<div
			style={{
				padding: "clamp(16px, 4vw, 28px)",
				overflowY: "auto",
				flex: 1,
				display: "flex",
				flexDirection: "column",
				gap: 24,
			}}
		>
			{/* Greeting */}
			<div
				style={{
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
							fontSize: "clamp(24px, 5vw, 32px)",
							fontWeight: 800,
							color: T.white,
						}}
					>
						Good morning, Yasir 👋
					</div>
					<div style={{ color: T.muted, fontSize: 14, marginTop: 4 }}>
						Your bot handled 47 queries while you slept.
					</div>
				</div>
				<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
					<Btn variant="outline" size="sm">
						<Icon name="refresh" size={14} color={T.muted} />{" "}
						Refresh
					</Btn>
					<Btn size="sm">
						<Icon name="zap" size={14} color={T.forest} /> Quick
						broadcast
					</Btn>
				</div>
			</div>

			{/* KPI Row */}
			<div className="responsive-grid-4" style={{ gap: 16 }}>
				{/* <Stat
					label="Monthly Revenue"
					value="₹42,500"
					change={18}
					icon="billing"
					color={T.jade}
				/> */}
				<Stat
					label="Active Leads"
					value="128"
					change={12}
					icon="users"
					color={T.blue}
				/>
				<Stat
					label="Conversations Today"
					value="63"
					change={7}
					icon="msg"
					color={T.amber}
				/>
				<Stat
					label="AI Response Rate"
					value="94%"
					change={3}
					icon="bot"
					color={T.purple}
				/>
			</div>

			{/* Chart + Activity */}
			<div className="responsive-grid-2" style={{ gap: 16 }}>
				<Card>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: 20,
						}}
					>
						<div>
							<div
								style={{
									fontWeight: 700,
									color: T.white,
									fontSize: 16,
								}}
							>
								Conversation Volume
							</div>
							<div style={{ fontSize: 12, color: T.muted }}>
								Last 12 months
							</div>
						</div>
						<Badge>↑ 18% vs last month</Badge>
					</div>
					<MiniChart data={chartData} height={100} />
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginTop: 8,
						}}
					>
						{[
							"J",
							"F",
							"M",
							"A",
							"M",
							"J",
							"J",
							"A",
							"S",
							"O",
							"N",
							"D",
						].map((m) => (
							<span
								key={m}
								style={{ fontSize: 10, color: T.muted }}
							>
								{m}
							</span>
						))}
					</div>
				</Card>
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 16,
							marginBottom: 16,
						}}
					>
						Recent Activity
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 14,
						}}
					>
						{activities.map((a, i) => (
							<div
								key={i}
								style={{
									display: "flex",
									gap: 12,
									alignItems: "center",
								}}
							>
								<Avatar name={a.avatar} size={32} />
								<div style={{ flex: 1 }}>
									<div
										style={{
											fontSize: 13,
											fontWeight: 600,
											color: T.cream,
										}}
									>
										{a.name}
									</div>
									<div
										style={{ fontSize: 12, color: T.muted }}
									>
										{a.action}
									</div>
								</div>
								<div style={{ fontSize: 11, color: T.muted }}>
									{a.time}
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>

			{/* Top Questions + Quick Stats */}
			<div className="responsive-grid-2" style={{ gap: 16 }}>
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 16,
							marginBottom: 16,
						}}
					>
						Top Customer Questions
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 12,
						}}
					>
						{topQs.map((q, i) => (
							<div key={i}>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										marginBottom: 6,
									}}
								>
									<span
										style={{ fontSize: 13, color: T.cream }}
									>
										{q.q}
									</span>
									<span
										style={{ fontSize: 12, color: T.muted }}
									>
										{q.count}
									</span>
								</div>
								<div
									style={{
										height: 4,
										background: T.border,
										borderRadius: 2,
									}}
								>
									<div
										style={{
											height: "100%",
											width: `${q.pct}%`,
											background: T.jade,
											borderRadius: 2,
											transition: "width 1s ease",
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</Card>
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 16,
							marginBottom: 20,
						}}
					>
						Bot Performance
					</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: 16,
						}}
					>
						{[
							{ label: "Avg response time", value: "1.2s" },
							{ label: "Customer satisfaction", value: "4.8/5" },
							{ label: "Queries resolved by AI", value: "91%" },
							{ label: "Leads captured today", value: "14" },
							{ label: "Bookings this week", value: "32" },
							{ label: "Follow-ups sent", value: "67" },
						].map((s) => (
							<div
								key={s.label}
								style={{
									background: T.deep,
									borderRadius: 10,
									padding: "12px 16px",
								}}
							>
								<div
									style={{
										fontFamily:
											"'Barlow Condensed', sans-serif",
										fontSize: 26,
										fontWeight: 800,
										color: T.jade,
									}}
								>
									{s.value}
								</div>
								<div
									style={{
										fontSize: 11,
										color: T.muted,
										marginTop: 2,
									}}
								>
									{s.label}
								</div>
							</div>
						))}
					</div>
				</Card>
			</div>
		</div>
	);
}
