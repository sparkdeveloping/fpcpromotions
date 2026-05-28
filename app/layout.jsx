import "./globals.css";

export const metadata = {
  title: "FPC Media Command",
  description: "Private media operations hub for FPC Wichita Media Missions Creatives.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
