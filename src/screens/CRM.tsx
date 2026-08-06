import { useEffect, useState } from "react";
import {
	Avatar,
	Badge,
	Btn,
	Card,
	Icon,
	Stat,
	Drawer,
	DrawerSection,
	drawerInput,
} from "../components";
import { T } from "../constants/theme";
import { getCustomers } from "../services/customer.service";
import type { Customer } from "../types/customer";
import { updateCustomer } from "../services/customer.service";

export function CRM() {
	const [contacts, setContacts] = useState<Customer[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [editTags, setEditTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [filter, setFilter] = useState<
		"ALL" | "NEW" | "CONTACTED" | "QUALIFIED" | "CUSTOMER"
	>("ALL");
	const [editName, setEditName] = useState("");

	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
		null,
	);

	const [drawerOpen, setDrawerOpen] = useState(false);

	const [editStatus, setEditStatus] = useState<Customer["status"]>("NEW");

	const [editNotes, setEditNotes] = useState("");

	const filterOptions = [
		{ label: "All", value: "ALL" },
		{ label: "New", value: "NEW" },
		{ label: "Contacted", value: "CONTACTED" },
		{ label: "Qualified", value: "QUALIFIED" },
		{ label: "Customers", value: "CUSTOMER" },
	] as const;

	const totalContacts = contacts.length;

	const customers = contacts.filter((c) => c.status === "CUSTOMER").length;

	const newLeads = contacts.filter((c) => c.status === "NEW").length;
	const contacted = contacts.filter((c) => c.status === "CONTACTED").length;

	const qualified = contacts.filter((c) => c.status === "QUALIFIED").length;

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

	const filteredContacts = contacts.filter((customer) => {
		const query = search.toLowerCase().trim();

		const matchesSearch =
			!query ||
			customer.name.toLowerCase().includes(query) ||
			customer.phone.toLowerCase().includes(query) ||
			customer.status.toLowerCase().includes(query) ||
			customer.lastMessage.toLowerCase().includes(query);

		const matchesFilter = filter === "ALL" || customer.status === filter;

		return matchesSearch && matchesFilter;
	});

	function openCustomer(customer: Customer) {
		setSelectedCustomer(customer);
		setEditStatus(customer.status);
		setEditNotes(customer.notes || "");
		setDrawerOpen(true);
		setEditName(customer.name);
		setEditTags(customer.tags || []);
	}
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
	async function saveCustomer() {
		if (!selectedCustomer) return;

		try {
			const token = localStorage.getItem("token");

			if (!token) return;

			await updateCustomer(
				selectedCustomer.id,
				{
					name: editName,
					status: editStatus,
					notes: editNotes,
					tags: editTags,
				},
				token,
			);

			await loadCustomers();

			setDrawerOpen(false);
			setSelectedCustomer(null);
		} catch (error) {
			console.error("Failed to update customer:", error);
		}
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
						{totalContacts} Contacts • {customers} Customers •{" "}
						{newLeads} New Leads
					</div>
				</div>
				<div style={{ display: "flex", gap: 10 }}>
					<div style={{ position: "relative" }}>
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
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
					value={totalContacts.toString()}
					change={0}
					icon="users"
				/>

				<Stat
					label="New Leads"
					value={newLeads.toString()}
					change={0}
					icon="zap"
					color={T.blue}
				/>

				<Stat
					label="Customers"
					value={customers.toString()}
					change={0}
					icon="check"
					color={T.jade}
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
					{filterOptions.map((item) => (
						<Btn
							key={item.value}
							size="sm"
							variant={
								filter === item.value ? "primary" : "ghost"
							}
							onClick={() => setFilter(item.value)}
						>
							{item.label}
						</Btn>
					))}
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
							{filteredContacts.length === 0 && (
								<tr>
									<td
										colSpan={7}
										style={{
											padding: "40px",
											textAlign: "center",
											color: T.muted,
											fontSize: 14,
										}}
									>
										No customers found.
									</td>
								</tr>
							)}
							{filteredContacts.map((c) => (
								<tr
									onClick={() => openCustomer(c)}
									key={c.id}
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
											<Btn
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
												}}
											>
												<Icon
													name="msg"
													size={13}
													color={T.jade}
												/>
											</Btn>
											<Btn
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													openCustomer(c);
												}}
											>
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

			<Drawer
				open={drawerOpen}
				title="Customer Details"
				onClose={() => setDrawerOpen(false)}
				width={460}
				footer={
					<Btn
						onClick={saveCustomer}
						style={{
							width: "100%",
							justifyContent: "center",
						}}
					>
						Save Changes
					</Btn>
				}
			>
				{selectedCustomer && (
					<>
						<DrawerSection label="Customer Name">
							<input
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								style={drawerInput}
							/>

							<div
								style={{
									marginTop: 12,
									fontSize: 13,
									color: T.muted,
								}}
							>
								{selectedCustomer.phone}
							</div>
						</DrawerSection>

						<DrawerSection label="Status">
							<select
								value={editStatus}
								onChange={(e) =>
									setEditStatus(
										e.target.value as Customer["status"],
									)
								}
								style={drawerInput}
							>
								<option>NEW</option>
								<option>CONTACTED</option>
								<option>QUALIFIED</option>
								<option>CUSTOMER</option>
							</select>
						</DrawerSection>

						<DrawerSection label="Notes">
							<textarea
								rows={6}
								value={editNotes}
								onChange={(e) => setEditNotes(e.target.value)}
								style={{
									...drawerInput,
									resize: "vertical",
								}}
							/>
						</DrawerSection>

						<DrawerSection label="Tags">
							<div
								style={{
									display: "flex",
									flexWrap: "wrap",
									gap: 8,
									marginBottom: 14,
								}}
							>
								{editTags.length ? (
									editTags.map((tag) => (
										<div
											key={tag}
											style={{
												display: "flex",
												alignItems: "center",
												gap: 6,
												padding: "6px 10px",
												background: T.jade + "22",
												border: `1px solid ${T.jade}55`,
												borderRadius: 999,
												fontSize: 12,
												color: T.jade,
												fontWeight: 600,
											}}
										>
											{tag}

											<div
												onClick={() =>
													setEditTags((prev) =>
														prev.filter(
															(t) => t !== tag,
														),
													)
												}
												style={{
													cursor: "pointer",
													display: "flex",
													alignItems: "center",
												}}
											>
												<Icon
													name="x"
													size={12}
													color={T.jade}
												/>
											</div>
										</div>
									))
								) : (
									<span
										style={{
											color: T.muted,
											fontSize: 13,
										}}
									>
										No tags
									</span>
								)}
							</div>

							<div
								style={{
									display: "flex",
									gap: 10,
								}}
							>
								<input
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
									placeholder="Add tag..."
									style={{
										...drawerInput,
										flex: 1,
									}}
								/>

								<Btn
									size="sm"
									onClick={() => {
										const tag = newTag.trim();

										if (!tag) return;

										if (editTags.includes(tag)) return;

										setEditTags((prev) => [...prev, tag]);

										setNewTag("");
									}}
								>
									Add
								</Btn>
							</div>
						</DrawerSection>

						<DrawerSection label="Last Message">
							<Card>
								<div
									style={{
										color: T.cream,
										lineHeight: 1.6,
									}}
								>
									{selectedCustomer.lastMessage ||
										"No messages"}
								</div>
							</Card>
						</DrawerSection>

						<DrawerSection label="Messages">
							<div
								style={{
									fontSize: 26,
									fontWeight: 700,
									color: T.white,
								}}
							>
								{selectedCustomer.totalMessages}
							</div>
						</DrawerSection>

						<DrawerSection label="Last Seen">
							<div
								style={{
									color: T.muted,
								}}
							>
								{selectedCustomer.lastSeen
									? new Date(
											selectedCustomer.lastSeen._seconds *
												1000,
										).toLocaleString()
									: "Never"}
							</div>
						</DrawerSection>
					</>
				)}
			</Drawer>
		</div>
	);
}
