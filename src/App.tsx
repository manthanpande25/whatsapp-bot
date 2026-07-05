import { BrowserRouter, Route, Routes, Navigate, useOutletContext } from "react-router-dom";
import { AppLayout } from "./components";
import {
	AIBuilder,
	Analytics,
	Billing,
	Bookings,
	CRM,
	Dashboard,
	Inbox,
	KnowledgeBase,
	LandingPage,
	Settings,
} from "./screens";

interface OutletContextType {
	showToast: (msg: string, type?: "success" | "error") => void;
}

function AIBuilderWrapper() {
	const { showToast } = useOutletContext<OutletContextType>();
	return <AIBuilder showToast={showToast} />;
}

function SettingsWrapper() {
	const { showToast } = useOutletContext<OutletContextType>();
	return <Settings showToast={showToast} />;
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route element={<AppLayout />}>
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="inbox" element={<Inbox />} />
					<Route path="ai-builder" element={<AIBuilderWrapper />} />
					<Route path="analytics" element={<Analytics />} />
					<Route path="crm" element={<CRM />} />
					<Route path="bookings" element={<Bookings />} />
					<Route path="knowledge" element={<KnowledgeBase />} />
					<Route path="billing" element={<Billing />} />
					<Route path="settings" element={<SettingsWrapper />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	);
}

