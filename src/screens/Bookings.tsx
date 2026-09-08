import { useEffect, useMemo, useState } from "react";
import {
	Avatar,
	Badge,
	Btn,
	Card,
	Icon,
	Stat,
} from "../components";
import { T } from "../constants/theme";
import {
	getBookings,
	getAvailableSlots,
	createBooking,
	cancelBooking,
	rescheduleBooking,
	sendBookingReminder,
	type Booking,
} from "../services/booking.service";

type ViewMode = "DAY" | "WEEK" | "MONTH";

interface Slot {
	time: string;
	name: string;
	type: string;
	status:
		| "Confirmed"
		| "Available"
		| "Pending"
		| "Cancelled";
	booking?: Booking;
}

const SLOT_TIMES = [
	"09:00",
	"09:30",
	"10:00",
	"10:30",
	"11:00",
	"11:30",
	"12:00",
	"12:30",
	"13:00",
	"13:30",
	"14:00",
	"14:30",
	"15:00",
	"15:30",
	"16:00",
	"16:30",
	"17:00",
	"17:30",
	"18:00",
	"18:30",
];

export function Bookings() {
	// =====================================================
	// BASIC DATA
	// =====================================================

	const organizationId =
		localStorage.getItem("organizationId");

	const token =
		localStorage.getItem("token");

	const today = new Date();
	const todayString =
		getLocalDateString(today);

	// =====================================================
	// STATE
	// =====================================================

	const [bookings, setBookings] =
		useState<Booking[]>([]);

	const [availableSlots, setAvailableSlots] =
		useState<string[]>([]);

	const [loading, setLoading] =
		useState(true);

	const [error, setError] =
		useState("");

	const [selectedDate, setSelectedDate] =
		useState(todayString);

	const [viewMode, setViewMode] =
		useState<ViewMode>("DAY");

	const [calendarDate, setCalendarDate] =
		useState(new Date());

	const [loadingSlots, setLoadingSlots] =
		useState(false);

	// =====================================================
	// BOOKING MODAL
	// =====================================================

	const [showBookingModal, setShowBookingModal] =
		useState(false);

	const [editingBooking, setEditingBooking] =
		useState<Booking | null>(null);

	const [selectedTime, setSelectedTime] =
		useState("");

	const [customerName, setCustomerName] =
		useState("");

	const [customerPhone, setCustomerPhone] =
		useState("");

	const [doctorName, setDoctorName] =
		useState("Dr. Ananya Sharma");

	const [service, setService] =
		useState("Dental Consultation");

	const [bookingDate, setBookingDate] =
		useState(todayString);

	const [modalAvailableSlots, setModalAvailableSlots] =
		useState<string[]>([]);

	const [loadingModalSlots, setLoadingModalSlots] =
		useState(false);

	const [bookingLoading, setBookingLoading] =
		useState(false);

	// =====================================================
	// DETAILS MODAL
	// =====================================================

	const [selectedBooking, setSelectedBooking] =
		useState<Booking | null>(null);

	const [showDetailsModal, setShowDetailsModal] =
		useState(false);

	// =====================================================
	// LOAD ALL BOOKINGS
	// =====================================================

	const loadBookings = async () => {
		try {
			if (!organizationId || !token) {
				throw new Error(
					"Organization ID or token missing"
				);
			}

			setLoading(true);
			setError("");

			const result = await getBookings(
				organizationId,
				token
			);

			setBookings(result.data || []);
		} catch (err: any) {
			console.error(
				"Booking Load Error:",
				err
			);

			setError(
				err.message ||
					"Failed to load bookings"
			);
		} finally {
			setLoading(false);
		}
	};

	// =====================================================
	// LOAD AVAILABLE SLOTS
	// =====================================================

	const loadAvailableSlots = async (
		date: string
	) => {
		try {
			if (!organizationId || !token) {
				return;
			}

			setLoadingSlots(true);

			const result =
				await getAvailableSlots(
					organizationId,
					date,
					token
				);

			setAvailableSlots(
				result.data || []
			);
		} catch (err: any) {
			console.error(
				"Availability Error:",
				err
			);

			setAvailableSlots([]);
		} finally {
			setLoadingSlots(false);
		}
	};

	// =====================================================
	// INITIAL LOAD
	// =====================================================

	useEffect(() => {
		loadBookings();
	}, []);

	// =====================================================
	// LOAD AVAILABILITY WHEN DATE CHANGES
	// =====================================================

	useEffect(() => {
		loadAvailableSlots(
			selectedDate
		);
	}, [selectedDate]);

	// =====================================================
	// MODAL AVAILABILITY
	// =====================================================

	const loadModalAvailableSlots =
		async (date: string) => {
			try {
				if (
					!organizationId ||
					!token
				) {
					return;
				}

				setLoadingModalSlots(true);

				const result =
					await getAvailableSlots(
						organizationId,
						date,
						token
					);

				const slots =
					result.data || [];

				/*
				 * When rescheduling, the current
				 * booking's own time should also
				 * be selectable.
				 */
				if (
					editingBooking &&
					editingBooking.date ===
						date &&
					!slots.includes(
						editingBooking.time
					)
				) {
					slots.push(
						editingBooking.time
					);

					slots.sort(
						(a: string, b: string) =>
							timeToMinutes(a) -
							timeToMinutes(b)
					);
				}

				setModalAvailableSlots(
					slots
				);

				setSelectedTime(
					(current) => {
						if (
							current &&
							slots.includes(
								current
							)
						) {
							return current;
						}

						return "";
					}
				);
			} catch (err) {
				console.error(
					"Modal availability error:",
					err
				);

				setModalAvailableSlots(
					[]
				);
			} finally {
				setLoadingModalSlots(false);
			}
		};

	useEffect(() => {
		if (
			showBookingModal &&
			bookingDate
		) {
			loadModalAvailableSlots(
				bookingDate
			);
		}
	}, [
		showBookingModal,
		bookingDate,
		editingBooking,
	]);

	// =====================================================
	// OPEN NEW BOOKING
	// =====================================================

	const openBookingModal = (
		time = "",
		date = selectedDate
	) => {
		setEditingBooking(null);

		setBookingDate(date);

		setSelectedTime(time);

		setCustomerName("");

		setCustomerPhone("");

		setDoctorName(
			"Dr. Ananya Sharma"
		);

		setService(
			"Dental Consultation"
		);

		setShowBookingModal(true);
	};

	// =====================================================
	// OPEN RESCHEDULE MODAL
	// =====================================================

	const openRescheduleModal = (
		booking: Booking
	) => {
		setEditingBooking(booking);

		setBookingDate(
			booking.date
		);

		setSelectedTime(
			booking.time
		);

		setCustomerName(
			booking.customerName
		);

		setCustomerPhone(
			booking.customerPhone
		);

		setDoctorName(
			booking.doctorName
		);

		setService(
			booking.service
		);

		setShowBookingModal(true);
	};

	// =====================================================
	// CLOSE BOOKING MODAL
	// =====================================================

	const closeBookingModal = () => {
		if (bookingLoading) {
			return;
		}

		setShowBookingModal(false);

		setEditingBooking(null);

		setSelectedTime("");
	};

	// =====================================================
	// CREATE / RESCHEDULE
	// =====================================================

	const handleSaveBooking =
		async () => {
			try {
				if (
					!organizationId ||
					!token
				) {
					alert(
						"Organization ID or token missing"
					);

					return;
				}

				if (
					!customerName.trim()
				) {
					alert(
						"Please enter customer name"
					);

					return;
				}

				if (
					!customerPhone.trim()
				) {
					alert(
						"Please enter customer phone"
					);

					return;
				}

				if (!bookingDate) {
					alert(
						"Please select a date"
					);

					return;
				}

				if (!selectedTime) {
					alert(
						"Please select a time"
					);

					return;
				}

				/*
				 * When editing the same booking,
				 * its existing time is allowed.
				 */
				const isOwnExistingSlot =
					editingBooking &&
					editingBooking.date ===
						bookingDate &&
					editingBooking.time ===
						selectedTime;

				if (
					!isOwnExistingSlot &&
					!modalAvailableSlots.includes(
						selectedTime
					)
				) {
					alert(
						"This time slot is no longer available."
					);

					await loadModalAvailableSlots(
						bookingDate
					);

					return;
				}

				setBookingLoading(true);

				// -------------------------------------------------
				// RESCHEDULE
				// -------------------------------------------------

				if (editingBooking) {
					await rescheduleBooking(
						editingBooking.id!,
						{
							date: bookingDate,
							time: selectedTime,
						},
						token
					);

					alert(
						"Booking rescheduled successfully! 🎉"
					);
				}

				// -------------------------------------------------
				// CREATE
				// -------------------------------------------------

				else {
					await createBooking(
						{
							organizationId,
							customerName:
								customerName.trim(),
							customerPhone:
								customerPhone.trim(),
							doctorName,
							service,
							date: bookingDate,
							time: selectedTime,
							status: "CONFIRMED",
						},
						token
					);

					alert(
						"Booking created successfully! 🎉"
					);
				}

				closeBookingModal();

				await loadBookings();

				/*
				 * If the user created/rescheduled
				 * something on the currently
				 * selected day, refresh slots.
				 */
				await loadAvailableSlots(
					selectedDate
				);
			} catch (err: any) {
				console.error(
					"Save Booking Error:",
					err
				);

				alert(
					err.message ||
						"Failed to save booking"
				);
			} finally {
				setBookingLoading(false);
			}
		};

	// =====================================================
	// CANCEL BOOKING
	// =====================================================

	const handleCancelBooking =
		async (
			booking: Booking
		) => {
			if (!booking.id) {
				return;
			}

			const confirmed =
				window.confirm(
					`Cancel appointment for ${booking.customerName} on ${formatDisplayDate(
						booking.date
					)} at ${formatTime(
						booking.time
					)}?`
				);

			if (!confirmed) {
				return;
			}

			try {
				if (!token) {
					throw new Error(
						"Authentication token missing"
					);
				}

				await cancelBooking(
					booking.id,
					token
				);

				alert(
					"Booking cancelled successfully."
				);

				setShowDetailsModal(
					false
				);

				setSelectedBooking(null);

				await loadBookings();

				await loadAvailableSlots(
					selectedDate
				);
			} catch (err: any) {
				console.error(
					"Cancel Booking Error:",
					err
				);

				alert(
					err.message ||
						"Failed to cancel booking"
				);
			}
		};

	// =====================================================
	// REMINDER
	// =====================================================

	const handleReminder = async (
		booking: Booking
	) => {
		try {
			if (!token) {
				throw new Error(
					"Authentication token missing"
				);
			}

			await sendBookingReminder(
				booking,
				token
			);

			alert(
				`Reminder sent to ${booking.customerName}.`
			);
		} catch (err: any) {
			console.error(
				"Reminder Error:",
				err
			);

			alert(
				err.message ||
					"Failed to send reminder"
			);
		}
	};

	// =====================================================
	// SELECT DATE
	// =====================================================

	const selectDate = (
		date: string
	) => {
		setSelectedDate(date);

		const dateObj =
			parseLocalDate(date);

		setCalendarDate(
			new Date(
				dateObj.getFullYear(),
				dateObj.getMonth(),
				1
			)
		);

		if (
			viewMode !== "DAY"
		) {
			setViewMode("DAY");
		}
	};

	// =====================================================
	// NAVIGATION
	// =====================================================

	const goToday = () => {
		setSelectedDate(
			todayString
		);

		setCalendarDate(
			new Date()
		);

		setViewMode("DAY");
	};

	const goPrevious = () => {
		if (viewMode === "DAY") {
			const date =
				parseLocalDate(
					selectedDate
				);

			date.setDate(
				date.getDate() - 1
			);

			const newDate =
				getLocalDateString(
					date
				);

			setSelectedDate(
				newDate
			);

			setCalendarDate(
				new Date(
					date.getFullYear(),
					date.getMonth(),
					1
				)
			);

			return;
		}

		if (
			viewMode === "WEEK"
		) {
			const date =
				parseLocalDate(
					selectedDate
				);

			date.setDate(
				date.getDate() - 7
			);

			setSelectedDate(
				getLocalDateString(
					date
				)
			);

			setCalendarDate(
				new Date(
					date.getFullYear(),
					date.getMonth(),
					1
				)
			);

			return;
		}

		const nextMonth =
			new Date(
				calendarDate
			);

		nextMonth.setMonth(
			nextMonth.getMonth() - 1
		);

		setCalendarDate(
			nextMonth
		);
	};

	const goNext = () => {
		if (viewMode === "DAY") {
			const date =
				parseLocalDate(
					selectedDate
				);

			date.setDate(
				date.getDate() + 1
			);

			const newDate =
				getLocalDateString(
					date
				);

			setSelectedDate(
				newDate
			);

			setCalendarDate(
				new Date(
					date.getFullYear(),
					date.getMonth(),
					1
				)
			);

			return;
		}

		if (
			viewMode === "WEEK"
		) {
			const date =
				parseLocalDate(
					selectedDate
				);

			date.setDate(
				date.getDate() + 7
			);

			setSelectedDate(
				getLocalDateString(
					date
				)
			);

			setCalendarDate(
				new Date(
					date.getFullYear(),
					date.getMonth(),
					1
				)
			);

			return;
		}

		const nextMonth =
			new Date(
				calendarDate
			);

		nextMonth.setMonth(
			nextMonth.getMonth() + 1
		);

		setCalendarDate(
			nextMonth
		);
	};

	// =====================================================
	// DERIVED DATA
	// =====================================================

	const activeBookings =
		useMemo(
			() =>
				bookings.filter(
					(b) =>
						b.status !==
						"CANCELLED"
				),
			[bookings]
		);

	const selectedDayBookings =
		useMemo(
			() =>
				bookings
					.filter(
						(b) =>
							b.date ===
							selectedDate
					)
					.sort(
						(a, b) =>
							timeToMinutes(
								a.time
							) -
							timeToMinutes(
								b.time
							)
					),
			[
				bookings,
				selectedDate,
			]
		);

	const selectedDayActiveBookings =
		selectedDayBookings.filter(
			(b) =>
				b.status !==
				"CANCELLED"
		);

	const pendingCount =
		selectedDayActiveBookings.filter(
			(b) =>
				b.status ===
				"PENDING"
		).length;

	// =====================================================
	// WEEK DATA
	// =====================================================

	const weekStart =
		getStartOfWeek(
			parseLocalDate(
				selectedDate
			)
		);

	const weekDates =
		Array.from(
			{ length: 7 },
			(_, index) => {
				const date =
					new Date(
						weekStart
					);

				date.setDate(
					weekStart.getDate() +
						index
				);

				return date;
			}
		);

	const weekBookings =
		activeBookings.filter(
			(booking) => {
				return weekDates.some(
					(date) =>
						getLocalDateString(
							date
						) ===
						booking.date
				);
			}
		);

	// =====================================================
	// MONTH DATA
	// =====================================================

	const monthBookings =
		activeBookings.filter(
			(booking) => {
				const date =
					parseLocalDate(
						booking.date
					);

				return (
					date.getFullYear() ===
						calendarDate.getFullYear() &&
					date.getMonth() ===
						calendarDate.getMonth()
				);
			}
		);

	// =====================================================
	// MONTH CALENDAR
	// =====================================================

	const monthCalendarDays =
		useMemo(() => {
			const year =
				calendarDate.getFullYear();

			const month =
				calendarDate.getMonth();

			const firstDay =
				new Date(
					year,
					month,
					1
				);

			const firstMondayOffset =
				firstDay.getDay() ===
				0
					? 6
					: firstDay.getDay() -
						1;

			const daysInMonth =
				new Date(
					year,
					month + 1,
					0
				).getDate();

			const previousMonthDays =
				new Date(
					year,
					month,
					0
				).getDate();

			const totalCells =
				Math.ceil(
					(
						firstMondayOffset +
						daysInMonth
					) / 7
				) * 7;

			return Array.from(
				{
					length: totalCells,
				},
				(_, index) => {
					let dayNumber =
						index -
						firstMondayOffset +
						1;

					let dateMonth =
						month;

					let dateYear =
						year;

					let isCurrentMonth =
						true;

					if (
						dayNumber <= 0
					) {
						dayNumber =
							previousMonthDays +
							dayNumber;

						dateMonth =
							month - 1;

						if (
							dateMonth <
							0
						) {
							dateMonth =
								11;

							dateYear =
								year - 1;
						}

						isCurrentMonth =
							false;
					} else if (
						dayNumber >
						daysInMonth
					) {
						dayNumber =
							dayNumber -
							daysInMonth;

						dateMonth =
							month + 1;

						if (
							dateMonth >
							11
						) {
							dateMonth =
								0;

							dateYear =
								year + 1;
						}

						isCurrentMonth =
							false;
					}

					const date =
						new Date(
							dateYear,
							dateMonth,
							dayNumber
						);

					const dateString =
						getLocalDateString(
							date
						);

					const dayBookings =
						activeBookings.filter(
							(b) =>
								b.date ===
								dateString
						);

					return {
						date,
						dateString,
						dayNumber,
						isCurrentMonth,
						bookings:
							dayBookings,
					};
				}
			);
		}, [
			calendarDate,
			activeBookings,
		]);

	// =====================================================
	// SLOT DATA
	// =====================================================

	const slots: Slot[] =
		SLOT_TIMES.map(
			(time) => {
				const booking =
					selectedDayBookings.find(
						(b) =>
							b.time ===
							time &&
							b.status !==
								"CANCELLED"
					);

				if (booking) {
					return {
						time,
						name:
							booking.customerName,
						type:
							booking.service,
						status:
							booking.status ===
							"CONFIRMED"
								? "Confirmed"
								: "Pending",
						booking,
					};
				}

				if (
					availableSlots.includes(
						time
					)
				) {
					return {
						time,
						name: "—",
						type: "—",
						status:
							"Available",
					};
				}

				/*
				 * Slot could be unavailable
				 * because of another state.
				 */
				return {
					time,
					name: "—",
					type: "—",
					status:
						"Available",
				};
			}
		);

	// =====================================================
	// ANALYTICS
	// =====================================================

	const totalBookings =
		bookings.length;

	const confirmedBookings =
		bookings.filter(
			(b) =>
				b.status ===
				"CONFIRMED"
		).length;

	const pendingBookings =
		bookings.filter(
			(b) =>
				b.status ===
				"PENDING"
		).length;

	const cancelledBookings =
		bookings.filter(
			(b) =>
				b.status ===
				"CANCELLED"
		).length;

	const totalPossibleSlots =
		SLOT_TIMES.length;

	const selectedDayUtilization =
		totalPossibleSlots === 0
			? 0
			: Math.round(
					(selectedDayActiveBookings.length /
						totalPossibleSlots) *
						100
				);

	const serviceStats =
		useMemo(() => {
			const map =
				new Map<
					string,
					number
				>();

			activeBookings.forEach(
				(booking) => {
					map.set(
						booking.service,
						(map.get(
							booking.service
						) || 0) + 1
					);
				}
			);

			return Array.from(
				map.entries()
			)
				.map(
					([
						name,
						count,
					]) => ({
						name,
						count,
					})
				)
				.sort(
					(a, b) =>
						b.count -
						a.count
				);
		}, [activeBookings]);

	const maxServiceCount =
		Math.max(
			1,
			...serviceStats.map(
				(s) => s.count
			)
		);

	// =====================================================
	// STATUS COLORS
	// =====================================================

	const statusColors = {
		Confirmed: T.jade,
		Pending: T.amber,
		Cancelled: T.red,
		Available: T.muted,
	};

	// =====================================================
	// LOADING
	// =====================================================

	if (loading) {
		return (
			<div
				style={{
					padding:
						"clamp(16px, 4vw, 28px)",
					color: T.muted,
				}}
			>
				Loading bookings...
			</div>
		);
	}

	// =====================================================
	// RENDER
	// =====================================================

	return (
		<div
			style={{
				padding:
					"clamp(14px, 3vw, 28px)",
				flex: 1,
				overflowY: "auto",
				minWidth: 0,
			}}
		>
			{/* =================================================
			    HEADER
			================================================= */}

			<div
				style={{
					display: "flex",
					justifyContent:
						"space-between",
					alignItems: "center",
					gap: 16,
					marginBottom: 20,
					flexWrap: "wrap",
				}}
			>
				<div>
					<div
						style={{
							fontFamily:
								"'Barlow Condensed', sans-serif",
							fontSize:
								"clamp(24px, 3vw, 30px)",
							fontWeight: 800,
							color: T.white,
						}}
					>
						Bookings
					</div>

					<div
						style={{
							fontSize: 13,
							color: T.muted,
							marginTop: 3,
						}}
					>
						Manage appointments,
						availability and
						schedule
					</div>
				</div>

				<Btn
					size="sm"
					onClick={() =>
						openBookingModal(
							"",
							selectedDate
						)
					}
				>
					<Icon
						name="plus"
						size={14}
						color={T.forest}
					/>
					Add booking
				</Btn>
			</div>

			{/* =================================================
			    ERROR
			================================================= */}

			{error && (
				<div
					style={{
						marginBottom: 20,
						padding: 12,
						borderRadius: 10,
						background:
							`${T.red}15`,
						border:
							`1px solid ${T.red}30`,
						color: T.red,
						fontSize: 13,
					}}
				>
					{error}
				</div>
			)}

			{/* =================================================
			    TOP STATS
			================================================= */}

			<div
				className="responsive-grid-4"
				style={{
					gap: 14,
					marginBottom: 20,
				}}
			>
				<Stat
					label="Selected Day"
					value={String(
						selectedDayActiveBookings.length
					)}
					icon="calendar"
				/>

				<Stat
					label="Available Slots"
					value={
						loadingSlots
							? "..."
							: String(
									availableSlots.length
								)
					}
					icon="check"
					color={T.blue}
				/>

				<Stat
					label="Pending"
					value={String(
						pendingCount
					)}
					icon="bell"
					color={T.amber}
				/>

				<Stat
					label="Utilization"
					value={`${selectedDayUtilization}%`}
					icon="trending"
					color={T.purple}
				/>
			</div>

			{/* =================================================
			    VIEW CONTROLS
			================================================= */}

			<Card
				style={{
					padding:
						"12px 14px",
					marginBottom: 20,
				}}
			>
				<div
					className="booking-toolbar"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent:
							"space-between",
						gap: 12,
						flexWrap: "wrap",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems:
								"center",
							gap: 6,
						}}
					>
						<Btn
							variant="ghost"
							size="sm"
							onClick={
								goPrevious
							}
						>
							‹
						</Btn>

						<Btn
							variant="ghost"
							size="sm"
							onClick={
								goToday
							}
						>
							Today
						</Btn>

						<Btn
							variant="ghost"
							size="sm"
							onClick={
								goNext
							}
						>
							›
						</Btn>
					</div>

					<div
						style={{
							fontWeight: 700,
							color: T.cream,
							fontSize: 14,
							textAlign:
								"center",
						}}
					>
						{viewMode ===
							"MONTH"
							? calendarDate.toLocaleDateString(
									"en-IN",
									{
										month: "long",
										year: "numeric",
									}
								)
							: formatDisplayDate(
									selectedDate
								)}
					</div>

					<div
						style={{
							display: "flex",
							gap: 6,
						}}
					>
						{(
							[
								"DAY",
								"WEEK",
								"MONTH",
							] as ViewMode[]
						).map(
							(mode) => (
								<Btn
									key={
										mode
									}
									variant={
										viewMode ===
										mode
											? "primary"
											: "outline"
									}
									size="sm"
									onClick={() =>
										setViewMode(
											mode
										)
									}
								>
									{mode ===
									"DAY"
										? "Day"
										: mode ===
											  "WEEK"
											? "Week"
											: "Month"}
								</Btn>
							)
						)}
					</div>
				</div>
			</Card>

			{/* =================================================
			    DAY VIEW
			================================================= */}

			{viewMode === "DAY" && (
				<div
					style={{
						display: "grid",
						gridTemplateColumns:
							"minmax(0, 1fr) 300px",
						gap: 20,
						alignItems:
							"start",
					}}
					className="booking-main-grid"
				>
					<Card
						style={{
							padding: 0,
							overflow:
								"hidden",
						}}
					>
						<div
							style={{
								padding:
									"16px 20px",
								borderBottom:
									`1px solid ${T.border}`,
								display:
									"flex",
								justifyContent:
									"space-between",
								alignItems:
									"center",
								gap: 10,
								flexWrap:
									"wrap",
							}}
						>
							<div>
								<div
									style={{
										fontWeight:
											800,
										color: T.white,
									}}
								>
									{
										formatLongDate(
											selectedDate
										)
									}
								</div>

								<div
									style={{
										fontSize: 12,
										color: T.muted,
										marginTop: 3,
									}}
								>
									{
										selectedDayActiveBookings.length
									}{" "}
									appointments
								</div>
							</div>

							<input
								type="date"
								value={
									selectedDate
								}
								onChange={(
									e
								) =>
									selectDate(
										e
											.target
											.value
									)
								}
								style={{
									...dateInputStyle,
									width: 160,
								}}
							/>
						</div>

						{slots.map(
							(slot, index) => {
								const isAvailable =
									slot.status ===
									"Available";

								return (
									<div
										key={
											slot.time
										}
										style={{
											padding:
												"13px 20px",
											borderBottom:
												index <
												slots.length -
													1
													? `1px solid ${T.border}`
													: "none",
											display:
												"flex",
											alignItems:
												"center",
											gap: 14,
											flexWrap:
												"wrap",
										}}
									>
										{/* TIME */}
										<button
											onClick={() => {
												if (
													isAvailable
												) {
													openBookingModal(
														slot.time,
														selectedDate
													);
												} else if (
													slot.booking
												) {
													setSelectedBooking(
														slot.booking
													);

													setShowDetailsModal(
														true
													);
												}
											}}
											style={{
												width: 75,
												flexShrink: 0,
												background:
													"transparent",
												border: "none",
												padding: 0,
												textAlign:
													"left",
												cursor:
													"pointer",
												color: T.cream,
												fontWeight: 700,
												fontSize: 13,
											}}
										>
											{formatTime(
												slot.time
											)}
										</button>

										{/* CUSTOMER */}
										<div
											style={{
												flex: 1,
												minWidth: 150,
											}}
										>
											{slot.booking ? (
												<div
													style={{
														display:
															"flex",
														alignItems:
															"center",
														gap: 10,
													}}
												>
													<Avatar
														name={
															slot.booking
																.customerName
														}
														size={
															32
														}
													/>

													<div>
														<div
															style={{
																color: T.cream,
																fontSize: 13,
																fontWeight: 700,
															}}
														>
															{
																slot.booking
																	.customerName
															}
														</div>

														<div
															style={{
																color: T.muted,
																fontSize: 11,
																marginTop: 2,
															}}
														>
															{
																slot.booking
																	.service
															}
														</div>
													</div>
												</div>
											) : (
												<div>
													<div
														style={{
															color: T.muted,
															fontSize: 13,
														}}
													>
														Open slot
													</div>

													<div
														style={{
															color: T.muted,
															fontSize: 11,
															marginTop: 2,
														}}
													>
														Click time to book
													</div>
												</div>
											)}
										</div>

										{/* DOCTOR */}
										<div
											className="booking-doctor"
											style={{
												width: 150,
												color: T.muted,
												fontSize: 11,
											}}
										>
											{slot.booking
												?.doctorName ||
												"Dr. Ananya Sharma"}
										</div>

										{/* STATUS */}
										<Badge
											color={
												statusColors[
													slot.status
												]
											}
											bg={
												statusColors[
													slot.status
												] +
												"22"
											}
										>
											{
												slot.status
											}
										</Badge>

										{/* ACTIONS */}
										<div
											style={{
												display:
													"flex",
												gap: 5,
												flexWrap:
													"wrap",
											}}
										>
											{slot.booking && (
												<>
													<Btn
														variant="ghost"
														size="sm"
														onClick={() => {
															setSelectedBooking(
																slot.booking!
															);

															setShowDetailsModal(
																true
															);
														}}
													>
														View
													</Btn>

													<Btn
														variant="ghost"
														size="sm"
														onClick={() =>
															openRescheduleModal(
																slot.booking!
															)
														}
													>
														Reschedule
													</Btn>

													<Btn
														variant="ghost"
														size="sm"
														onClick={() =>
															handleCancelBooking(
																slot.booking!
															)
														}
														style={{
															color: T.red,
														}}
													>
														Cancel
													</Btn>

													{slot.booking
														.status ===
														"CONFIRMED" && (
														<Btn
															variant="ghost"
															size="sm"
															onClick={() =>
																handleReminder(
																	slot.booking!
																)
															}
														>
															Remind
														</Btn>
													)}
												</>
											)}

											{isAvailable && (
												<Btn
													size="sm"
													onClick={() =>
														openBookingModal(
															slot.time,
															selectedDate
														)
													}
												>
													Book
												</Btn>
											)}
										</div>
									</div>
								);
							}
						)}
					</Card>

					{/* DAY SUMMARY */}
					<Card
						style={{
							padding: 20,
						}}
					>
						<div
							style={{
								fontWeight: 800,
								color: T.white,
								marginBottom: 16,
							}}
						>
							Day Summary
						</div>

						<SummaryRow
							label="Total appointments"
							value={
								selectedDayActiveBookings.length
							}
						/>

						<SummaryRow
							label="Confirmed"
							value={
								selectedDayActiveBookings.filter(
									(b) =>
										b.status ===
										"CONFIRMED"
								).length
							}
						/>

						<SummaryRow
							label="Pending"
							value={
								selectedDayActiveBookings.filter(
									(b) =>
										b.status ===
										"PENDING"
								).length
							}
						/>

						<SummaryRow
							label="Available"
							value={
								availableSlots.length
							}
						/>

						<div
							style={{
								marginTop: 20,
								paddingTop: 18,
								borderTop:
									`1px solid ${T.border}`,
							}}
						>
							<div
								style={{
									fontSize: 12,
									color: T.muted,
									marginBottom: 8,
								}}
							>
								Slot utilization
							</div>

							<div
								style={{
									height: 8,
									background:
										T.deep,
									borderRadius: 99,
									overflow:
										"hidden",
								}}
							>
								<div
									style={{
										width: `${selectedDayUtilization}%`,
										height:
											"100%",
										background:
											T.jade,
										borderRadius: 99,
										transition:
											"width .3s ease",
									}}
								/>
							</div>

							<div
								style={{
									fontSize: 12,
									color: T.jade,
									marginTop: 8,
								}}
							>
								{
									selectedDayUtilization
								}
								% occupied
							</div>
						</div>
					</Card>
				</div>
			)}

			{/* =================================================
			    WEEK VIEW
			================================================= */}

			{viewMode === "WEEK" && (
				<Card
					style={{
						padding: 14,
					}}
				>
					<div
						style={{
							display:
								"grid",
							gridTemplateColumns:
								"repeat(7, minmax(0, 1fr))",
							gap: 8,
						}}
						className="booking-week-grid"
					>
						{weekDates.map(
							(date) => {
								const dateString =
									getLocalDateString(
										date
									);

								const dayBookings =
									activeBookings.filter(
										(b) =>
											b.date ===
											dateString
									);

								const isSelected =
									dateString ===
									selectedDate;

								const isToday =
									dateString ===
									todayString;

								return (
									<button
										key={
											dateString
										}
										onClick={() =>
											selectDate(
												dateString
											)
										}
										style={{
											minHeight: 190,
											padding: 12,
											background:
												isSelected
													? T.jadeDim
													: T.deep,
											border:
												`1px solid ${
													isSelected
														? T.jade
														: T.border
												}`,
											borderRadius: 12,
											cursor:
												"pointer",
											textAlign:
												"left",
											color: T.cream,
										}}
									>
										<div
											style={{
												fontSize: 11,
												color: T.muted,
												textTransform:
													"uppercase",
											}}
										>
											{date.toLocaleDateString(
												"en-IN",
												{
													weekday:
														"short",
												}
											)}
										</div>

										<div
											style={{
												display:
													"flex",
												alignItems:
													"center",
												justifyContent:
													"space-between",
												marginTop: 5,
											}}
										>
											<div
												style={{
													fontSize: 22,
													fontWeight:
														800,
												}}
											>
												{date.getDate()}
											</div>

											{isToday && (
												<span
													style={{
														fontSize: 9,
														color: T.jade,
														fontWeight: 800,
													}}
												>
													TODAY
												</span>
											)}
										</div>

										<div
											style={{
												marginTop: 14,
												fontSize: 12,
												color: T.muted,
											}}
										>
											{
												dayBookings.length
											}{" "}
											bookings
										</div>

										<div
											style={{
												marginTop: 8,
												display:
													"flex",
												flexDirection:
													"column",
												gap: 5,
											}}
										>
											{dayBookings
												.slice(
													0,
													3
												)
												.map(
													(
														booking
													) => (
														<div
															key={
																booking.id
															}
															style={{
																fontSize: 10,
																padding:
																	"5px 6px",
																borderRadius: 6,
																background:
																	T.card,
																overflow:
																	"hidden",
																textOverflow:
																	"ellipsis",
																whiteSpace:
																	"nowrap",
															}}
														>
															{formatTime(
																booking.time
															)}{" "}
															·{" "}
															{
																booking.customerName
															}
														</div>
													)
												)}

											{dayBookings.length >
												3 && (
												<div
													style={{
														fontSize: 10,
														color: T.jade,
													}}
												>
													+
													{dayBookings.length -
														3}{" "}
													more
												</div>
											)}
										</div>
									</button>
								);
							}
						)}
					</div>

					<div
						style={{
							marginTop: 18,
							paddingTop: 16,
							borderTop:
								`1px solid ${T.border}`,
							display:
								"flex",
							justifyContent:
								"space-between",
							flexWrap:
								"wrap",
							gap: 10,
						}}
					>
						<div
							style={{
								color: T.muted,
								fontSize: 13,
							}}
						>
							Week total
						</div>

						<div
							style={{
								color: T.cream,
								fontWeight: 800,
							}}
						>
							{
								weekBookings.length
							}{" "}
							appointments
						</div>
					</div>
				</Card>
			)}

			{/* =================================================
			    MONTH VIEW
			================================================= */}

			{viewMode === "MONTH" && (
				<Card
					style={{
						padding: 12,
						overflow:
							"hidden",
					}}
				>
					<div
						style={{
							display:
								"grid",
							gridTemplateColumns:
								"repeat(7, minmax(0, 1fr))",
							borderTop:
								`1px solid ${T.border}`,
							borderLeft:
								`1px solid ${T.border}`,
						}}
						className="booking-month-grid"
					>
						{[
							"Mon",
							"Tue",
							"Wed",
							"Thu",
							"Fri",
							"Sat",
							"Sun",
						].map(
							(day) => (
								<div
									key={
										day
									}
									style={{
										padding:
											"10px 8px",
										color: T.muted,
										fontSize: 11,
										fontWeight:
											800,
										textAlign:
											"center",
										borderRight:
											`1px solid ${T.border}`,
										borderBottom:
											`1px solid ${T.border}`,
									}}
								>
									{day}
								</div>
							)
						)}

						{monthCalendarDays.map(
							(day) => {
								const isSelected =
									day.dateString ===
									selectedDate;

								const isToday =
									day.dateString ===
									todayString;

								return (
									<button
										key={
											day.dateString
										}
										onClick={() =>
											selectDate(
												day.dateString
											)
										}
										style={{
											minHeight:
												"clamp(80px, 10vw, 125px)",
											padding: 8,
											background:
												isSelected
													? T.jadeDim
													: T.deep,
											color:
												day.isCurrentMonth
													? T.cream
													: T.muted,
											border: "none",
											borderRight:
												`1px solid ${T.border}`,
											borderBottom:
												`1px solid ${T.border}`,
											cursor:
												"pointer",
											textAlign:
												"left",
										}}
									>
										<div
											style={{
												display:
													"flex",
												alignItems:
													"center",
												justifyContent:
													"space-between",
											}}
										>
											<span
												style={{
													width: 24,
													height: 24,
													borderRadius:
														"50%",
													display:
														"flex",
													alignItems:
														"center",
													justifyContent:
														"center",
													background:
														isToday
															? T.jade
															: "transparent",
													color:
														isToday
															? T.forest
															: "inherit",
													fontWeight:
														isToday
															? 800
															: 500,
													fontSize: 11,
												}}
											>
												{
													day.dayNumber
												}
											</span>

											{day.bookings.length >
												0 && (
												<span
													style={{
														fontSize: 9,
														color: T.jade,
														fontWeight: 800,
													}}
												>
													{
														day.bookings.length
													}
												</span>
											)}
										</div>

										<div
											style={{
												marginTop: 8,
												display:
													"flex",
												flexDirection:
													"column",
												gap: 3,
											}}
										>
											{day.bookings
												.slice(
													0,
													2
												)
												.map(
													(
														booking
													) => (
														<div
															key={
																booking.id
															}
															style={{
																fontSize: 9,
																padding:
																	"4px",
																background:
																	T.card,
																borderRadius:
																	4,
																overflow:
																	"hidden",
																textOverflow:
																	"ellipsis",
																whiteSpace:
																	"nowrap",
															}}
														>
															{
																booking.customerName
															}
														</div>
													)
												)}

											{day.bookings.length >
												2 && (
												<div
													style={{
														fontSize: 9,
														color: T.jade,
													}}
												>
													+
													{day.bookings.length -
														2}{" "}
													more
												</div>
											)}
										</div>
									</button>
								);
							}
						)}
					</div>
				</Card>
			)}

			{/* =================================================
			    ANALYTICS
			================================================= */}

			<div
				style={{
					marginTop: 24,
					marginBottom: 10,
					fontFamily:
						"'Barlow Condensed', sans-serif",
					fontSize: 22,
					fontWeight: 800,
					color: T.white,
				}}
			>
				Booking Analytics
			</div>

			<div
				className="responsive-grid-4"
				style={{
					gap: 14,
					marginBottom: 16,
				}}
			>
				<Stat
					label="All Bookings"
					value={String(
						totalBookings
					)}
					icon="calendar"
				/>

				<Stat
					label="Confirmed"
					value={String(
						confirmedBookings
					)}
					icon="check"
					color={T.jade}
				/>

				<Stat
					label="Pending"
					value={String(
						pendingBookings
					)}
					icon="bell"
					color={T.amber}
				/>

				<Stat
					label="Cancelled"
					value={String(
						cancelledBookings
					)}
					icon="x"
					color={T.red}
				/>
			</div>

			<div
				className="booking-analytics-grid"
				style={{
					display: "grid",
					gridTemplateColumns:
						"1fr 1fr",
					gap: 16,
				}}
			>
				{/* SERVICE BREAKDOWN */}
				<Card>
					<div
						style={{
							fontWeight: 800,
							color: T.white,
							marginBottom: 18,
						}}
					>
						Service Breakdown
					</div>

					{serviceStats.length ===
					0 ? (
						<div
							style={{
								color: T.muted,
								fontSize: 13,
							}}
						>
							No booking
							data yet.
						</div>
					) : (
						serviceStats.map(
							(
								item
							) => (
								<div
									key={
										item.name
									}
									style={{
										marginBottom: 14,
									}}
								>
									<div
										style={{
											display:
												"flex",
											justifyContent:
												"space-between",
											gap: 10,
											fontSize: 12,
											marginBottom: 6,
										}}
									>
										<span
											style={{
												color: T.cream,
											}}
										>
											{
												item.name
											}
										</span>

										<span
											style={{
												color: T.muted,
											}}
										>
											{
												item.count
											}
										</span>
									</div>

									<div
										style={{
											height: 7,
											background:
												T.deep,
											borderRadius:
												99,
											overflow:
												"hidden",
										}}
									>
										<div
											style={{
												width: `${(item.count / maxServiceCount) * 100}%`,
												height:
													"100%",
												background:
													T.jade,
												borderRadius:
													99,
											}}
										/>
									</div>
								</div>
							)
						)
					)}
				</Card>

				{/* PERIOD SUMMARY */}
				<Card>
					<div
						style={{
							fontWeight: 800,
							color: T.white,
							marginBottom: 18,
						}}
					>
						Period Summary
					</div>

					<SummaryRow
						label="Selected day"
						value={`${selectedDayActiveBookings.length} bookings`}
					/>

					<SummaryRow
						label="Selected week"
						value={`${weekBookings.length} bookings`}
					/>

					<SummaryRow
						label="Selected month"
						value={`${monthBookings.length} bookings`}
					/>

					<SummaryRow
						label="Cancelled"
						value={`${cancelledBookings}`}
					/>

					<div
						style={{
							marginTop: 14,
							paddingTop: 14,
							borderTop:
								`1px solid ${T.border}`,
							color: T.muted,
							fontSize: 11,
							lineHeight: 1.6,
						}}
					>
						Analytics are
						calculated from your
						real booking data.
						Cancelled bookings
						remain in history but
						are excluded from active
						utilization.
					</div>
				</Card>
			</div>

			{/* =================================================
			    BOOKING MODAL
			================================================= */}

			{showBookingModal && (
				<div
					style={modalOverlayStyle}
					onMouseDown={(e) => {
						if (
							e.target ===
							e.currentTarget
						) {
							closeBookingModal();
						}
					}}
				>
					<div
						style={{
							...modalStyle,
							maxWidth: 520,
						}}
					>
						<div
							style={modalHeaderStyle}
						>
							<div>
								<div
									style={{
										fontSize: 20,
										fontWeight: 800,
										color: T.white,
									}}
								>
									{editingBooking
										? "Reschedule Booking"
										: "New Booking"}
								</div>

								<div
									style={{
										fontSize: 12,
										color: T.muted,
										marginTop: 4,
									}}
								>
									{editingBooking
										? "Change the appointment date or time"
										: "Create a new dental appointment"}
								</div>
							</div>

							<button
								onClick={
									closeBookingModal
								}
								style={
									closeButtonStyle
								}
							>
								×
							</button>
						</div>

						<div
							className="booking-form-grid"
							style={{
								display:
									"grid",
								gridTemplateColumns:
									"1fr 1fr",
								gap: 14,
							}}
						>
							<FormField
								label="Customer Name"
								fullWidth
							>
								<input
									value={
										customerName
									}
									onChange={(
										e
									) =>
										setCustomerName(
											e
												.target
												.value
										)
									}
									placeholder="Enter customer name"
									style={
										inputStyle
									}
								/>
							</FormField>

							<FormField label="Phone Number">
								<input
									value={
										customerPhone
									}
									onChange={(
										e
									) =>
										setCustomerPhone(
											e
												.target
												.value
										)
									}
									placeholder="919XXXXXXXXX"
									style={
										inputStyle
									}
								/>
							</FormField>

							<FormField label="Doctor">
								<select
									value={
										doctorName
									}
									onChange={(
										e
									) =>
										setDoctorName(
											e
												.target
												.value
										)
									}
									style={
										inputStyle
									}
								>
									<option>
										Dr. Ananya Sharma
									</option>
								</select>
							</FormField>

							<FormField label="Service">
								<select
									value={
										service
									}
									onChange={(
										e
									) =>
										setService(
											e
												.target
												.value
										)
									}
									style={
										inputStyle
									}
								>
									<option>
										Dental Consultation
									</option>

									<option>
										Specialist Consultation
									</option>

									<option>
										Dental Cleaning
									</option>

									<option>
										Follow-up Consultation
									</option>
								</select>
							</FormField>

							<FormField label="Date">
								<input
									type="date"
									value={
										bookingDate
									}
									min={
										todayString
									}
									onChange={(
										e
									) =>
										setBookingDate(
											e
												.target
												.value
										)
									}
									style={
										inputStyle
									}
								/>
							</FormField>

							<FormField label="Time">
								{loadingModalSlots ? (
									<div
										style={{
											...inputStyle,
											color: T.muted,
										}}
									>
										Checking
										slots...
									</div>
								) : (
									<select
										value={
											selectedTime
										}
										onChange={(
											e
										) =>
											setSelectedTime(
												e
													.target
													.value
											)
										}
										style={
											inputStyle
										}
									>
										<option value="">
											Select time
										</option>

										{modalAvailableSlots.map(
											(
												time
											) => (
												<option
													key={
														time
													}
													value={
														time
													}
												>
													{formatTime(
														time
													)}
												</option>
											)
										)}
									</select>
								)}
							</FormField>
						</div>

						<div
							style={{
								marginTop: 20,
								padding: 12,
								borderRadius: 10,
								background:
									T.deep,
								border:
									`1px solid ${T.border}`,
								fontSize: 12,
								color: T.muted,
							}}
						>
							{selectedTime ? (
								<>
									Appointment:
									{" "}
									<strong
										style={{
											color: T.cream,
										}}
									>
										{formatDisplayDate(
											bookingDate
										)}
										{" "}
										at{" "}
										{formatTime(
											selectedTime
										)}
									</strong>
								</>
							) : (
								"Select a date and available time slot."
							)}
						</div>

						<div
							style={{
								display:
									"flex",
								justifyContent:
									"flex-end",
								gap: 10,
								marginTop: 22,
								flexWrap:
									"wrap",
							}}
						>
							<Btn
								variant="outline"
								onClick={
									closeBookingModal
								}
								disabled={
									bookingLoading
								}
							>
								Cancel
							</Btn>

							<Btn
								onClick={
									handleSaveBooking
								}
								disabled={
									bookingLoading ||
									loadingModalSlots
								}
							>
								{bookingLoading
									? editingBooking
										? "Rescheduling..."
										: "Creating..."
									: editingBooking
										? "Save Changes"
										: "Create Booking"}
							</Btn>
						</div>
					</div>
				</div>
			)}

			{/* =================================================
			    DETAILS MODAL
			================================================= */}

			{showDetailsModal &&
				selectedBooking && (
					<div
						style={
							modalOverlayStyle
						}
						onMouseDown={(
							e
						) => {
							if (
								e.target ===
								e.currentTarget
							) {
								setShowDetailsModal(
									false
								);
							}
						}}
					>
						<div
							style={
								modalStyle
							}
						>
							<div
								style={
									modalHeaderStyle
								}
							>
								<div>
									<div
										style={{
											fontSize: 20,
											fontWeight: 800,
											color: T.white,
										}}
									>
										Booking Details
									</div>

									<div
										style={{
											fontSize: 12,
											color: T.muted,
											marginTop: 4,
										}}
									>
										Complete appointment
										information
									</div>
								</div>

								<button
									onClick={() =>
										setShowDetailsModal(
											false
										)
									}
									style={
										closeButtonStyle
									}
								>
									×
								</button>
							</div>

							<div
								style={{
									display:
										"flex",
									alignItems:
										"center",
									gap: 14,
									paddingBottom:
										18,
									borderBottom:
										`1px solid ${T.border}`,
								}}
							>
								<Avatar
									name={
										selectedBooking.customerName
									}
									size={
										50
									}
								/>

								<div>
									<div
										style={{
											color: T.white,
											fontSize: 17,
											fontWeight: 800,
										}}
									>
										{
											selectedBooking.customerName
										}
									</div>

									<div
										style={{
											color: T.muted,
											fontSize: 12,
											marginTop: 3,
										}}
									>
										{
											selectedBooking.customerPhone
										}
									</div>
								</div>

								<div
									style={{
										marginLeft:
											"auto",
									}}
								>
									<Badge
										color={
											selectedBooking.status ===
											"CONFIRMED"
												? T.jade
												: selectedBooking.status ===
													  "PENDING"
													? T.amber
													: T.red
										}
										bg={
											(selectedBooking.status ===
											"CONFIRMED"
												? T.jade
												: selectedBooking.status ===
													  "PENDING"
													? T.amber
													: T.red) +
											"22"
										}
									>
										{
											selectedBooking.status
										}
									</Badge>
								</div>
							</div>

							<div
								style={{
									display:
										"grid",
									gridTemplateColumns:
										"1fr 1fr",
									gap: 12,
									marginTop: 18,
								}}
								className="details-grid"
							>
								<DetailItem
									label="Date"
									value={formatLongDate(
										selectedBooking.date
									)}
								/>

								<DetailItem
									label="Time"
									value={formatTime(
										selectedBooking.time
									)}
								/>

								<DetailItem
									label="Doctor"
									value={
										selectedBooking.doctorName
									}
								/>

								<DetailItem
									label="Service"
									value={
										selectedBooking.service
									}
								/>

								<DetailItem
									label="Phone"
									value={
										selectedBooking.customerPhone
									}
								/>

								<DetailItem
									label="Booking ID"
									value={
										selectedBooking.id ||
										"—"
									}
								/>
							</div>

							<div
								style={{
									display:
										"flex",
									gap: 8,
									marginTop: 22,
									flexWrap:
										"wrap",
								}}
							>
								{selectedBooking.status !==
									"CANCELLED" && (
									<>
										<Btn
											onClick={() => {
												setShowDetailsModal(
													false
												);

												openRescheduleModal(
													selectedBooking
												);
											}}
										>
											Reschedule
										</Btn>

										{selectedBooking.status ===
											"CONFIRMED" && (
											<Btn
												variant="outline"
												onClick={() =>
													handleReminder(
														selectedBooking
													)
												}
											>
												Send Reminder
											</Btn>
										)}

										<Btn
											variant="ghost"
											onClick={() =>
												handleCancelBooking(
													selectedBooking
												)
											}
											style={{
												color: T.red,
											}}
										>
											Cancel Booking
										</Btn>
									</>
								)}
							</div>
						</div>
					</div>
				)}
		</div>
	);
}

