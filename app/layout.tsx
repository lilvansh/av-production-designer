import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "AV Production Designer",
  description: "2D/3D AV live production planning"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
