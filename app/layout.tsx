import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jaipur Startup – Put your startup on Jaipur's map",
  description:
    "Discover, list, and connect with the most innovative startups in Jaipur, Rajasthan. Join the Pink City's growing entrepreneurial ecosystem.",
  keywords: ["Jaipur", "startup", "entrepreneur", "Rajasthan", "Pink City"],
  openGraph: {
    title: "Jaipur Startup – Put your startup on Jaipur's map",
    description:
      "Discover and list startups from the Pink City of India. Join Jaipur's thriving startup ecosystem.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
