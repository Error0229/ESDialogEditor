import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css"; // Make sure this path is correct
// In layout.tsx, add metadata object
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EverSnow Dialog Editor",
  description: "A tool for creating and editing dialog scenes",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☃️</text></svg>",
  },
};

// Rest of the code remains the same...
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
