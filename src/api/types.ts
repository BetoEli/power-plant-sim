export type ReactorListDto = {
  plant_name: string;
  reactors: { id: string; name: string }[];
};

export type TemperatureUnit = "fahrenheit" | "celsius";

export type TemperatureDto = {
  temperature: { amount: number; unit: TemperatureUnit; status: string };
};

export type CoolantState = "on" | "off";
export type CoolantDto = { coolant: CoolantState };

export type OutputDto = { output: { amount: number; unit: string } };

export type FuelDto = { fuel: { percentage: number } };

export type ReactorStateDto = { state: string };

export type RodStateDto = { control_rods: { in: number; out: number } };

export type LogsDto = Array<Record<string, string[]>>;
