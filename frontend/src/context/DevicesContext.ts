import { createContext } from "react";

interface Device {
  id: number;
  end_date: string | null;
  name: string;
  name_ge: string;
  type: "washer" | "dryer";
}

export const baseDevices: Device[] = [
  {
    id: 1,
    end_date: "1",
    name: "Washing Machine 1",
    name_ge: "Waschmachine 1",
    type: "washer",
  },
  {
    id: 2,
    end_date: "1",
    name: "Washing Machine 2",
    name_ge: "Waschmachine 2",
    type: "washer",
  },
  {
    id: 3,
    end_date: "1",
    name: "Washing Machine 3",
    name_ge: "Waschmachine 3",
    type: "washer",
  },
  {
    id: 4,
    end_date: "4",
    name: "Washing Machine 4",
    name_ge: "Waschmachine 4",
    type: "washer",
  },
  {
    id: 5,
    end_date: "5",
    name: "Washing Machine 5",
    name_ge: "Waschmachine 5",
    type: "washer",
  },
  {
    id: 6,
    end_date: "6",
    name: "Dryer 6",
    name_ge: "Dryer 6",
    type: "dryer",
  },
  {
    id: 7,
    end_date: "7",
    name: "Dryer 7",
    name_ge: "Dryer 7",
    type: "dryer",
  },
  {
    id: 8,
    end_date: "8",
    name: "Dryer 8",
    name_ge: "Dryer 8",
    type: "dryer",
  },
];

type DevicesContextType = Device[] | null;

export const DevicesContext = createContext<DevicesContextType>(baseDevices);
