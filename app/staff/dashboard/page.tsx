"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  AtSignIcon,
  CalendarDaysIcon,
  BellIcon,
  CopyIcon,
} from "@/components/ui/icon";

export default function StaffDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staffInfo, setStaffInfo] = useState({
    firstName: "Staff",
    lastName: "Member",
    role: "Doctor",
    primaryDepartment: "General Medicine",
  });

  useEffect(() => {
    const fetchStaffInfo = async () => {
      const token = localStorage.getItem("staffToken");
      if (!token) {
        router.push("/staff/login");
        return;
      }

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
            role: "Doctor",
            primaryDepartment: data.data.primaryDepartment,
          });
          setIsAuthenticated(true);
        } else {
          // Token is invalid, redirect to login
          localStorage.removeItem("staffToken");
          router.push("/staff/login");
        }
      } catch (error) {
        console.error("Failed to fetch staff info:", error);
        // Keep default values and still allow access on error
        setIsAuthenticated(true);
      }
    };

    fetchStaffInfo();
  }, [router]);

  if (!isAuthenticated) {
    return (
      <Box className="min-h-screen bg-background-50 flex items-center justify-center">
        <Text className="text-typography-500">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="min-h-[calc(100vh-4rem)] bg-background-50">
      {/* Main Content */}
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-full">
        <VStack className="gap-8 h-full">
          {/* Welcome Section */}
          <Card className="p-6">
            <VStack className="gap-2">
              <Text className="text-2xl font-bold text-typography-900">
                Welcome back, Dr. {staffInfo.firstName} {staffInfo.lastName}!
              </Text>
              <Text className="text-typography-600">
                Here&apos;s your dashboard overview for today.
              </Text>
            </VStack>
          </Card>

          {/* Quick Actions Grid */}
          <VStack className="gap-4">
            <Text className="text-xl font-semibold text-typography-900">
              Quick Actions
            </Text>

            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* View Schedule */}
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <VStack className="items-center gap-3">
                  <Box className="bg-primary-100 p-3 rounded-full">
                    <CalendarDaysIcon className="h-6 w-6 text-primary-600" />
                  </Box>
                  <VStack className="items-center gap-1">
                    <Text className="font-medium text-typography-900">
                      View Schedule
                    </Text>
                    <Text className="text-sm text-typography-500 text-center">
                      Check today&apos;s appointments
                    </Text>
                  </VStack>
                </VStack>
              </Card>

              {/* Patient Records */}
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <VStack className="items-center gap-3">
                  <Box className="bg-info-100 p-3 rounded-full">
                    <BellIcon className="h-6 w-6 text-info-600" />
                  </Box>
                  <VStack className="items-center gap-1">
                    <Text className="font-medium text-typography-900">
                      Patient Records
                    </Text>
                    <Text className="text-sm text-typography-500 text-center">
                      Access patient information
                    </Text>
                  </VStack>
                </VStack>
              </Card>

              {/* Reports */}
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <VStack className="items-center gap-3">
                  <Box className="bg-success-100 p-3 rounded-full">
                    <CopyIcon className="h-6 w-6 text-success-600" />
                  </Box>
                  <VStack className="items-center gap-1">
                    <Text className="font-medium text-typography-900">
                      Reports
                    </Text>
                    <Text className="text-sm text-typography-500 text-center">
                      Generate medical reports
                    </Text>
                  </VStack>
                </VStack>
              </Card>

              {/* Profile */}
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <VStack className="items-center gap-3">
                  <Box className="bg-warning-100 p-3 rounded-full">
                    <AtSignIcon className="h-6 w-6 text-warning-600" />
                  </Box>
                  <VStack className="items-center gap-1">
                    <Text className="font-medium text-typography-900">
                      My Profile
                    </Text>
                    <Text className="text-sm text-typography-500 text-center">
                      Update profile settings
                    </Text>
                  </VStack>
                </VStack>
              </Card>
            </Box>
          </VStack>

          {/* Recent Activity Placeholder */}
          <VStack className="gap-4">
            <Text className="text-xl font-semibold text-typography-900">
              Recent Activity
            </Text>
            <Card className="p-6">
              <VStack className="items-center gap-3 py-8">
                <Text className="text-typography-500">
                  No recent activity to display
                </Text>
                <Text className="text-sm text-typography-400 text-center max-w-md">
                  Your recent appointments, patient interactions, and system
                  updates will appear here.
                </Text>
              </VStack>
            </Card>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
