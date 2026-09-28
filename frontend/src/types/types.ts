export interface Device {
  id: number;
  end_date?: string;
  start_date?: string;
  type: "washer" | "dryer";
  number: number;
  owner: string;
}

export interface SnackbarItem {
  status: "success" | "error" | "info";
  message: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  imageUrl: string | null;
  createdAt: string;
}
