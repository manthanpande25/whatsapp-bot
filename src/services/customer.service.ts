const API_URL = "http://localhost:5000/api";

export async function getCustomers(
	organizationId: string,
	token: string,
) {
	const response = await fetch(
		`${API_URL}/customers/${organizationId}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch customers");
	}

	return data;
}


export async function getCustomerByPhone(
	organizationId: string,
	phone: string,
	token: string,
) {
	const response = await fetch(
		`${API_URL}/customers/${organizationId}/phone/${phone}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		},
	);

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch customer");
	}

	return data;
}

export async function updateCustomer(
	customerId: string,
	data: {
		status?: string;
		notes?: string;
		tags?: string[];
		name?: string;
	},
	token: string,
) {
	const response = await fetch(
		`${API_URL}/customers/${customerId}`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		},
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Failed to update customer");
	}

	return result;
}