import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Btn, Icon } from "../components";
import { T } from "../constants/theme";

export function LandingPage() {
	const [bubbles, setBubbles] = useState([false, false, false, false]);
	const [typing, setTyping] = useState([false, false]);

	useEffect(() => {
		const timeline: [number, () => void][] = [
			[300, () => setBubbles([true, false, false, false])],
			[1000, () => setTyping([true, false])],
			[
				2200,
				() => {
					setTyping([false, false]);
					setBubbles([true, true, false, false]);
				},
			],
			[3200, () => setBubbles([true, true, true, false])],
			[4000, () => setTyping([false, true])],
			[
				5200,
				() => {
					setTyping([false, false]);
					setBubbles([true, true, true, true]);
				},
			],
		];

		const timers = timeline.map(([t, fn]) => setTimeout(fn, t));
		const reset = setTimeout(() => {
			setBubbles([false, false, false, false]);
			setTyping([false, false]);
		}, 8500);

		return () => [...timers, reset].forEach(clearTimeout);
	}, [bubbles[3]]);

	const stats = [
		{ v: "63M+", l: "Indian MSMEs" },
		{ v: "92%", l: "Use WhatsApp for biz" },
		{ v: "₹0", l: "Paid ads in Year 1" },
		{ v: "10 min", l: "Setup time" },
	];

	return (
		<div
			style={{
				background: T.forest,
				minHeight: "100vh",
				overflowY: "auto",
				width: "100%",
			}}
		>
			{/* NAV */}
			<nav
				style={{
					position: "sticky",
					top: 0,
					zIndex: 50,
					background: "rgba(10,34,24,.9)",
					backdropFilter: "blur(12px)",
					borderBottom: `1px solid ${T.border}`,
					padding: "0 5%",
				}}
			>
				<div
					style={{
						maxWidth: 1200,
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						height: 64,
						gap: 32,
					}}
				>
					<div
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 24,
							fontWeight: 800,
							color: T.white,
						}}
					>
						Wa<span style={{ color: T.jade }}>Bot</span>.ai
					</div>
					<div
						style={{ display: "flex", gap: 24, flex: 1 }}
						className="hide-on-mobile"
					>
						{["Features", "Pricing", "Docs", "Blog"].map((l) => (
							<a
								key={l}
								href="#"
								style={{
									color: T.muted,
									textDecoration: "none",
									fontSize: 14,
									transition: "color .2s",
								}}
							>
								{l}
							</a>
						))}
					</div>
					<div style={{ display: "flex", gap: 10 }}>
						<Link to="/dashboard" style={{ textDecoration: "none" }}>
							<Btn variant="outline" size="sm">
								Sign in
							</Btn>
						</Link>
						<Link to="/dashboard" style={{ textDecoration: "none" }}>
							<Btn size="sm">Get started free</Btn>
						</Link>
					</div>
				</div>
			</nav>

			{/* HERO */}
			<div
				className="responsive-grid-2"
				style={{
					maxWidth: 1200,
					margin: "0 auto",
					padding: "clamp(40px, 8vw, 80px) 5%",
					gap: "40px 60px",
					alignItems: "center",
				}}
			>
				<div>
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 8,
							background: T.jadeDim,
							border: `1px solid ${T.jade}44`,
							color: T.jade,
							fontSize: 12,
							fontWeight: 600,
							padding: "6px 14px",
							borderRadius: 100,
							marginBottom: 28,
							letterSpacing: ".06em",
							textTransform: "uppercase",
						}}
					>
						<span
							style={{
								width: 6,
								height: 6,
								background: T.jade,
								borderRadius: "50%",
								animation: "pulse 2s infinite",
							}}
						/>
						Seed Round Open · Nagpur 2026
					</div>
					<h1
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: "clamp(36px, 6vw, 72px)",
							fontWeight: 800,
							color: T.white,
							lineHeight: 1.0,
							marginBottom: 20,
							letterSpacing: -1,
						}}
					>
						Never miss a<br />
						<span style={{ color: T.jade }}>WhatsApp</span>
						<br />
						customer again.
					</h1>
					<p
						style={{
							color: T.muted,
							fontSize: 17,
							lineHeight: 1.7,
							maxWidth: 460,
							marginBottom: 36,
						}}
					>
						AI chatbot for your WhatsApp number. Handles bookings,
						FAQs, and follow-ups 24/7 in Hindi, English, and Marathi
						— live in 10 minutes.
					</p>
					<div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
						<Link to="/dashboard" style={{ textDecoration: "none" }}>
							<Btn size="lg">
								Start free trial{" "}
								<Icon name="arrow" size={16} color={T.forest} />
							</Btn>
						</Link>
						<Btn variant="outline" size="lg">
							Watch demo
						</Btn>
					</div>
					<div style={{ display: "flex", gap: 32 }}>
						{[
							{ v: "10 min", l: "Setup" },
							{ v: "24/7", l: "Always on" },
							{ v: "₹1,500", l: "From /month" },
						].map((s) => (
							<div key={s.l}>
								<div
									style={{
										fontFamily:
											"'Barlow Condensed', sans-serif",
										fontSize: 28,
										fontWeight: 800,
										color: T.jade,
										lineHeight: 1,
									}}
								>
									{s.v}
								</div>
								<div
									style={{
										fontSize: 12,
										color: T.muted,
										marginTop: 3,
									}}
								>
									{s.l}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* PHONE MOCKUP */}
				<div style={{ display: "flex", justifyContent: "center" }}>
					<div
						style={{
							width: 300,
							borderRadius: 40,
							background: "#0d0d1a",
							border: `2px solid ${T.border}`,
							boxShadow: `0 40px 80px rgba(0,0,0,.5), 0 0 60px rgba(31,232,138,.06)`,
							overflow: "hidden",
						}}
					>
						<div
							style={{
								background: "#075E54",
								padding: "12px 16px",
								display: "flex",
								alignItems: "center",
								gap: 10,
							}}
						>
							<div
								style={{
									width: 36,
									height: 36,
									borderRadius: "50%",
									background: T.jade,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontFamily:
										"'Barlow Condensed', sans-serif",
									fontWeight: 800,
									color: T.forest,
									fontSize: 16,
								}}
							>
								W
							</div>
							<div>
								<div
									style={{
										color: T.white,
										fontWeight: 600,
										fontSize: 14,
									}}
								>
									Dr. Sharma's Clinic
								</div>
								<div style={{ color: "#acf7c1", fontSize: 11 }}>
									● WaBot active · online
								</div>
							</div>
						</div>
						<div
							style={{
								background: "#e5ddd5",
								minHeight: 400,
								padding: 12,
								display: "flex",
								flexDirection: "column",
								gap: 8,
							}}
						>
							{[
								{
									out: false,
									text: "Hi! I need an appointment for tomorrow 🙏",
									show: bubbles[0],
									typing: false,
								},
								{
									out: false,
									text: "",
									show: typing[0],
									typing: true,
								},
								{
									out: true,
									text: "Namaste! 🙏 Available tomorrow:\n• 9:00 AM\n• 11:30 AM ✓\n• 4:00 PM\n\nWhich slot works?",
									show: bubbles[1],
									typing: false,
								},
								{
									out: false,
									text: "11:30 AM please. What's the consultation fee?",
									show: bubbles[2],
									typing: false,
								},
								{
									out: false,
									text: "",
									show: typing[1],
									typing: true,
								},
								{
									out: true,
									text: "✅ Booked for 11:30 AM!\nFee: ₹300. Reminder sent 📲",
									show: bubbles[3],
									typing: false,
								},
							].map((b, i) =>
								b.typing ? (
									<div
										key={i}
										style={{
											opacity: b.show ? 1 : 0,
											transition: "opacity .3s",
											background: "white",
											padding: "10px 14px",
											borderRadius: 8,
											borderBottomLeftRadius: 2,
											width: 60,
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
													background: "#999",
													borderRadius: "50%",
													animation: `bounce 1.2s ${d * 0.2}s infinite`,
												}}
											/>
										))}
									</div>
								) : (
									<div
										key={i}
										style={{
											opacity: b.show ? 1 : 0,
											transform: b.show
												? "translateY(0)"
												: "translateY(4px)",
											transition: "all .35s ease",
											background: b.out
												? "#DCF8C6"
												: "white",
											padding: "8px 12px",
											borderRadius: 8,
											...(b.out
												? {
														alignSelf: "flex-end",
														borderBottomRightRadius: 2,
													}
												: {
														alignSelf: "flex-start",
														borderBottomLeftRadius: 2,
													}),
											maxWidth: "82%",
											fontSize: 12,
											color: "#111",
											lineHeight: 1.5,
											whiteSpace: "pre-line",
										}}
									>
										{b.text}
										<div
											style={{
												fontSize: 10,
												color: "#999",
												textAlign: "right",
												marginTop: 2,
											}}
										>
											10:4{i} PM {b.out ? "✓✓" : ""}
										</div>
									</div>
								),
							)}
						</div>
						<div
							style={{
								background: "#f0f0f0",
								padding: "8px 12px",
								display: "flex",
								gap: 8,
								alignItems: "center",
							}}
						>
							<div
								style={{
									flex: 1,
									background: "white",
									borderRadius: 20,
									padding: "7px 14px",
									fontSize: 12,
									color: "#999",
								}}
							>
								Message...
							</div>
							<div
								style={{
									width: 32,
									height: 32,
									background: "#075E54",
									borderRadius: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon name="send" size={12} color="white" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* STATS STRIP */}
			<div
				style={{
					background: T.deep,
					borderTop: `1px solid ${T.border}`,
					borderBottom: `1px solid ${T.border}`,
					padding: "clamp(20px, 4vw, 40px) 5%",
				}}
			>
				<div
					className="responsive-grid-4"
					style={{
						maxWidth: 1200,
						margin: "0 auto",
						gap: 20,
						textAlign: "center",
					}}
				>
					{stats.map((s) => (
						<div key={s.l}>
							<div
								style={{
									fontFamily:
										"'Barlow Condensed', sans-serif",
									fontSize: 48,
									fontWeight: 800,
									color: T.white,
									lineHeight: 1,
								}}
							>
								{s.v}
							</div>
							<div
								style={{
									fontSize: 13,
									color: T.muted,
									marginTop: 4,
								}}
							>
								{s.l}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* PRICING PREVIEW */}
			<div
				style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 5%" }}
			>
				<div style={{ textAlign: "center", marginBottom: 48 }}>
					<div
						style={{
							color: T.jade,
							fontSize: 12,
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: ".1em",
							marginBottom: 12,
						}}
					>
						Pricing
					</div>
					<h2
						style={{
							fontFamily: "'Barlow Condensed', sans-serif",
							fontSize: 52,
							fontWeight: 800,
							color: T.white,
							marginBottom: 14,
						}}
					>
						Less than one missed booking
					</h2>
					<p
						style={{
							color: T.muted,
							fontSize: 16,
							maxWidth: 460,
							margin: "0 auto",
						}}
					>
						A full-time WhatsApp agent costs ₹12,000–18,000/mo.
						WaBot.ai starts at ₹1,500.
					</p>
				</div>
				<div className="responsive-grid-3" style={{ gap: 18 }}>
					{[
						{
							name: "Starter",
							price: "₹1,500",
							per: "/month",
							tag: "Small shops",
							features: [
								"500 AI replies/mo",
								"1 bot",
								"Basic dashboard",
								"Hindi + English",
							],
							popular: false,
						},
						{
							name: "Growth",
							price: "₹3,000",
							per: "/month",
							tag: "Clinics · Salons · Coaching",
							popular: true,
							features: [
								"2,000 replies/mo",
								"Appointment booking",
								"Lead capture & follow-up",
								"Hindi · English · Marathi",
							],
						},
						{
							name: "Pro",
							price: "₹5,000",
							per: "/month",
							tag: "Restaurants · Institutes",
							features: [
								"Unlimited replies",
								"Multi-agent support",
								"Custom branding + API",
								"Priority support",
							],
							popular: false,
						},
					].map((p) => (
						<div
							key={p.name}
							style={{
								background: T.card,
								border: `1px solid ${p.popular ? T.jade : T.border}`,
								borderRadius: 16,
								padding: 28,
								position: "relative",
								...(p.popular
									? {
											background: `linear-gradient(160deg, rgba(31,232,138,.07) 0%, ${T.card} 60%)`,
										}
									: {}),
							}}
						>
							{p.popular && (
								<div
									style={{
										position: "absolute",
										top: -12,
										left: "50%",
										transform: "translateX(-50%)",
										background: T.jade,
										color: T.forest,
										fontSize: 11,
										fontWeight: 700,
										padding: "4px 14px",
										borderRadius: 100,
										textTransform: "uppercase",
										letterSpacing: ".06em",
									}}
								>
									Most Popular
								</div>
							)}
							<div
								style={{
									color: T.muted,
									fontSize: 12,
									fontWeight: 600,
									textTransform: "uppercase",
									letterSpacing: ".08em",
									marginBottom: 8,
								}}
							>
								{p.name}
							</div>
							<div
								style={{
									fontFamily:
										"'Barlow Condensed', sans-serif",
									fontSize: 44,
									fontWeight: 800,
									color: T.white,
									lineHeight: 1,
								}}
							>
								{p.price}
								<span style={{ fontSize: 16, color: T.muted }}>
									{p.per}
								</span>
							</div>
							<div
								style={{
									color: T.jade,
									fontSize: 12,
									marginBottom: 20,
									marginTop: 4,
								}}
							>
								{p.tag}
							</div>
							<div
								style={{
									height: 1,
									background: T.border,
									marginBottom: 20,
								}}
							/>
							<ul
								style={{
									listStyle: "none",
									padding: 0,
									display: "flex",
									flexDirection: "column",
									gap: 10,
									marginBottom: 24,
								}}
							>
								{p.features.map((f) => (
									<li
										key={f}
										style={{
											fontSize: 13,
											color: T.muted,
											display: "flex",
											gap: 8,
										}}
									>
										<span
											style={{
												color: T.jade,
												fontWeight: 700,
											}}
										>
											✓
										</span>
										{f}
									</li>
								))}
							</ul>
							<Link to="/dashboard" style={{ textDecoration: "none" }}>
								<Btn
									variant={p.popular ? "primary" : "outline"}
									style={{
										width: "100%",
										justifyContent: "center",
									}}
								>
									Get started
								</Btn>
							</Link>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
