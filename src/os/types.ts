export type ThemeMode = "dark" | "light";

export type WinId =
  | "ai"
  | "terminal"
  | "code"
  | "files"
  | "settings"
  | "music"
  | "weather"
  | "calendar"
  | "notes"
  | "browser"
  | "store"
  | "movies"
  | "word";

export interface WinState {
  id: WinId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  isFrozen?: boolean;
}

export type BootPhase = "bios" | "hardware" | "kernel" | "services" | "desktop" | "done";

export type SystemModal = {
  type: "error" | "warning" | "info";
  title: string;
  message: string;
} | null;

export interface AINotification {
  id: string;
  title: string;
  message: string;
  icon: string;
  time: string;
  type: "security" | "suggestion" | "cleanup" | "summary" | "system";
  actions?: { label: string; handler: string }[];
  read?: boolean;
}

export interface TimelineEvent {
  time: string;
  action: string;
  app: string;
  icon: string;
}
