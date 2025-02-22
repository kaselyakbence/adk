import { createContext } from "react";
import { Device } from "../types/types";

export const baseDevices: Device[] = [
  {
    id: 1,
    type: "washer",
    number: 1,
  },
  {
    id: 2,
    number: 2,
    type: "washer",
  },
  {
    id: 3,
    number: 3,
    type: "washer",
  },
  {
    id: 4,
    number: 4,
    type: "washer",
  },
  {
    id: 5,
    number: 5,
    type: "washer",
  },
  {
    id: 6,
    number: 6,
    type: "dryer",
  },
  {
    id: 7,
    number: 7,
    type: "dryer",
  },
  {
    id: 8,
    number: 8,
    type: "dryer",
  },
];

type DevicesContextType = Device[];

export const DevicesContext = createContext<DevicesContextType>(baseDevices);
