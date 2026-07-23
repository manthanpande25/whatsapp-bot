const API_URL = "http://localhost:5000/api";

export async function getCustomers(
  organizationId: string,
  token: string
) {
  const response = await fetch(
    `${API_URL}/customers/${organizationId}`,
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
    throw new Error(data.message || "Failed to fetch customers");
  }

  return data;
}