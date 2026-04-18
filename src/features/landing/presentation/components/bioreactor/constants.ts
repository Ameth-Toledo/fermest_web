export interface BubbleData {
  left: string;
  delay: string;
  duration: string;
  size: number;
}

export interface ChipData {
  label: string;
  value: string;
  unit: string;
  delay: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export const BUBBLES: BubbleData[] = [
  { left: "18%", delay: "0s",    duration: "2.8s", size: 5 },
  { left: "35%", delay: "1.1s",  duration: "3.4s", size: 4 },
  { left: "52%", delay: "0.5s",  duration: "2.3s", size: 6 },
  { left: "68%", delay: "1.8s",  duration: "3.0s", size: 3 },
  { left: "28%", delay: "2.3s",  duration: "2.6s", size: 5 },
  { left: "75%", delay: "0.9s",  duration: "3.8s", size: 4 },
];

export const CHIPS: ChipData[] = [
  { label: "pH",      value: "7.0", unit: "",     top: "10%",    left: "-8%",  delay: "0s"   },
  { label: "Temp",    value: "25",  unit: "°C",   top: "18%",    right: "-8%", delay: "0.6s" },
  { label: "Azúcar",  value: "10",  unit: "g/L",  bottom: "24%", left: "-6%",  delay: "1.1s" },
  { label: "Inóculo", value: "1.5", unit: "g/L",  bottom: "16%", right: "-4%", delay: "1.7s" },
];

export const CONDENSATION = [
  { left: "11%", delay: "0s",   duration: "5s"   },
  { left: "79%", delay: "2.1s", duration: "4.4s" },
  { left: "39%", delay: "3.7s", duration: "6.2s" },
];

export const PULSE_RINGS = [{ delay: "0s" }, { delay: "0.8s" }];
