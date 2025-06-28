import { createContext } from "react";
import { Device } from "../types/types";

export const baseDevices: Device[] = [
  {
    id: 1,
    type: "washer",
    number: 1,
    owner: "unknown",
  },
  {
    id: 2,
    number: 2,
    type: "washer",
    owner: "unknown",
  },
  {
    id: 3,
    number: 3,
    type: "washer",
    owner: "unknown",
  },
  {
    id: 4,
    number: 4,
    type: "washer",
    owner: "unknown",
  },
  {
    id: 5,
    number: 5,
    type: "washer",
    owner: "unknown",
  },
  {
    id: 6,
    number: 6,
    type: "dryer",
    owner: "unknown",
  },
  {
    id: 7,
    number: 7,
    type: "dryer",
    owner: "unknown",
  },
  {
    id: 8,
    number: 8,
    type: "dryer",
    owner: "unknown",
  },
];

export const DevicesContext = createContext<Device[]>(baseDevices);
