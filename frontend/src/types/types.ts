export interface Device {
  id: number;
  end_date?: string;
  start_date?: string;
  type: "washer" | "dryer";
  number: number;
  owner: string;
}

export interface SnackbarItem {
  status: "success" | "error";
  message: string;
}