// =========================================================
// SMALL COMPONENTS
// =========================================================

function SummaryRow({
	label,
	value,
}: {
	label: string;
	value: string | number;
}) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent:
					"space-between",
				gap: 10,
				padding: "10px 0",
				borderBottom:
					`1px solid ${T.border}`,
				fontSize: 12,
			}}
		>
			<span
				style={{
					color: T.muted,
				}}
			>
				{label}
			</span>

			<span
				style={{
					color: T.cream,
					fontWeight: 700,
				}}
			>
				{value}
			</span>
		</div>
	);
}

function FormField({
	label,
	children,
	fullWidth = false,
}: {
	label: string;
	children: React.ReactNode;
	fullWidth?: boolean;
}) {
	return (
		<div
			style={{
				gridColumn: fullWidth
					? "1 / -1"
					: undefined,
			}}
		>
			<label
				style={{
					display: "block",
					fontSize: 12,
					color: T.muted,
					marginBottom: 6,
				}}
			>
				{label}
			</label>

			{children}
		</div>
	);
}

function DetailItem({
	label,
	value,
}: {
	label: string;
	value: string;
}) {
	return (
		<div
			style={{
				padding: 12,
				borderRadius: 9,
				background: T.deep,
				border:
					`1px solid ${T.border}`,
			}}
		>
			<div
				style={{
					fontSize: 10,
					color: T.muted,
					marginBottom: 5,
					textTransform:
						"uppercase",
				}}
			>
				{label}
			</div>

			<div
				style={{
					fontSize: 12,
					color: T.cream,
					fontWeight: 600,
					wordBreak:
						"break-word",
				}}
			>
				{value}
			</div>
		</div>
	);
}

