import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function SignIn() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email.trim() || !password.trim()) {
			setError("Email and password are required.");
			return;
		}

		try {
			setLoading(true);
			setError("");

			const response = await fetch(
				`${API_URL}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: email.trim(),
						password,
					}),
				},
			);

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(
					data.message || "Login failed.",
				);
			}

			// Save authentication data
			localStorage.setItem("token", data.token);
			localStorage.setItem(
				"organizationId",
				data.user.organizationId,
			);
			localStorage.setItem("Name", data.user.name);

			// Go to dashboard
			navigate("/dashboard");
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Something went wrong.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#061c14",
				padding: "20px",
			}}
		>
			<div
				style={{
					width: "100%",
					maxWidth: "420px",
					background: "#0b281d",
					border: "1px solid #173d2e",
					borderRadius: "16px",
					padding: "32px",
				}}
			>
				<h1
					style={{
						color: "#ffffff",
						marginBottom: "8px",
					}}
				>
					Welcome back
				</h1>

				<p
					style={{
						color: "#7da996",
						marginBottom: "28px",
					}}
				>
					Sign in to your WaBot AI account
				</p>

				<form onSubmit={handleLogin}>
					<label
						style={{
							display: "block",
							color: "#ffffff",
							marginBottom: "8px",
						}}
					>
						Email
					</label>

					<input
						type="email"
						value={email}
						onChange={(e) =>
							setEmail(e.target.value)
						}
						placeholder="Enter your email"
						style={{
							width: "100%",
							boxSizing: "border-box",
							padding: "13px",
							marginBottom: "18px",
							borderRadius: "10px",
							border: "1px solid #234b3b",
							background: "#071f16",
							color: "#ffffff",
							outline: "none",
						}}
					/>

					<label
						style={{
							display: "block",
							color: "#ffffff",
							marginBottom: "8px",
						}}
					>
						Password
					</label>

					<input
						type="password"
						value={password}
						onChange={(e) =>
							setPassword(e.target.value)
						}
						placeholder="Enter your password"
						style={{
							width: "100%",
							boxSizing: "border-box",
							padding: "13px",
							marginBottom: "18px",
							borderRadius: "10px",
							border: "1px solid #234b3b",
							background: "#071f16",
							color: "#ffffff",
							outline: "none",
						}}
					/>

					{error && (
						<div
							style={{
								color: "#ff6b6b",
								fontSize: "14px",
								marginBottom: "16px",
							}}
						>
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={loading}
						style={{
							width: "100%",
							padding: "13px",
							border: "none",
							borderRadius: "10px",
							background: "#20e890",
							color: "#061c14",
							fontWeight: 700,
							cursor: loading
								? "not-allowed"
								: "pointer",
							opacity: loading ? 0.7 : 1,
						}}
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
}