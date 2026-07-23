import { useEffect, useState } from "react";
import { Avatar, Badge, Btn, Card, Icon, Stat } from "../components";
import { T } from "../constants/theme";
import { getCustomers } from "../services/customer.service";
import type { Customer } from "../types/customer";

export function CRM() {
	const [contacts, setContacts] = useState<Customer[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
	loadCustomers();

	const interval = setInterval(() => {
		
		loadCustomers();
	}, 5000);

	return () => clearInterval(interval);
}, []);
	async function loadCustomers() {
		
		try {
			const token = localStorage.getItem("token");
			const organizationId = localStorage.getItem("organizationId");

			if (!token || !organizationId) {
				console.log("Token or Organization ID not found");
				return;
			}

			const response = await getCustomers(organizationId, token);
			

			

			setContacts(response.data);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	}
	const statusColors: Record<Customer["status"], string> = {
		NEW: T.blue,
		CONTACTED: T.amber,
		QUALIFIED: T.red,
		CUSTOMER: T.jade,
	};

	if (loading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
					color: T.white,
					fontSize: 18,
				}}
			>
				Loading customers...
			</div>
		);
	}
	return (
		<div
			style={{
				padding: "clamp(16px, 4vw, 28px)",
				flex: 1,
				overflowY: "auto",
			}}
		>
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
						CRM
					</div>
					<div style={{ fontSize: 13, color: T.muted }}>
						312 contacts · 89 hot leads
					</div>
				</div>
				<div style={{ display: "flex", gap: 10 }}>
					<div style={{ position: "relative" }}>
						<input
							placeholder="Search contacts..."
							style={{
								background: T.deep,
								border: `1px solid ${T.border}`,
								borderRadius: 10,
								padding: "8px 14px 8px 36px",
								color: T.cream,
								fontSize: 13,
								fontFamily: "Inter, sans-serif",
								outline: "none",
								width: 220,
							}}
						/>
						<div
							style={{
								position: "absolute",
								left: 12,
								top: "50%",
								transform: "translateY(-50%)",
								display: "flex",
								alignItems: "center",
							}}
						>
							<Icon name="search" size={14} color={T.muted} />
						</div>
					</div>
					<Btn size="sm">
						<Icon name="plus" size={14} color={T.forest} /> Add
						contact
					</Btn>
				</div>
			</div>

			<div
				className="responsive-grid-3"
				style={{
					gap: 16,
					marginBottom: 24,
				}}
			>
				<Stat
					label="Total Contacts"
					value="312"
					change={15}
					icon="users"
				/>
				<Stat
					label="Hot Leads"
					value="89"
					change={22}
					icon="zap"
					color={T.red}
				/>
				<Stat
					label="Converted This Month"
					value="34"
					change={18}
					icon="check"
					color={T.amber}
				/>
			</div>

			<Card style={{ padding: 0 }}>
				<div
					style={{
						padding: "16px 20px",
						borderBottom: `1px solid ${T.border}`,
						display: "flex",
						flexWrap: "wrap",
						gap: 8,
					}}
				>
					{["All", "Hot Leads", "Customers", "Cold Leads"].map(
						(f) => (
							<Btn
								key={f}
								variant={f === "All" ? "primary" : "ghost"}
								size="sm"
							>
								{f}
							</Btn>
						),
					)}
				</div>
				<div className="crm-table-container">
					<table
						style={{ width: "100%", borderCollapse: "collapse" }}
					>
						<thead>
							<tr style={{ background: T.deep }}>
								{[
									"Customer",
									"Phone",
									"Status",
									"Last Message",
									"Messages",
									"Last Seen",
									"",
								].map((h) => (
									<th
										key={h}
										style={{
											padding: "12px 20px",
											textAlign: "left",
											fontSize: 12,
											fontWeight: 600,
											color: T.muted,
											textTransform: "uppercase",
											letterSpacing: ".06em",
										}}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{contacts.map((c, i) => (
								<tr
									key={i}
									style={{
										borderTop: `1px solid ${T.border}`,
										cursor: "pointer",
										transition: "background .15s",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.background =
											T.jadeDim)
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.background =
											"transparent")
									}
								>
									<td style={{ padding: "14px 20px" }}>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: 10,
											}}
										>
											<Avatar name={c.name} size={32} />
											<span
												style={{
													fontSize: 13,
													fontWeight: 600,
													color: T.cream,
												}}
											>
												{c.name}
											</span>
										</div>
									</td>
									<td
										style={{
											padding: "14px 20px",
											fontSize: 13,
											color: T.muted,
										}}
									>
										{c.phone}
									</td>
									<td style={{ padding: "14px 20px" }}>
										<Badge
											color={statusColors[c.status]}
											bg={statusColors[c.status] + "22"}
										>
											{c.status}
										</Badge>
									</td>
									<td
										style={{
											padding: "14px 20px",
											fontSize: 13,
											color: T.cream,
											maxWidth: 220,
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{c.lastMessage || "-"}
									</td>
									<td
										style={{
											padding: "14px 20px",
											fontSize: 13,
											color: T.cream,
											fontWeight: 600,
										}}
									>
										{c.totalMessages}
									</td>
									<td
										style={{
											padding: "14px 20px",
											fontSize: 12,
											color: T.muted,
										}}
									>
										{c.lastSeen
											? new Date(
													c.lastSeen._seconds * 1000,
												).toLocaleString()
											: "-"}
									</td>
									<td style={{ padding: "14px 20px" }}>
										<div
											style={{ display: "flex", gap: 6 }}
										>
											<Btn variant="ghost" size="sm">
												<Icon
													name="msg"
													size={13}
													color={T.jade}
												/>
											</Btn>
											<Btn variant="ghost" size="sm">
												<Icon
													name="eye"
													size={13}
													color={T.muted}
												/>
											</Btn>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Card>
		</div>
	);
}
