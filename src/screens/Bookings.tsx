import { Avatar, Badge, Btn, Card, Icon, Stat } from "../components";
import { T } from "../constants/theme";

interface Slot {
	time: string;
	name: string;
	type: string;
	status: "Confirmed" | "Available" | "Pending" | "Cancelled";
}

export function Bookings() {
	const slots: Slot[] = [
		{
			time: "9:00 AM",
			name: "Priya Meshram",
			type: "General",
			status: "Confirmed",
		},
		{ time: "10:30 AM", name: "—", type: "—", status: "Available" },
		{
			time: "11:30 AM",
			name: "Rahul Deshmukh",
			type: "Specialist",
			status: "Confirmed",
		},
		{
			time: "1:00 PM",
			name: "Sunita Agrawal",
			type: "General",
			status: "Pending",
		},
		{ time: "2:30 PM", name: "—", type: "—", status: "Available" },
		{
			time: "4:00 PM",
			name: "Amit Joshi",
			type: "General",
			status: "Confirmed",
		},
		{
			time: "5:30 PM",
			name: "Neha Sharma",
			type: "Specialist",
			status: "Cancelled",
		},
		{ time: "7:00 PM", name: "—", type: "—", status: "Available" },
	];

	const statusColors = {
		Confirmed: T.jade,
		Pending: T.amber,
		Cancelled: T.red,
		Available: T.muted,
	};

	return (
		<div style={{ padding: "clamp(16px, 4vw, 28px)", flex: 1, overflowY: "auto" }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 24,
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
						Bookings
					</div>
					<div style={{ fontSize: 13, color: T.muted }}>
						Thursday, July 3, 2026
					</div>
				</div>
				<div style={{ display: "flex", gap: 10 }}>
					{["Day", "Week", "Month"].map((v) => (
						<Btn
							key={v}
							variant={v === "Day" ? "primary" : "outline"}
							size="sm"
						>
							{v}
						</Btn>
					))}
					<Btn size="sm">
						<Icon name="plus" size={14} color={T.forest} /> Add
						booking
					</Btn>
				</div>
			</div>

			<div
				className="responsive-grid-4"
				style={{
					gap: 16,
					marginBottom: 24,
				}}
			>
				<Stat
					label="Today's Bookings"
					value="5"
					change={25}
					icon="calendar"
				/>
				<Stat
					label="Available Slots"
					value="3"
					icon="check"
					color={T.blue}
				/>
				<Stat
					label="Pending Confirmations"
					value="1"
					icon="bell"
					color={T.amber}
				/>
				<Stat
					label="This Week Total"
					value="32"
					change={12}
					icon="trending"
					color={T.purple}
				/>
			</div>

			<Card style={{ padding: 0 }}>
				<div
					style={{
						padding: "16px 20px",
						borderBottom: `1px solid ${T.border}`,
						fontWeight: 700,
						color: T.white,
					}}
				>
					Today's Schedule
				</div>
				{slots.map((s, i) => (
					<div
						key={i}
						style={{
							padding: "14px 20px",
							borderBottom:
								i < slots.length - 1
									? `1px solid ${T.border}`
									: "none",
							display: "flex",
							alignItems: "center",
							flexWrap: "wrap",
							gap: "12px 16px",
							opacity: s.status === "Available" ? 0.5 : 1,
						}}
					>
						<div
							style={{
								width: 70,
								fontSize: 13,
								fontWeight: 600,
								color: T.cream,
								flexShrink: 0,
							}}
						>
							{s.time}
						</div>
						<div style={{ flex: 1 }}>
							{s.name !== "—" ? (
								<div
									style={{
										display: "flex",
										gap: 10,
										alignItems: "center",
									}}
								>
									<Avatar name={s.name} size={28} />
									<div>
										<div
											style={{
												fontSize: 13,
												fontWeight: 600,
												color: T.cream,
											}}
										>
											{s.name}
										</div>
										<div
											style={{
												fontSize: 11,
												color: T.muted,
											}}
										>
											{s.type} consultation
										</div>
									</div>
								</div>
							) : (
								<div style={{ fontSize: 13, color: T.muted }}>
									Open slot
								</div>
							)}
						</div>
						<Badge
							color={statusColors[s.status]}
							bg={statusColors[s.status] + "22"}
						>
							{s.status}
						</Badge>
						{s.status !== "Available" && (
							<div style={{ display: "flex", gap: 6 }}>
								<Btn variant="ghost" size="sm">
									Reschedule
								</Btn>
								{s.status === "Confirmed" && (
									<Btn variant="ghost" size="sm">
										Remind
									</Btn>
								)}
							</div>
						)}
						{s.status === "Available" && (
							<Btn size="sm">Book now</Btn>
						)}
					</div>
				))}
			</Card>
		</div>
	);
}
