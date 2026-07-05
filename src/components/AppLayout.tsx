import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Btn } from "./Btn";
import { Icon } from "./Icon";
import { Sidebar } from "./Sidebar";
import { Toast } from "./Toast";
import { Topbar } from "./Topbar";
import { T } from "../constants/theme";

const SCREEN_TITLES: Record<string, [string, string]> = {
	dashboard: ["Dashboard", "Overview of your bot's performance"],
	inbox: ["Inbox", "AI-powered customer conversations"],
	"ai-builder": [
		"AI Builder",
		"Configure your bot's knowledge & personality",
	],
	analytics: ["Analytics", "Conversation insights & conversion data"],
	crm: ["CRM", "Customer & lead management"],
	bookings: ["Bookings", "Appointment calendar"],
	knowledge: ["Knowledge Base", "FAQs, documents & training data"],
	billing: ["Billing", "Subscription & invoices"],
	settings: ["Settings", "Account & integration settings"],
};

export function AppLayout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const [toast, setToast] = useState<{
		msg: string;
		type?: "success" | "error";
	} | null>(null);

	const showToast = (msg: string, type: "success" | "error" = "success") => {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3000);
	};

	const path = location.pathname.replace(/^\//, "") || "dashboard";
	const [title, subtitle] = SCREEN_TITLES[path] || ["WaBot.ai", ""];

	return (
		<>
			<div
				style={{
					display: "flex",
					height: "100vh",
					overflow: "hidden",
					background: T.forest,
				}}
			>
				<Sidebar
					active={path}
					collapsed={collapsed}
					setCollapsed={setCollapsed}
					isOpenMobile={isMobileSidebarOpen}
					onClose={() => setIsMobileSidebarOpen(false)}
				/>
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						overflow: "hidden",
					}}
				>
					<Topbar
						title={title}
						subtitle={subtitle}
						onMenuClick={() => setIsMobileSidebarOpen(true)}
						actions={
							<Btn
								variant="ghost"
								size="sm"
								onClick={() => navigate("/")}
								className="hide-on-mobile"
							>
								<Icon
									name="globe"
									size={14}
									color={T.muted}
								/>{" "}
								View landing
							</Btn>
						}
					/>
					<div
						style={{
							flex: 1,
							overflow: "hidden",
							display: "flex",
						}}
					>
						<Outlet context={{ showToast }} />
					</div>
				</div>
			</div>

			{toast && (
				<Toast
					msg={toast.msg}
					type={toast.type}
					onClose={() => setToast(null)}
				/>
			)}
		</>
	);
}
