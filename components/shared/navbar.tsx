"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { AddIcon, ArrowRightIcon } from "@/components/ui/icon";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffInfo, setStaffInfo] = useState({
    firstName: "Staff",
    lastName: "Member",
    primaryDepartment: "General Medicine"
  });

  useEffect(() => {
    const fetchStaffInfo = async () => {
      const token = localStorage.getItem("staffToken");
      setIsAuthenticated(!!token);
      
      if (token) {
        try {
          const response = await fetch("/api/staff/me", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          
          const data = await response.json();
          
          if (data.success) {
            setStaffInfo({
              firstName: data.data.firstName,
              lastName: data.data.lastName,
              primaryDepartment: data.data.primaryDepartment,
            });
          } else {
            // Token might be invalid, redirect to login
            localStorage.removeItem("staffToken");
            setIsAuthenticated(false);
            if (pathname?.startsWith("/staff") && pathname !== "/staff/login") {
              router.push("/staff/login");
            }
          }
        } catch (error) {
          console.error("Failed to fetch staff info:", error);
          // Keep default values on error
        }
      }
    };

    fetchStaffInfo();
  }, [pathname, router]); // Re-check on route changes

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
    setIsAuthenticated(false);
    router.push("/");
  };

  const isOnStaffPages = pathname?.startsWith("/staff");

  return (
    <Box className="bg-background-0 border-b border-outline-200 shadow-sm w-full h-16 flex-shrink-0">
      <Box className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <HStack className="h-full items-center justify-between w-full">
          <HStack className="items-center gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Box className="bg-primary-600 p-2 rounded-full">
                <AddIcon
                  className="text-white h-5 w-5"
                  style={{ transform: "rotate(45deg)" }}
                />
              </Box>
              <Text className="text-xl font-bold text-typography-900">
                HospAI
              </Text>
            </Link>
          </HStack>
          
          <HStack className="items-center gap-4 flex-shrink-0">
            {isAuthenticated && isOnStaffPages ? (
              // Authenticated staff user
              <>
                <VStack className="items-end">
                  <Text className="text-sm font-medium text-typography-900">
                    Dr. {staffInfo.firstName} {staffInfo.lastName}
                  </Text>
                  <Text className="text-xs text-typography-500">
                    {staffInfo.primaryDepartment}
                  </Text>
                </VStack>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleLogout}
                  className="border-error-200 hover:bg-error-50 p-2"
                >
                  <ArrowRightIcon className="h-4 w-4 text-error-600" />
                </Button>
              </>
            ) : (
              // Public navigation
              <>
                <Link href="/staff/login">
                  <Button variant="outline" size="sm">
                    <ButtonText>Staff Login</ButtonText>
                  </Button>
                </Link>
                <Button size="sm">
                  <ButtonText>Get Started</ButtonText>
                </Button>
              </>
            )}
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
}