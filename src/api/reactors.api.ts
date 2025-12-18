import { apiFetch } from "./client";
import type {
  ReactorListDto,
  TemperatureDto,
  CoolantDto,
  OutputDto,
  FuelDto,
  ReactorStateDto,
  RodStateDto,
  LogsDto,
  TemperatureUnit,
  CoolantState,
} from "./types";

// GET /reactors
export const getReactors = async (): Promise<ReactorListDto> =>
  apiFetch("/reactors");

// GET /reactors/temperature/{id}
export const getReactorTemperature = async (
  id: string
): Promise<TemperatureDto> => apiFetch(`/reactors/temperature/${id}`);

// GET /reactors/coolant/{id}
export const getReactorCoolant = async (id: string): Promise<CoolantDto> =>
  apiFetch(`/reactors/coolant/${id}`);

// POST /reactors/coolant/{id}
export const setReactorCoolant = async (
  id: string,
  state: CoolantState
): Promise<CoolantDto> =>
  apiFetch(`/reactors/coolant/${id}`, {
    method: "POST",
    body: JSON.stringify({ coolant: state }),
  });

// GET /reactors/output/{id}
export const getReactorOutput = async (id: string): Promise<OutputDto> =>
  apiFetch(`/reactors/output/${id}`);

// POST /reactors/temperature (set unit global)
export const setTemperatureUnit = async (
  unit: TemperatureUnit
): Promise<TemperatureDto> =>
  apiFetch("/reactors/temperature", {
    method: "POST",
    body: JSON.stringify({ unit }),
  });

// GET /reactors/logs
export const getLogs = async (): Promise<LogsDto> => apiFetch("/reactors/logs");

// GET /reactors/fuel-level/{id}
export const getFuelLevel = async (id: string): Promise<FuelDto> =>
  apiFetch(`/reactors/fuel-level/${id}`);

// GET /reactors/reactor-state/{id}
export const getReactorState = async (id: string): Promise<ReactorStateDto> =>
  apiFetch(`/reactors/reactor-state/${id}`);

// GET reactors/rod-state/{id}
export const getRodState = async (id: string): Promise<RodStateDto> =>
  apiFetch(`/reactors/rod-state/${id}`);

// PUT /reactors/set-reactor-name/{id}
export const setReactorName = async (id: string, name: string) =>
  apiFetch(`/reactors/set-reactor-name/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });

// POST /reactors/drop-rod/{id}
export const dropRod = async (id: string) =>
  apiFetch(`/reactors/drop-rod/${id}`, { method: "POST" });

// POST /reactors/raise-rod/{id}
export const raiseRod = async (id: string) =>
  apiFetch(`/reactors/raise-rod/${id}`, { method: "POST" });

// POST /reactors/emergency-shutdown/{id}
export const emergencyShutdown = async (id: string) =>
  apiFetch(`/reactors/emergency-shutdown/${id}`, { method: "POST" });

// POST /reactors/controlled-shutdown/{id}
export const controlledShutdown = async (id: string) =>
  apiFetch(`/reactors/controlled-shutdown/${id}`, { method: "POST" });

// POST /reactors/maintenance/{id}
export const maintenanceMode = async (id: string) =>
  apiFetch(`/reactors/maintenance/${id}`, { method: "POST" });

// POST /reactors/refuel/{id}
export const refuelReactor = async (id: string) =>
  apiFetch(`/reactors/refuel/${id}`, { method: "POST" });

// POST /reactors/reset
export const resetAll = async () =>
  apiFetch("/reactors/reset", { method: "POST" });

// POST /reactors/start-reactor/{id}
export const startReactor = async (id: string) =>
  apiFetch(`/reactors/start-reactor/${id}`, { method: "POST" });

// PUT /reactors/plant-name
export const setPlantName = async (name: string) =>
  apiFetch("/reactors/plant-name", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
