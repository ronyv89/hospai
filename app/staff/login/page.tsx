"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form-control";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from "@/components/ui/select";
import { 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon,
  ArrowLeftIcon,
  LoaderIcon,
  AtSignIcon,
  ChevronDownIcon
} from "@/components/ui/icon";

export default function StaffLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    staffType: "doctor",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleLogin = async () => {
    if (!formData.staffType || !formData.username.trim() || !formData.password.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual authentication API call
      const response = await fetch("/api/staff/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffType: formData.staffType,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store auth token or session
        localStorage.setItem("staffToken", data.token);
        
        // Redirect to staff dashboard
        router.push("/staff/dashboard");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent?.key === "Enter" || event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-primary-50 to-info-50 flex items-center justify-center p-4">
      <Box className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-primary-600 hover:text-primary-800 transition-colors">
          <ArrowLeftIcon className="h-4 w-4" />
          <Text className="text-sm font-medium">Back to Home</Text>
        </Link>

        {/* Login Card */}
        <Box className="bg-white rounded-2xl shadow-xl border border-outline-100 overflow-hidden">
          {/* Header */}
          <Box className="bg-primary-500 p-6 text-center">
            <Box className="bg-white bg-opacity-20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <LockIcon className="h-8 w-8 text-white" />
            </Box>
            <Text className="text-2xl font-bold text-white mb-2">
              Staff Login
            </Text>
            <Text className="text-primary-100 text-sm">
              Access your HospAI staff dashboard
            </Text>
          </Box>

          {/* Form */}
          <Box className="p-6">
            <VStack className="gap-4">
              {/* Error Message */}
              {error && (
                <Box className="bg-error-50 border border-error-200 rounded-lg p-3">
                  <Text className="text-error-600 text-sm text-center">
                    {error}
                  </Text>
                </Box>
              )}

              {/* Staff Type Field */}
              <FormControl>
                <Text className="text-sm font-medium text-typography-700 mb-2">
                  Staff Type
                </Text>
                <Select
                  selectedValue={formData.staffType}
                  onValueChange={(value) => handleInputChange("staffType", value || "doctor")}
                >
                  <SelectTrigger className="relative">
                    <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      <AtSignIcon className="h-4 w-4 text-typography-400" />
                    </Box>
                    <SelectInput
                      placeholder="Select staff type"
                      className="pl-10 pr-10"
                      editable={false}
                    />
                    <SelectIcon className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ChevronDownIcon className="h-4 w-4 text-typography-400" />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectScrollView>
                        <SelectItem label="Doctor" value="doctor">
                          <Text className="text-typography-900">Doctor</Text>
                        </SelectItem>
                      </SelectScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>

              {/* Username Field */}
              <FormControl>
                <Text className="text-sm font-medium text-typography-700 mb-2">
                  Username
                </Text>
                <Input className="relative">
                  <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <AtSignIcon className="h-4 w-4 text-typography-400" />
                  </Box>
                  <InputField
                    placeholder="Enter your username"
                    value={formData.username}
                    onChangeText={(value) => handleInputChange("username", value)}
                    className="pl-10"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </Input>
              </FormControl>

              {/* Password Field */}
              <FormControl>
                <Text className="text-sm font-medium text-typography-700 mb-2">
                  Password
                </Text>
                <Input className="relative">
                  <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    <LockIcon className="h-4 w-4 text-typography-400" />
                  </Box>
                  <InputField
                    placeholder="Enter your password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange("password", value)}
                    secureTextEntry={!showPassword}
                    className="pl-10 pr-10"
                    onKeyPress={handleKeyPress}
                    editable={!isLoading}
                  />
                  <Button
                    variant="outline"
                    size="xs"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 border-transparent bg-transparent"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-typography-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-typography-400" />
                    )}
                  </Button>
                </Input>
              </FormControl>

              {/* Login Button */}
              <Button
                onPress={handleLogin}
                className="w-full mt-2"
                disabled={isLoading || !formData.staffType || !formData.username.trim() || !formData.password.trim()}
              >
                {isLoading ? (
                  <HStack className="items-center gap-2">
                    <LoaderIcon className="h-4 w-4 animate-spin text-white" />
                    <ButtonText>Signing In...</ButtonText>
                  </HStack>
                ) : (
                  <ButtonText>Sign In</ButtonText>
                )}
              </Button>

              {/* Divider */}
              <Box className="flex-row items-center mt-4">
                <Box className="flex-1 h-px bg-outline-200" />
                <Text className="px-4 text-xs text-typography-400">
                  Need help?
                </Text>
                <Box className="flex-1 h-px bg-outline-200" />
              </Box>

              {/* Help Links */}
              <VStack className="gap-2 items-center">
                <Button variant="outline" size="xs" className="border-transparent bg-transparent">
                  <ButtonText className="text-primary-600 text-xs">
                    Forgot Password?
                  </ButtonText>
                </Button>
                <Button variant="outline" size="xs" className="border-transparent bg-transparent">
                  <ButtonText className="text-typography-500 text-xs">
                    Contact IT Support
                  </ButtonText>
                </Button>
              </VStack>
            </VStack>
          </Box>
        </Box>

        {/* Footer */}
        <Text className="text-center text-xs text-typography-400 mt-6">
          © 2024 HospAI. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}