// =========================================================
// DATE HELPERS
// =========================================================

function parseLocalDate(
	dateString: string
) {
	const [
		year,
		month,
		day,
	] = dateString
		.split("-")
		.map(Number);

	return new Date(
		year,
		month - 1,
		day
	);
}

function getLocalDateString(
	date: Date
) {
	const year =
		date.getFullYear();

	const month =
		String(
			date.getMonth() + 1
		).padStart(2, "0");

	const day =
		String(
			date.getDate()
		).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function formatTime(
	time: string
) {
	const [
		hours,
		minutes,
	] = time
		.split(":")
		.map(Number);

	const date = new Date();

	date.setHours(
		hours,
		minutes,
		0,
		0
	);

	return date.toLocaleTimeString(
		"en-IN",
		{
			hour: "numeric",
			minute: "2-digit",
		}
	);
}

function timeToMinutes(
	time: string
) {
	const [
		hours,
		minutes,
	] = time
		.split(":")
		.map(Number);

	return (
		hours * 60 +
		minutes
	);
}

function formatDisplayDate(
	dateString: string
) {
	return parseLocalDate(
		dateString
	).toLocaleDateString(
		"en-IN",
		{
			day: "numeric",
			month: "short",
			year: "numeric",
		}
	);
}

function formatLongDate(
	dateString: string
) {
	return parseLocalDate(
		dateString
	).toLocaleDateString(
		"en-IN",
		{
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric",
		}
	);
}

function getStartOfWeek(
	date: Date
) {
	const result =
		new Date(date);

	const day =
		result.getDay();

	const diff =
		day === 0
			? -6
			: 1 - day;

	result.setDate(
		result.getDate() +
			diff
	);

	return result;
}

// =========================================================
// STYLES
// =========================================================

const inputStyle = {
	width: "100%",
	padding: "11px 12px",
	borderRadius: 8,
	border:
		`1px solid ${T.border}`,
	background: T.deep,
	color: T.cream,
	fontSize: 13,
	outline: "none",
	boxSizing:
		"border-box" as const,
};

const dateInputStyle = {
	...inputStyle,
	cursor: "pointer",
};

const modalOverlayStyle = {
	position: "fixed" as const,
	inset: 0,
	background:
		"rgba(0,0,0,0.72)",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 2000,
	padding: 16,
};

const modalStyle = {
	width: "100%",
	maxWidth: 560,
	maxHeight: "92vh",
	overflowY: "auto" as const,
	background: T.card,
	border:
		`1px solid ${T.border}`,
	borderRadius: 16,
	padding:
		"clamp(18px, 4vw, 24px)",
	boxShadow:
		"0 24px 80px rgba(0,0,0,.5)",
};

const modalHeaderStyle = {
	display: "flex",
	justifyContent:
		"space-between",
	alignItems: "center",
	gap: 12,
	marginBottom: 22,
};

const closeButtonStyle = {
	background: "transparent",
	border: "none",
	color: T.muted,
	fontSize: 26,
	cursor: "pointer",
	lineHeight: 1,
};