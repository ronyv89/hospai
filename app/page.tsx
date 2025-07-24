"use client";

import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { MessageCircleIcon, LoaderIcon } from "@/components/ui/icon";

interface Department {
  id: number;
  name: string;
  description: string;
  reasoning: string;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  qualifications: string[];
  departments: string[];
  reasoning: string;
}

interface Hospital {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  website?: string;
  departmentName: string;
  departmentId: number;
  availableDoctors: number;
}

interface AIResponse {
  query: string;
  analysis: string;
  recommendedDepartments: Department[];
  recommendedDoctors: Doctor[];
  recommendedHospitals: Hospital[];
  summary: string;
  nextSteps: string[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  aiResponse?: AIResponse;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI healthcare assistant. I can help you find the right department, hospital, and doctor based on your medical needs. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    try {
      // Call the AI assistant API
      const response = await fetch("/api/simple-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: currentInput }),
      });

      const data = await response.json();

      if (data.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.data.summary,
          isUser: false,
          timestamp: new Date(),
          aiResponse: data.data,
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error(data.error || "Failed to get AI response");
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support if the issue persists.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAIResponse = (aiResponse: AIResponse) => (
    <VStack className="gap-3 mt-2">
      {/* Analysis */}
      <Box className="p-3 bg-background-50 rounded-lg">
        <Text className="text-sm font-medium text-typography-800 mb-1">
          Analysis:
        </Text>
        <Text className="text-sm text-typography-600">
          {aiResponse.analysis}
        </Text>
      </Box>

      {/* Recommended Departments */}
      {aiResponse.recommendedDepartments.length > 0 && (
        <Box className="p-3 bg-primary-50 rounded-lg">
          <Text className="text-sm font-medium text-primary-800 mb-2">
            Recommended Departments:
          </Text>
          <VStack className="gap-2">
            {aiResponse.recommendedDepartments.map((dept) => (
              <Box
                key={`dept-${dept.id}`}
                className="p-2 bg-background-0 rounded border"
              >
                <Text className="text-sm font-medium text-typography-900">
                  {dept.name}
                </Text>
                <Text className="text-xs text-typography-600 mt-1">
                  {dept.description}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {/* Recommended Hospitals */}
      {aiResponse.recommendedHospitals &&
        aiResponse.recommendedHospitals.length > 0 && (
          <Box className="p-3 bg-info-50 rounded-lg">
            <Text className="text-sm font-medium text-info-800 mb-2">
              Recommended Hospitals:
            </Text>
            <VStack className="gap-2">
              {aiResponse.recommendedHospitals.map((hospital) => (
                <Box
                  key={`hospital-${hospital.id}`}
                  className="p-2 bg-background-0 rounded border"
                >
                  <Text className="text-sm font-medium text-typography-900">
                    {hospital.name}
                  </Text>
                  <Text className="text-xs text-typography-600">
                    {hospital.address}, {hospital.city}, {hospital.state}
                  </Text>
                  <Text className="text-xs text-typography-500 mt-1">
                    Department: {hospital.departmentName} • Available Doctors:{" "}
                    {hospital.availableDoctors}
                  </Text>
                  {hospital.phone && (
                    <Text className="text-xs text-typography-500">
                      Phone: {hospital.phone}
                    </Text>
                  )}
                </Box>
              ))}
            </VStack>
          </Box>
        )}

      {/* Recommended Doctors */}
      {aiResponse.recommendedDoctors.length > 0 && (
        <Box className="p-3 bg-success-50 rounded-lg">
          <Text className="text-sm font-medium text-success-800 mb-2">
            Recommended Doctors:
          </Text>
          <VStack className="gap-2">
            {aiResponse.recommendedDoctors.map((doctor) => (
              <Box
                key={`doctor-${doctor.id}`}
                className="p-2 bg-background-0 rounded border"
              >
                <Text className="text-sm font-medium text-typography-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </Text>
                <Text className="text-xs text-typography-600">
                  {doctor.qualifications.join(", ")}
                </Text>
                <Text className="text-xs text-typography-500 mt-1">
                  Specializes in: {doctor.departments.join(", ")}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {/* Next Steps */}
      {aiResponse.nextSteps.length > 0 && (
        <Box className="p-3 bg-warning-50 rounded-lg">
          <Text className="text-sm font-medium text-warning-800 mb-2">
            Next Steps:
          </Text>
          <VStack className="gap-1">
            {aiResponse.nextSteps.map((step, index) => (
              <Text key={index} className="text-sm text-typography-700">
                {index + 1}. {step}
              </Text>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );

  return (
    <Box className="h-[calc(100vh-4rem)] bg-background-50 flex flex-col p-2 sm:p-4">
      <Box className="w-full max-w-6xl mx-auto h-full flex flex-col">
        {/* Header - Compact */}
        <VStack className="items-center mb-3 sm:mb-4 gap-2">
          <Box className="bg-primary-100 p-2 sm:p-3 rounded-full">
            <MessageCircleIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />
          </Box>
          <VStack className="items-center gap-1">
            <Text className="text-xl sm:text-2xl lg:text-3xl font-bold text-typography-900">
              HospAI Assistant
            </Text>
            <Text className="text-sm sm:text-base lg:text-lg text-typography-600 text-center max-w-2xl">
              Get instant answers to your healthcare questions, schedule
              appointments, and manage your health
            </Text>
          </VStack>
        </VStack>

        {/* Chat Container - Takes most space */}
        <Box className="bg-background-0 rounded-xl shadow-lg border border-outline-200 overflow-hidden flex-1 flex flex-col min-h-0">
          {/* Messages - Flexible height with minimum */}
          <ScrollView
            className="flex-1 p-3 sm:p-4 hide-scrollbar min-h-[200px]"
            showsVerticalScrollIndicator={false}
          >
            <VStack className="gap-3">
              {messages.map((message) => (
                <VStack
                  key={`message-${message.id}`}
                  className={`max-w-[85%] sm:max-w-[80%] ${
                    message.isUser ? "self-end" : "self-start"
                  }`}
                >
                  <Box
                    className={`p-2 sm:p-3 rounded-lg ${
                      message.isUser
                        ? "bg-primary-500 ml-auto"
                        : "bg-background-100"
                    }`}
                  >
                    <Text
                      className={`text-sm sm:text-base ${
                        message.isUser
                          ? "text-typography-0"
                          : "text-typography-800"
                      }`}
                    >
                      {message.text}
                    </Text>
                  </Box>
                  {/* Render AI recommendations if available */}
                  {!message.isUser && message.aiResponse && (
                    <Box className="w-full">
                      {renderAIResponse(message.aiResponse)}
                    </Box>
                  )}
                </VStack>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <HStack className="max-w-[85%] sm:max-w-[80%] self-start">
                  <Box className="p-2 sm:p-3 rounded-lg bg-background-100">
                    <HStack className="items-center gap-2">
                      <LoaderIcon className="h-4 w-4 animate-spin text-primary-500" />
                      <Text className="text-sm text-typography-600">
                        Analyzing your request...
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
              )}
            </VStack>
          </ScrollView>

          {/* Input Area - Compact */}
          <Box className="border-t border-outline-200 p-2 sm:p-3">
            <HStack className="gap-2 sm:gap-3">
              <Input className="flex-1">
                <InputField
                  placeholder="Type your healthcare question here..."
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={sendMessage}
                  editable={!isLoading}
                />
              </Input>
              <Button
                onPress={sendMessage}
                size="sm"
                className="px-3 sm:px-4"
                disabled={isLoading || !inputText.trim()}
              >
                <ButtonText className="text-sm">
                  {isLoading ? "Sending..." : "Send"}
                </ButtonText>
              </Button>
            </HStack>
          </Box>
        </Box>

        {/* Quick Actions - Compact and responsive */}
        <VStack className="mt-2 sm:mt-3 gap-2 flex-shrink-0">
          <Text className="text-base sm:text-lg font-semibold text-typography-900 text-center">
            Common Questions
          </Text>
          <HStack className="justify-center gap-1 sm:gap-2 lg:gap-3 flex-wrap">
            <Button
              variant="outline"
              size="xs"
              className="px-2 py-1"
              onPress={() => setInputText("I have chest pain and need help")}
              disabled={isLoading}
            >
              <ButtonText className="text-xs sm:text-sm">Chest Pain</ButtonText>
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="px-2 py-1"
              onPress={() => setInputText("I have severe headaches")}
              disabled={isLoading}
            >
              <ButtonText className="text-xs sm:text-sm">Headaches</ButtonText>
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="px-2 py-1"
              onPress={() => setInputText("I need an eye doctor")}
              disabled={isLoading}
            >
              <ButtonText className="text-xs sm:text-sm">
                Eye Problems
              </ButtonText>
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="px-2 py-1"
              onPress={() => setInputText("I have joint pain")}
              disabled={isLoading}
            >
              <ButtonText className="text-xs sm:text-sm">Joint Pain</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
