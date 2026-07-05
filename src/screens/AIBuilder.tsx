import { useState } from "react";
import { Badge, Btn, Card, Icon } from "../components";
import { T } from "../constants/theme";

interface TestMessage {
	role: "assistant" | "user";
	text: string;
	time: string;
}

export interface AIBuilderProps {
	showToast: (msg: string, type?: "success" | "error") => void;
}

export function AIBuilder({ showToast }: AIBuilderProps) {
	const [systemPrompt, setSystemPrompt] =
		useState(`You are a friendly AI assistant for Dr. Sharma's Clinic in Nagpur. 

Business Details:
- Timings: Monday to Saturday, 9 AM to 7 PM
- Consultation fee: ₹300 (General), ₹500 (Specialist)
- Location: 42, Dharampeth, Nagpur - 440010
- Phone: +91 98765 43210

Instructions:
- Always greet warmly with "Namaste 🙏"
- Help patients book appointments, answer FAQs, and capture leads
- Respond in the same language as the customer (Hindi/English/Marathi)
- Escalate complex medical questions to human staff
- Always confirm bookings with a summary`);

	const [testInput, setTestInput] = useState("");
	const [testMessages, setTestMessages] = useState<TestMessage[]>([
		{
			role: "assistant",
			text: "Namaste! 🙏 Welcome to Dr. Sharma's Clinic. How can I help you today?",
			time: "now",
		},
	]);
	const [loading, setLoading] = useState(false);
	const [tone, setTone] = useState("Friendly");
	const [lang, setLang] = useState("Hindi + English");
	const [temp, setTemp] = useState(0.7);
	const [saving, setSaving] = useState(false);

	const testBot = async () => {
		if (!testInput.trim() || loading) return;
		const msg = testInput;
		setTestMessages((prev) => [
			...prev,
			{ role: "user", text: msg, time: "now" },
		]);
		setTestInput("");
		setLoading(true);

		try {
			const history = testMessages.map((m) => ({
				role: m.role,
				content: m.text,
			}));
			const res = await fetch("https://api.anthropic.com/v1/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "claude-sonnet-4-6",
					max_tokens: 1000,
					system: systemPrompt,
					messages: [...history, { role: "user", content: msg }],
				}),
			});
			const data = await res.json();
			const reply =
				data.content?.[0]?.text || "I couldn't generate a response.";
			setTestMessages((prev) => [
				...prev,
				{ role: "assistant", text: reply, time: "now" },
			]);
		} catch {
			setTestMessages((prev) => [
				...prev,
				{
					role: "assistant",
					text: "Error connecting to AI. Check your configuration.",
					time: "now",
				},
			]);
		}
		setLoading(false);
	};

	const handleSave = async () => {
		setSaving(true);
		await new Promise((r) => setTimeout(r, 800));
		setSaving(false);
		showToast("AI configuration published ✓", "success");
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
			{/* Config Panel */}
			<div
				style={{
					width: 420,
					borderRight: `1px solid ${T.border}`,
					overflowY: "auto",
					padding: 24,
					display: "flex",
					flexDirection: "column",
					gap: 20,
					flexShrink: 0,
				}}
			>
				<div>
					<div
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 24,
							fontWeight: 800,
							color: T.white,
							marginBottom: 4,
						}}
					>
						AI Configuration
					</div>
					<div style={{ fontSize: 13, color: T.muted }}>
						Tune your bot's knowledge, tone, and behaviour.
					</div>
				</div>

				<Card>
					<div
						style={{
							fontWeight: 600,
							color: T.cream,
							fontSize: 14,
							marginBottom: 12,
							display: "flex",
							alignItems: "center",
							gap: 8,
						}}
					>
						<Icon name="bot" size={16} color={T.jade} /> System
						Prompt
					</div>
					<textarea
						value={systemPrompt}
						onChange={(e) => setSystemPrompt(e.target.value)}
						style={{
							width: "100%",
							background: T.deep,
							border: `1px solid ${T.border}`,
							borderRadius: 10,
							padding: 12,
							color: T.cream,
							fontSize: 13,
							fontFamily: "Inter, sans-serif",
							resize: "vertical",
							minHeight: 220,
							outline: "none",
							boxSizing: "border-box",
							lineHeight: 1.6,
						}}
					/>
				</Card>

				<Card>
					<div
						style={{
							fontWeight: 600,
							color: T.cream,
							fontSize: 14,
							marginBottom: 16,
						}}
					>
						Personality & Tone
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 14,
						}}
					>
						<div>
							<div
								style={{
									fontSize: 12,
									color: T.muted,
									marginBottom: 8,
								}}
							>
								Tone
							</div>
							<div
								style={{
									display: "flex",
									gap: 8,
									flexWrap: "wrap",
								}}
							>
								{[
									"Friendly",
									"Professional",
									"Concise",
									"Warm",
								].map((t) => (
									<Btn
										key={t}
										variant={
											tone === t ? "primary" : "outline"
										}
										size="sm"
										onClick={() => setTone(t)}
									>
										{t}
									</Btn>
								))}
							</div>
						</div>
						<div>
							<div
								style={{
									fontSize: 12,
									color: T.muted,
									marginBottom: 8,
								}}
							>
								Language
							</div>
							<div
								style={{
									display: "flex",
									gap: 8,
									flexWrap: "wrap",
								}}
							>
								{[
									"Hindi + English",
									"English only",
									"Marathi + Hindi",
									"All 3",
								].map((l) => (
									<Btn
										key={l}
										variant={
											lang === l ? "primary" : "outline"
										}
										size="sm"
										onClick={() => setLang(l)}
									>
										{l}
									</Btn>
								))}
							</div>
						</div>
						<div>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: 8,
								}}
							>
								<span style={{ fontSize: 12, color: T.muted }}>
									Creativity (Temperature)
								</span>
								<span
									style={{
										fontSize: 12,
										color: T.jade,
										fontWeight: 600,
									}}
								>
									{temp.toFixed(1)}
								</span>
							</div>
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								value={temp}
								onChange={(e) =>
									setTemp(parseFloat(e.target.value))
								}
								style={{ width: "100%", accentColor: T.jade }}
							/>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<span style={{ fontSize: 10, color: T.muted }}>
									Precise
								</span>
								<span style={{ fontSize: 10, color: T.muted }}>
									Creative
								</span>
							</div>
						</div>
					</div>
				</Card>

				<Card>
					<div
						style={{
							fontWeight: 600,
							color: T.cream,
							fontSize: 14,
							marginBottom: 14,
						}}
					>
						Escalation Rules
					</div>
					{[
						"Medical emergency keywords",
						"Price negotiation requests",
						"Legal complaints",
						"3+ unanswered queries",
					].map((r) => (
						<div
							key={r}
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								padding: "8px 0",
								borderBottom: `1px solid ${T.border}`,
							}}
						>
							<span style={{ fontSize: 13, color: T.muted }}>
								{r}
							</span>
							<div
								style={{
									width: 36,
									height: 20,
									background: T.jade,
									borderRadius: 10,
									cursor: "pointer",
									position: "relative",
								}}
							>
								<div
									style={{
										width: 16,
										height: 16,
										background: T.white,
										borderRadius: "50%",
										position: "absolute",
										right: 2,
										top: 2,
									}}
								/>
							</div>
						</div>
					))}
				</Card>

				<div style={{ display: "flex", gap: 10 }}>
					<Btn
						variant="outline"
						style={{ flex: 1, justifyContent: "center" }}
					>
						Save Draft
					</Btn>
					<Btn
						style={{ flex: 1, justifyContent: "center" }}
						onClick={handleSave}
						disabled={saving}
					>
						{saving ? "Publishing..." : "Publish Live"}
					</Btn>
				</div>
			</div>

			{/* Live Test Preview */}
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						padding: "16px 24px",
						borderBottom: `1px solid ${T.border}`,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<div>
						<div
							style={{
								fontWeight: 700,
								color: T.white,
								fontSize: 15,
							}}
						>
							Live Test Preview
						</div>
						<div style={{ fontSize: 12, color: T.muted }}>
							Chat with your bot in real-time to test responses
						</div>
					</div>
					<div style={{ display: "flex", gap: 8 }}>
						<Btn
							variant="outline"
							size="sm"
							onClick={() =>
								setTestMessages([
									{
										role: "assistant",
										text: "Namaste! 🙏 Welcome to Dr. Sharma's Clinic. How can I help you today?",
										time: "now",
									},
								])
							}
						>
							<Icon name="refresh" size={14} color={T.muted} />{" "}
							Reset
						</Btn>
						<Badge>GPT-4 · claude-sonnet-4-6</Badge>
					</div>
				</div>

				<div
					style={{
						flex: 1,
						overflowY: "auto",
						padding: 20,
						display: "flex",
						flexDirection: "column",
						gap: 10,
						background: "#0d1e15",
					}}
				>
					{testMessages.map((m, i) => (
						<div
							key={i}
							style={{
								display: "flex",
								justifyContent:
									m.role === "user"
										? "flex-end"
										: "flex-start",
							}}
						>
							<div
								style={{
									maxWidth: "72%",
									background:
										m.role === "user" ? T.jadeDim : T.card,
									border: `1px solid ${m.role === "user" ? T.jade + "44" : T.border}`,
									borderRadius:
										m.role === "user"
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
										🤖 WaBot
									</div>
								)}
								<div
									style={{
										fontSize: 13,
										color: T.cream,
										lineHeight: 1.6,
										whiteSpace: "pre-line",
									}}
								>
									{m.text}
								</div>
							</div>
						</div>
					))}
					{loading && (
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
				</div>

				<div
					style={{
						padding: "16px 24px",
						borderTop: `1px solid ${T.border}`,
						display: "flex",
						gap: 10,
					}}
				>
					<div style={{ flex: 1 }}>
						<input
							value={testInput}
							onChange={(e) => setTestInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && testBot()}
							placeholder="Test a customer message... e.g. 'I need an appointment tomorrow'"
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
					<Btn onClick={testBot} disabled={loading}>
						<Icon name="send" size={14} color={T.forest} />
					</Btn>
				</div>

				{/* Quick test prompts */}
				<div
					style={{
						padding: "0 24px 16px",
						display: "flex",
						gap: 8,
						flexWrap: "wrap",
					}}
				>
					{[
						"What are your timings?",
						"I need an appointment for tomorrow",
						"How much is the fee?",
						"Can I bring my child?",
					].map((q) => (
						<Btn
							key={q}
							variant="ghost"
							size="sm"
							onClick={() => setTestInput(q)}
						>
							{q}
						</Btn>
					))}
				</div>
			</div>
		</div>
	);
}
