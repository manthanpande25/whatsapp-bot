import { T } from "../constants/theme";
import { Icon } from "./Icon";

export interface ToastProps {
	msg: string;
	type?: "success" | "error";
	onClose: () => void;
}

export function Toast({ msg, type = "success", onClose }: ToastProps) {
	return (
		<div
			style={{
				position: "fixed",
				bottom: 24,
				right: 24,
				zIndex: 9999,
				background: type === "success" ? T.jade : T.red,
				color: type === "success" ? T.forest : T.white,
				padding: "14px 20px",
				borderRadius: 12,
				fontWeight: 600,
				fontSize: 14,
				display: "flex",
				alignItems: "center",
				gap: 10,
				boxShadow: "0 8px 32px rgba(0,0,0,.4)",
				animation: "slideUp .3s ease",
			}}
		>
			<Icon
				name={type === "success" ? "check" : "x"}
				size={16}
				color={type === "success" ? T.forest : T.white}
			/>
			{msg}
			<button
				onClick={onClose}
				style={{
					background: "none",
					border: "none",
					cursor: "pointer",
					marginLeft: 8,
					opacity: 0.7,
					display: "flex",
					alignItems: "center",
				}}
			>
				<Icon
					name="x"
					size={14}
					color={type === "success" ? T.forest : T.white}
				/>
			</button>
		</div>
	);
}
