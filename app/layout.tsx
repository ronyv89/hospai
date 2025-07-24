import type { Metadata } from "next";
import StyledJsxRegistry from "./registry";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Geist, Geist_Mono } from "next/font/google";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HospAI - Healthcare AI Platform",
  description: "Advanced AI-powered healthcare management platform",
};

function Navbar() {
  return (
    <Box className="bg-background-0 border-b border-outline-200 shadow-sm w-full">
      <Box className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <HStack className="h-16 items-center justify-between w-full">
          <HStack className="items-center gap-3 flex-shrink-0">
            <Box className="bg-primary-600 p-2 rounded-full">
              <AddIcon
                className="text-white h-5 w-5"
                style={{ transform: "rotate(45deg)" }}
              />
            </Box>
            <Text className="text-xl font-bold text-typography-900">
              HospAI
            </Text>
          </HStack>
          <HStack className="items-center gap-4 flex-shrink-0">
            <Button variant="outline" size="sm">
              <ButtonText>Staff Login</ButtonText>
            </Button>
            <Button size="sm">
              <ButtonText>Get Started</ButtonText>
            </Button>
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StyledJsxRegistry>
          <GluestackUIProvider mode="light">
            <main className="h-full w-full flex flex-col">
              <Navbar />
              {children}
            </main>
          </GluestackUIProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
