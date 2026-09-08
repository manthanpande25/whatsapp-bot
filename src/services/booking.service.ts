const API_URL = "http://localhost:5000/api";

export interface Booking {
  id?: string;
  organizationId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  doctorName: string;
  service: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt?: any;
  updatedAt?: any;
}

// Get all bookings
export async function getBookings(
  organizationId: string,
  token: string
) {
  const response = await fetch(
    `${API_URL}/bookings/${organizationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch bookings"
    );
  }

  return data;
}

// Get available slots for a date
export async function getAvailableSlots(
  organizationId: string,
  date: string,
  token: string
) {
  const response = await fetch(
    `${API_URL}/bookings/availability?organizationId=${encodeURIComponent(
      organizationId
    )}&date=${encodeURIComponent(date)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch available slots"
    );
  }

  return data;
}

// Create booking
export async function createBooking(
  booking: Omit<Booking, "id" | "createdAt" | "updatedAt">,
  token: string
) {
  const response = await fetch(
    `${API_URL}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(booking),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create booking"
    );
  }

  return data;
}

// Get bookings of a particular customer
export async function getCustomerBookings(
  organizationId: string,
  phone: string,
  token: string
) {
  const response = await fetch(
    `${API_URL}/bookings/customer/${organizationId}/${phone}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch customer bookings"
    );
  }

  return data;
}

// Cancel booking
export async function cancelBooking(
  bookingId: string,
  token: string
) {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to cancel booking"
    );
  }

  return data;
}