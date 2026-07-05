import { useState } from "react";
import { Badge, Btn, Card, Icon, Input } from "../components";
import { T } from "../constants/theme";

interface FAQ {
	q: string;
	a: string;
	status: "Active" | "Draft";
}

export interface KnowledgeBaseProps {}

export function KnowledgeBase() {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [searching, setSearching] = useState(false);

	const faqs: FAQ[] = [
		{
			q: "What are your clinic timings?",
			a: "Mon–Sat, 9 AM to 7 PM. Sundays closed.",
			status: "Active",
		},
		{
			q: "What is the consultation fee?",
			a: "General: ₹300. Specialist: ₹500.",
			status: "Active",
		},
		{
			q: "Do you accept insurance?",
			a: "Yes, we accept most major health insurance plans.",
			status: "Active",
		},
		{
			q: "How do I book an appointment?",
			a: "Reply with your preferred date and time on WhatsApp.",
			status: "Active",
		},
		{
			q: "What is your cancellation policy?",
			a: "Cancel at least 2 hours before your appointment.",
			status: "Draft",
		},
	];

	const searchKB = async () => {
		if (!question.trim() || searching) return;
		setSearching(true);
		setAnswer("");
		try {
			const faqContext = faqs
				.map((f) => `Q: ${f.q}\nA: ${f.a}`)
				.join("\n\n");
			const res = await fetch("https://api.anthropic.com/v1/messages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					model: "claude-sonnet-4-6",
					max_tokens: 1000,
					system: `You are an AI assistant helping manage a knowledge base for WaBot.ai. Given these FAQs:\n\n${faqContext}\n\nAnswer the admin's question about how the bot would respond, or what should be added to the KB. Be concise and helpful.`,
					messages: [{ role: "user", content: question }],
				}),
			});
			const data = await res.json();
			setAnswer(data.content?.[0]?.text || "");
		} catch {
			setAnswer("Error connecting to AI.");
		}
		setSearching(false);
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
						Knowledge Base
					</div>
					<div style={{ fontSize: 13, color: T.muted }}>
						FAQs · Documents · Web content
					</div>
				</div>
				<Btn size="sm">
					<Icon name="plus" size={14} color={T.forest} /> Add FAQ
				</Btn>
			</div>

			<div
				className="responsive-grid-2"
				style={{
					gap: 16,
					marginBottom: 24,
				}}
			>
				{/* AI Search */}
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 15,
							marginBottom: 4,
							display: "flex",
							gap: 8,
							alignItems: "center",
						}}
					>
						<Icon name="sparkle" size={16} color={T.jade} /> AI
						Search
					</div>
					<div
						style={{
							fontSize: 12,
							color: T.muted,
							marginBottom: 14,
						}}
					>
						Ask anything about your knowledge base
					</div>
					<Input
						placeholder="e.g. How would the bot answer a fee question?"
						value={question}
						onChange={setQuestion}
					/>
					<div style={{ marginTop: 10 }}>
						<Btn onClick={searchKB} disabled={searching}>
							{searching ? "Searching..." : "Search KB"}
						</Btn>
					</div>
					{answer && (
						<div
							style={{
								marginTop: 14,
								background: T.deep,
								border: `1px solid ${T.jade}44`,
								borderRadius: 10,
								padding: 14,
							}}
						>
							<div
								style={{
									fontSize: 11,
									color: T.jade,
									fontWeight: 600,
									marginBottom: 6,
								}}
							>
								AI Answer
							</div>
							<div
								style={{
									fontSize: 13,
									color: T.cream,
									lineHeight: 1.6,
								}}
							>
								{answer}
							</div>
						</div>
					)}
				</Card>

				{/* Upload */}
				<Card>
					<div
						style={{
							fontWeight: 700,
							color: T.white,
							fontSize: 15,
							marginBottom: 14,
						}}
					>
						Upload Documents
					</div>
					<div
						style={{
							border: `2px dashed ${T.border}`,
							borderRadius: 12,
							padding: 32,
							textAlign: "center",
							cursor: "pointer",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.borderColor = T.jade + "66")
						}
						onMouseLeave={(e) =>
							(e.currentTarget.style.borderColor = T.border)
						}
					>
						<Icon name="upload" size={28} color={T.muted} />
						<div
							style={{
								color: T.cream,
								fontSize: 14,
								fontWeight: 600,
								marginTop: 10,
							}}
						>
							Drop files here
						</div>
						<div
							style={{
								color: T.muted,
								fontSize: 12,
								marginTop: 4,
							}}
						>
							PDF, Word, images · Max 10 MB
						</div>
						<Btn
							variant="outline"
							size="sm"
							style={{ marginTop: 14 }}
						>
							Browse files
						</Btn>
					</div>
					<div style={{ marginTop: 14, display: "flex", gap: 8 }}>
						{["PDF", "Word", "Image", "Website URL"].map((t) => (
							<Badge key={t} color={T.muted} bg={T.border}>
								{t}
							</Badge>
						))}
					</div>
				</Card>
			</div>

			{/* FAQ List */}
			<Card style={{ padding: 0 }}>
				<div
					style={{
						padding: "16px 20px",
						borderBottom: `1px solid ${T.border}`,
						fontWeight: 700,
						color: T.white,
					}}
				>
					FAQs · {faqs.length} entries
				</div>
				{faqs.map((f, i) => (
					<div
						key={i}
						style={{
							padding: "16px 20px",
							borderBottom:
								i < faqs.length - 1
									? `1px solid ${T.border}`
									: "none",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
								marginBottom: 6,
								flexWrap: "wrap",
								gap: 12,
							}}
						>
							<div
								style={{
									fontSize: 14,
									fontWeight: 600,
									color: T.cream,
								}}
							>
								{f.q}
							</div>
							<div
								style={{
									display: "flex",
									gap: 8,
									alignItems: "center",
								}}
							>
								<Badge
									color={
										f.status === "Active" ? T.jade : T.amber
									}
									bg={
										f.status === "Active"
											? T.jadeDim
											: T.amber + "22"
									}
								>
									{f.status}
								</Badge>
								<Btn variant="ghost" size="sm">
									Edit
								</Btn>
							</div>
						</div>
						<div style={{ fontSize: 13, color: T.muted }}>
							{f.a}
						</div>
					</div>
				))}
			</Card>
		</div>
	);
}
