import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, Badge, Btn, Divider, Icon, Input } from "../components";
import { T } from "../constants/theme";
import {
	getConversations,
	updateConversationMode,
	type Conversation,
} from "../services/conversation.service";
import {
	getMessages,
	sendHumanMessage,
	type Message as BackendMessage,
} from "../services/message.service";

interface Message {
	role: "assistant" | "customer" | "human";
	text: string;
	time: string;
}

export interface InboxProps {}

export function Inbox() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selected, setSelected] = useState<Conversation | null>(null);
	const [loadingConversations, setLoadingConversations] = useState(true);

	const selectedConversationRef = useRef<string | null>(null);

	useEffect(() => {
		selectedConversationRef.current = selected?.id || null;
	}, [selected]);

	const loadConversations = useCallback(async () => {
		try {
			const token = localStorage.getItem("token");
			const organizationId = localStorage.getItem("organizationId");

			if (!token || !organizationId) {
				console.error("Token or Organization ID not found");
				return;
			}

			const response = await getConversations(organizationId, token);

			setConversations(response.data);

			setSelected((current) => {
				if (!current) {
					return response.data[0] || null;
				}

				const updated = response.data.find((c) => c.id === current.id);

				if (!updated) {
					return response.data[0] || null;
				}

				// Don't trigger the messages effect
				// if nothing important changed
				if (
					current.id === updated.id &&
					current.mode === updated.mode &&
					current.lastMessage === updated.lastMessage &&
					current.lastMessageAt?._seconds ===
						updated.lastMessageAt?._seconds
				) {
					return current;
				}

				return updated;
			});
		} catch (error) {
			console.error("Failed to load conversations:", error);
		} finally {
			setLoadingConversations(false);
		}
	}, []);

	useEffect(() => {
		loadConversations();
	}, [loadConversations]);

	useEffect(() => {
	console.log("🔵 SSE effect started");

	const token = localStorage.getItem("token");

	console.log("🔑 Token exists:", !!token);

		if (!token) {
			console.error("Token not found");
			return;
		}
  
		console.log("🟢 Creating SSE connection..."); 

		const eventSource = new EventSource(
			`http://localhost:5000/api/chat/events?token=${encodeURIComponent(token)}`,
		);

		eventSource.addEventListener("connected", () => {
			console.log("📡 SSE connected");
		});

		eventSource.addEventListener("new_message", (event) => {
			try {
				const data = JSON.parse(event.data);

				console.log("📩 SSE message:", data);

				const newMessage: Message = {
					role:
						data.sender === "AI"
							? "assistant"
							: data.sender === "HUMAN"
								? "human"
								: "customer",
					text: data.text,
					time: new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
				};

				if (selectedConversationRef.current === data.conversationId) {
					setMessages((prev) => [...prev, newMessage]);
				}
				setConversations((prev) =>
					prev.map((conversation) =>
						conversation.id === data.conversationId
							? {
									...conversation,
									lastMessage: data.text,
									lastMessageAt: {
										_seconds: Math.floor(Date.now() / 1000),
										_nanoseconds: 0,
									},
								}
							: conversation,
					),
				);
			} catch (error) {
				console.error("Failed to process SSE message:", error);
			}
		});

		eventSource.onerror = (error) => {
			console.error("SSE connection error:", error);
		};

		return () => {
			console.log("🔌 Closing SSE connection");
			eventSource.close();
		};
	}, []);

	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const loadMessages = async () => {
			if (!selected?.id) {
				setMessages([]);
				return;
			}

			try {
				const token = localStorage.getItem("token");

				if (!token) {
					console.error("Token not found");
					return;
				}

				const response = await getMessages(selected.id, token);

				const formattedMessages: Message[] = response.data.map(
					(message: BackendMessage) => ({
						role:
							message.sender === "AI"
								? "assistant"
								: message.sender === "HUMAN"
									? "human"
									: "customer",
						text: message.text,
						time: message.createdAt
							? new Date(
									message.createdAt._seconds * 1000,
								).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})
							: "-",
					}),
				);

				setMessages(formattedMessages);
			} catch (error) {
				console.error("Failed to load messages:", error);
				setMessages([]);
			}
		};

		loadMessages();
	}, [selected]);

	const [input, setInput] = useState("");
	const [mobileView, setMobileView] = useState<"list" | "chat" | "details">(
		"list",
	);
	const [aiThinking, setAiThinking] = useState(false);
	const [humanMode, setHumanMode] = useState(false);

	useEffect(() => {
		setHumanMode(selected?.mode === "HUMAN");
	}, [selected]);
	const [aiSuggestion, setAiSuggestion] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const getAiSuggestion = useCallback(async (lastMsg: string) => {
		try {
			const res = await fetch("https://api.anthropic.com/v1/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "claude-sonnet-4-6",
					max_tokens: 1000,
					system: "You are WaBot, an AI assistant for Dr. Sharma's Clinic in Nagpur. You help patients with appointment booking, timings (Mon-Sat 9AM-7PM), fees (₹300 consultation, ₹500 specialist), and general queries. Keep responses short, warm, and helpful. Speak in a friendly tone. Always in English unless asked otherwise.",
					messages: [
						{
							role: "user",
							content: `Customer message: "${lastMsg}"\n\nWrite a short, helpful reply from the clinic bot. Under 60 words.`,
						},
					],
				}),
			});
			const data = await res.json();
			return data.content?.[0]?.text || "";
		} catch {
			return "";
		}
	}, []);

	const sendMessage = async () => {
		if (!input.trim() || !selected?.id) return;

		const text = input.trim();

		try {
			setAiThinking(true);

			const token = localStorage.getItem("token");
			const organizationId = localStorage.getItem("organizationId");

			if (!token || !organizationId) {
				console.error("Token or Organization ID not found");
				return;
			}

			await sendHumanMessage(organizationId, selected.id, text, token);

			// Immediately show the sent message
			setMessages((prev) => [
				...prev,
				{
					role: "human",
					text,
					time: new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);

			setInput("");
		} catch (error) {
			console.error("Failed to send message:", error);
		} finally {
			setAiThinking(false);
		}
	};

	const getSuggestionForInput = async () => {
		if (!input.trim()) return;
		const s = await getAiSuggestion(input);
		setAiSuggestion(s);
	};

	const toggleHumanMode = async () => {
		if (!selected?.id) return;

		const token = localStorage.getItem("token");

		if (!token) {
			console.error("Token not found");
			return;
		}

		const newMode = humanMode ? "AI" : "HUMAN";

		try {
			await updateConversationMode(selected.id, newMode, token);

			setHumanMode(newMode === "HUMAN");

			// Keep selected conversation in sync
			setSelected((prev) =>
				prev
					? {
							...prev,
							mode: newMode,
						}
					: prev,
			);

			// Also update the left conversation list
			setConversations((prev) =>
				prev.map((conversation) =>
					conversation.id === selected.id
						? {
								...conversation,
								mode: newMode,
							}
						: conversation,
				),
			);
		} catch (error) {
			console.error("Failed to change conversation mode:", error);
		}
	};

	return (
		<div
			style={{
				display: "flex",
				flex: 1,
				overflow: "hidden",
				height: "100%",
			}}
		>
			{/* Conversation List */}
			<div
				className={`inbox-list-pane ${mobileView === "list" ? "mobile-active" : ""}`}
				style={{
					width: 280,
					borderRight: `1px solid ${T.border}`,
					display: "flex",
					flexDirection: "column",
					flexShrink: 0,
				}}
			>
				<div style={{ padding: "16px 16px 12px" }}>
					<Input
						placeholder="Search conversations..."
						prefix={
							<Icon name="search" size={14} color={T.muted} />
						}
						value=""
						onChange={() => {}}
					/>
				</div>
				<div
					style={{ display: "flex", gap: 6, padding: "0 16px 12px" }}
				>
					{["All", "Unread", "Starred"].map((f) => (
						<Btn
							key={f}
							variant={f === "All" ? "primary" : "ghost"}
							size="sm"
						>
							{f}
						</Btn>
					))}
				</div>
				<div style={{ overflowY: "auto", flex: 1 }}>
					{conversations.map((c) => (
						<div
							key={c.id}
							onClick={() => {
								setSelected(c);
								setMobileView("chat");
							}}
							style={{
								padding: "14px 16px",
								cursor: "pointer",
								background:
									selected?.id === c.id
										? T.jadeDim
										: "transparent",
								borderBottom: `1px solid ${T.border}`,
								transition: "background .15s",
							}}
						>
							<div
								style={{
									display: "flex",
									gap: 10,
									alignItems: "flex-start",
								}}
							>
								<Avatar name={c.customerPhone} size={36} />
								<div style={{ flex: 1, minWidth: 0 }}>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											marginBottom: 4,
										}}
									>
										<span
											style={{
												fontSize: 13,
												fontWeight: 600,
												color: T.cream,
											}}
										>
											{c.customerPhone}
										</span>
										<span
											style={{
												fontSize: 11,
												color: T.muted,
											}}
										>
											{c.lastMessageAt
												? new Date(
														c.lastMessageAt
															._seconds * 1000,
													).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})
												: "-"}
										</span>
									</div>
									<div
										style={{
											fontSize: 12,
											color: T.muted,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{c.lastMessage || "No messages yet"}
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginTop: 6,
										}}
									>
										<Badge
											color={
												c.status === "OPEN"
													? T.jade
													: T.muted
											}
											bg={
												c.status === "OPEN"
													? T.jadeDim
													: T.muted + "22"
											}
										>
											{c.status}
										</Badge>
										{c.unreadCount > 0 && (
											<span
												style={{
													background: T.jade,
													color: T.forest,
													width: 18,
													height: 18,
													borderRadius: "50%",
													fontSize: 10,
													fontWeight: 700,
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{c.unreadCount}
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Chat Window */}
			<div
				className={`inbox-chat-pane ${mobileView === "chat" ? "mobile-active" : ""}`}
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				{/* Chat Header */}
				<div
					style={{
						padding: "14px 20px",
						borderBottom: `1px solid ${T.border}`,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<div
						style={{
							display: "flex",
							gap: 12,
							alignItems: "center",
						}}
					>
						<Btn
							variant="ghost"
							size="sm"
							onClick={() => setMobileView("list")}
							className="show-only-mobile"
							style={{ display: "none", padding: "6px 8px" }}
						>
							<Icon
								name="chevron"
								size={14}
								color={T.muted}
								style={{ transform: "rotate(180deg)" }}
							/>{" "}
							Back
						</Btn>
						<Avatar
							name={selected?.customerPhone || ""}
							size={36}
						/>
						<div>
							<div
								style={{
									fontWeight: 700,
									color: T.cream,
									fontSize: 14,
								}}
							>
								{selected?.customerPhone ||
									"Select a conversation"}
							</div>
							<div style={{ fontSize: 12, color: T.jade }}>
								● Active now
							</div>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							gap: 8,
							alignItems: "center",
						}}
					>
						<Badge
							color={humanMode ? T.amber : T.jade}
							bg={humanMode ? T.amber + "22" : T.jadeDim}
							className="hide-on-mobile"
						>
							{humanMode ? "👤 Human mode" : "🤖 AI mode"}
						</Badge>
						<Btn
							onClick={toggleHumanMode}
							variant="outline"
							size="sm"
						>
							<Icon
								name={humanMode ? "bot" : "users"}
								size={13}
							/>
							{humanMode ? "Hand back to AI" : "Take over"}
						</Btn>
						<Btn
							variant="outline"
							size="sm"
							onClick={() => setMobileView("details")}
							className="show-only-mobile"
							style={{ display: "none", padding: "6px 10px" }}
						>
							<Icon name="eye" size={16} color={T.muted} /> Info
						</Btn>
					</div>
				</div>

				{/* Messages */}
				<div
					style={{
						flex: 1,
						overflowY: "auto",
						padding: 20,
						display: "flex",
						flexDirection: "column",
						gap: 12,
						background: T.deep,
					}}
				>
					{messages.map((m, i) => (
						<div
							key={i}
							style={{
								display: "flex",
								justifyContent:
									m.role === "customer"
										? "flex-end"
										: "flex-start",
							}}
						>
							<div
								style={{
									maxWidth: "70%",
									background:
										m.role === "customer" ||
										m.role === "human"
											? T.jadeDim
											: T.card,
									border: `1px solid ${
										m.role === "customer" ||
										m.role === "human"
											? T.jade + "44"
											: T.border
									}`,
									borderRadius:
										m.role === "customer" ||
										m.role === "human"
											? "14px 14px 4px 14px"
											: "14px 14px 14px 4px",
									padding: "10px 14px",
								}}
							>
								{m.role === "assistant" && (
									<div
										style={{
											fontSize: 10,
											color: T.jade,
											fontWeight: 600,
											marginBottom: 4,
										}}
									>
										🤖 WaBot AI
									</div>
								)}
								<div
									style={{
										fontSize: 13,
										color: T.cream,
										lineHeight: 1.6,
									}}
								>
									{m.text}
								</div>
								<div
									style={{
										fontSize: 10,
										color: T.muted,
										marginTop: 4,
										textAlign: "right",
									}}
								>
									{m.time}
								</div>
							</div>
						</div>
					))}
					{aiThinking && (
						<div style={{ display: "flex", gap: 6 }}>
							<div
								style={{
									background: T.card,
									border: `1px solid ${T.border}`,
									borderRadius: "14px 14px 14px 4px",
									padding: "12px 16px",
									display: "flex",
									gap: 4,
								}}
							>
								{[0, 1, 2].map((d) => (
									<span
										key={d}
										style={{
											width: 6,
											height: 6,
											background: T.jade,
											borderRadius: "50%",
											animation: `bounce 1.2s ${d * 0.2}s infinite`,
										}}
									/>
								))}
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* AI Suggestion */}
				{aiSuggestion && (
					<div
						style={{
							padding: "10px 20px",
							background: T.jadeDim,
							borderTop: `1px solid ${T.jade}44`,
						}}
					>
						<div
							style={{
								fontSize: 11,
								color: T.jade,
								fontWeight: 600,
								marginBottom: 4,
							}}
						>
							🤖 AI Suggestion
						</div>
						<div
							style={{
								fontSize: 13,
								color: T.cream,
								marginBottom: 8,
							}}
						>
							{aiSuggestion}
						</div>
						<div style={{ display: "flex", gap: 8 }}>
							<Btn
								size="sm"
								onClick={() => {
									setInput(aiSuggestion);
									setAiSuggestion("");
								}}
							>
								Use this
							</Btn>
							<Btn
								variant="ghost"
								size="sm"
								onClick={() => setAiSuggestion("")}
							>
								Dismiss
							</Btn>
						</div>
					</div>
				)}

				{/* Input */}
				<div
					style={{
						padding: "16px 20px",
						borderTop: `1px solid ${T.border}`,
						display: "flex",
						gap: 10,
						alignItems: "flex-end",
					}}
				>
					<div style={{ flex: 1 }}>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) =>
								e.key === "Enter" &&
								!e.shiftKey &&
								sendMessage()
							}
							placeholder={
								humanMode
									? "Type your reply..."
									: "Reply or let AI handle it..."
							}
							style={{
								width: "100%",
								background: T.deep,
								border: `1px solid ${T.border}`,
								borderRadius: 10,
								padding: "10px 14px",
								color: T.cream,
								fontSize: 14,
								fontFamily: "Inter, sans-serif",
								outline: "none",
								boxSizing: "border-box",
							}}
						/>
					</div>
					{humanMode && (
						<Btn
							variant="outline"
							size="sm"
							onClick={getSuggestionForInput}
						>
							<Icon name="sparkle" size={14} color={T.jade} /> AI
							suggest
						</Btn>
					)}
					<Btn onClick={sendMessage}>
						<Icon name="send" size={14} color={T.forest} />
					</Btn>
				</div>
			</div>

			{/* Customer Panel */}
			<div
				className={`inbox-details-pane ${mobileView === "details" ? "mobile-active" : ""}`}
				style={{
					width: 240,
					borderLeft: `1px solid ${T.border}`,
					padding: 16,
					overflowY: "auto",
					flexShrink: 0,
				}}
			>
				<Btn
					variant="ghost"
					size="sm"
					onClick={() => setMobileView("chat")}
					className="show-only-mobile"
					style={{
						display: "none",
						width: "100%",
						justifyContent: "flex-start",
						marginBottom: 16,
						padding: "6px 8px",
					}}
				>
					<Icon
						name="chevron"
						size={14}
						color={T.muted}
						style={{ transform: "rotate(180deg)" }}
					/>{" "}
					Back to Chat
				</Btn>
				<div style={{ textAlign: "center", marginBottom: 16 }}>
					<Avatar name={selected?.customerPhone || ""} size={52} />
					<div
						style={{
							fontWeight: 700,
							color: T.cream,
							marginTop: 10,
							fontSize: 15,
						}}
					>
						{selected?.customerPhone || "Select a conversation"}
					</div>
					<div style={{ fontSize: 12, color: T.muted }}>
						+91 98765 43210
					</div>
				</div>
				<Divider />
				{[
					{ l: "Status", v: selected?.status || "-" },
					{ l: "First seen", v: "Today" },
					{ l: "Total queries", v: "7" },
					{ l: "Bookings", v: "2" },
				].map((r) => (
					<div
						key={r.l}
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "8px 0",
							borderBottom: `1px solid ${T.border}`,
						}}
					>
						<span style={{ fontSize: 12, color: T.muted }}>
							{r.l}
						</span>
						<span
							style={{
								fontSize: 12,
								color: T.cream,
								fontWeight: 500,
							}}
						>
							{r.v}
						</span>
					</div>
				))}
				<div style={{ marginTop: 16 }}>
					<div
						style={{
							fontSize: 12,
							fontWeight: 600,
							color: T.muted,
							marginBottom: 10,
						}}
					>
						NOTES
					</div>
					<textarea
						placeholder="Add a note..."
						style={{
							width: "100%",
							background: T.deep,
							border: `1px solid ${T.border}`,
							borderRadius: 8,
							padding: "8px 10px",
							color: T.muted,
							fontSize: 12,
							fontFamily: "Inter, sans-serif",
							resize: "none",
							height: 80,
							outline: "none",
							boxSizing: "border-box",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
