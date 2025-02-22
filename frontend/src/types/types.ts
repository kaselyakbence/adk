export interface Device {
  id: number;
  end_date?: string;
  type: "washer" | "dryer";
  number: number;
}
