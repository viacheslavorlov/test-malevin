const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export interface WorkEntry {
  id: number;
  date: string;
  workTypeId: number;
  workTypeName: string;
  volume: number;
  unit: string;
  executorName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkType {
  id: number;
  name: string;
}

export function api() {
  return {
    auth: {
      login: (username: string, password: string) =>
        request<{ token: string; user: { id: number; username: string } }>(
          "/api/auth/login",
          { method: "POST", body: JSON.stringify({ username, password }) }
        ),
      register: (username: string, password: string) =>
        request<{ token: string; user: { id: number; username: string } }>(
          "/api/auth/register",
          { method: "POST", body: JSON.stringify({ username, password }) }
        ),
    },
    workEntries: {
      list: (params?: { dateFrom?: string; dateTo?: string; sort?: string }) => {
        const qs = new URLSearchParams();
        if (params?.dateFrom) qs.set("dateFrom", params.dateFrom);
        if (params?.dateTo) qs.set("dateTo", params.dateTo);
        if (params?.sort) qs.set("sort", params.sort);
        const query = qs.toString();
        return request<{ entries: WorkEntry[] }>(
          `/api/work-entries${query ? `?${query}` : ""}`
        );
      },
      create: (data: {
        date: string;
        workTypeId: number;
        volume: number;
        unit: string;
        executorName: string;
      }) =>
        request<{ entry: WorkEntry }>("/api/work-entries", {
          method: "POST",
          body: JSON.stringify(data),
        }),
      update: (
        id: number,
        data: {
          date: string;
          workTypeId: number;
          volume: number;
          unit: string;
          executorName: string;
        }
      ) =>
        request<{ entry: WorkEntry }>(`/api/work-entries/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
      delete: (id: number) =>
        request<{ success: boolean }>(`/api/work-entries/${id}`, {
          method: "DELETE",
        }),
    },
    workTypes: {
      list: () => request<{ workTypes: WorkType[] }>("/api/work-types"),
    },
  };
}
