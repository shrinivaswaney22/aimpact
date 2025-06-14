import Header from "@/components/Header";
import { Roboto } from "next/font/google";
import { dark } from "@clerk/themes";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
})

export const metadata = {
  title: "AImpact",
  description: "AI Powered Career Guidance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
    >
      <html lang="en" suppressHydrationWarning>
        <body 
        className={`${roboto.className}`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header/>
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
            <footer className="bg-muted/50 py-12 ">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>© {new Date().getFullYear()} AImpact. All rights reserved.</p>
              </div>
            </footer>
          </ThemeProvider>
      </body>
      </html>
    </ClerkProvider>
  );
}