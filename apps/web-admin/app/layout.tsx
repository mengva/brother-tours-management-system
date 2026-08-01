import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TRPCProvider } from "./trpc";
import { Toaster } from "react-hot-toast";
import UserAuthLayoutPage from "@/components/userAuth";
import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // className={customizeFont.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div id="web-admin" className="w-full h-screen fixed inset-0 overflow-y-auto">
            <TRPCProvider>
              <Providers>
                <UserAuthLayoutPage>
                  {children}
                  <Toaster position="bottom-right" />
                </UserAuthLayoutPage>
              </Providers>
            </TRPCProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
