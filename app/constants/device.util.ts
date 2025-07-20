import type { DeviceInfo } from "@/app/types/device";
import { v4 as uuidv4 } from "uuid";
import { isBrowser } from "@/lib/browser.util";

/**
 * Get device info from localStorage (if available in browser)
 */
export const getLocalDeviceInfo = (): DeviceInfo | null => {
  if (isBrowser) {
    const device = localStorage.getItem("device-info");
    return device ? JSON.parse(device) : null;
  }
  return null;
};

/**
 * Save device info to localStorage
 */
export const setLocalDeviceInfo = (params: DeviceInfo): void => {
  if (isBrowser) {
    localStorage.setItem("device-info", JSON.stringify(params));
  }
};

/**
 * Save device ID directly
 */
function setDeviceId(id: string): void {
  if (isBrowser) {
    localStorage.setItem("deviceId", id);
  }
}

/**
 * Get device ID from localStorage or generate a new one
 */
export function deviceId(): string {
  if (!isBrowser) return "";

  const existingId = localStorage.getItem("deviceId");
  if (existingId) return existingId;

  const newId = uuidv4();
  setDeviceId(newId);
  return newId;
}
