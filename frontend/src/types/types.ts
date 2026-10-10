export interface Device {
  id: number;
  end_date?: string;
  start_date?: string;
  type: "washer" | "dryer";
  number: number;
  owner: string;
  // Warn-only broken flag (see backend Device model) - optional here since
  // the placeholder baseDevices shown before the first fetch don't have it.
  broken?: boolean;
  brokenReason?: string | null;
  brokenAt?: string | null;
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
