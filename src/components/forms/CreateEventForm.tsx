"use client";

import {
  useState,
  useRef,
  type ChangeEvent,
  useCallback,
  useEffect,
} from "react";
import { Button } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import { DatePicker } from "~/components/ui/DatePicker";
import { useAppStore } from "~/stores/useAppStore";
import { useNotificationStore } from "~/stores/useNotificationStore";
import { ApiClient } from "~/lib/api";
import Image from "next/image";
import { useWriteContract } from "wagmi";
import { parseAbi } from "viem";

// Factory contract configurations
const FACTORY_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS as `0x${string}`;
const FACTORY_ABI = parseAbi([
  "function createNewBadge(string memory name, string memory symbol, string memory baseTokenURI, address trustedSigner) external returns (address)",
]);

interface CreateEventFormProps {
  onPreviewUpdate: (data: {
    name: string;
    description: string;
    imageUrl: string;
  }) => void;
}

// Event code validation states
type EventCodeStatus = "idle" | "checking" | "available" | "taken" | "error";

export function CreateEventForm({ onPreviewUpdate }: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventCode: "",
    eventDate: "",
    maxSupply: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [eventCodeStatus, setEventCodeStatus] =
    useState<EventCodeStatus>("idle");
  const [eventCodeMessage, setEventCodeMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, setLoading, ui } = useAppStore();
  const { showSuccess, showError, showWarning } = useNotificationStore();

  // Wagmi hooks for contract interaction
  const { writeContract } = useWriteContract();

  // Debounced event code checker
  const checkEventCodeAvailability = useCallback(async (eventCode: string) => {
    if (!eventCode || eventCode.length < 3) {
      setEventCodeStatus("idle");
      setEventCodeMessage("");
      return;
    }

    setEventCodeStatus("checking");
    setEventCodeMessage("Checking availability...");

    try {
      // Call the events API to check if code exists
      const response = await fetch(
        `/api/events?eventCode=${encodeURIComponent(eventCode.toUpperCase())}`,
      );
      const data = (await response.json()) as {
        success: boolean;
        data?: unknown[];
      };

      if (data.success && data.data) {
        // Check if any event with this code exists
        const codeExists = Array.isArray(data.data) && data.data.length > 0;

        if (codeExists) {
          setEventCodeStatus("taken");
          setEventCodeMessage("This event code is already taken");
        } else {
          setEventCodeStatus("available");
          setEventCodeMessage("Event code is available!");
        }
      } else {
        setEventCodeStatus("available");
        setEventCodeMessage("Event code is available!");
      }
    } catch (error) {
      console.error("Error checking event code:", error);
      setEventCodeStatus("error");
      setEventCodeMessage("Unable to check availability");
    }
  }, []);

  // Debounce timer
  useEffect(() => {
    const timer = setTimeout(() => {
      void checkEventCodeAvailability(formData.eventCode);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [formData.eventCode, checkEventCodeAvailability]);

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Update preview
    onPreviewUpdate({
      name: newFormData.name,
      description: newFormData.description,
      imageUrl: imagePreview,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImagePreview(imageUrl);

        // Update preview
        onPreviewUpdate({
          name: formData.name,
          description: formData.description,
          imageUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.eventCode ||
      !imageFile
    ) {
      showWarning("Please fill in all required fields and upload an image");
      return;
    }

    if (!user.isConnected) {
      showWarning("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true, "Uploading image to IPFS...");

      // Step 1: Upload image to IPFS
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);

      const imageResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: imageFormData,
      });

      const imageResult = (await imageResponse.json()) as {
        success: boolean;
        message?: string;
        data?: {
          ipfsUrl: string;
          gatewayUrl: string;
        };
      };

      if (!imageResult.success) {
        throw new Error(imageResult.message ?? "Failed to upload image");
      }

      setLoading(true, "Uploading metadata to IPFS...");

      // Step 2: Upload metadata to IPFS
      const metadataResponse = await fetch("/api/upload-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          imageUrl: imageResult.data?.ipfsUrl,
          eventDate: formData.eventDate,
          organizer: user.address,
          eventCode: formData.eventCode.toUpperCase(),
        }),
      });

      const metadataResult = (await metadataResponse.json()) as {
        success: boolean;
        message?: string;
        data?: {
          ipfsHash: string;
        };
      };

      if (!metadataResult.success || !metadataResult.data?.ipfsHash) {
        throw new Error(
          metadataResult.message ??
            "Failed to upload metadata or get IPFS hash",
        );
      }

      const metadataIpfsHash = metadataResult.data.ipfsHash;

      setLoading(true, "Deploying contract on-chain...");

      // Step 3: Deploy contract using user's wallet
      if (!FACTORY_CONTRACT_ADDRESS) {
        throw new Error("Factory contract address not configured");
      }

      const trustedSigner =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_SIGNER_ADDRESS_PROD!
          : process.env.NEXT_PUBLIC_SIGNER_ADDRESS_DEV!;

      const baseTokenURI = `ipfs://${metadataIpfsHash}`;

      // Use wagmi to call the factory contract
      const contractTxHash = await new Promise<`0x${string}`>(
        (resolve, reject) => {
          writeContract(
            {
              address: FACTORY_CONTRACT_ADDRESS,
              abi: FACTORY_ABI,
              functionName: "createNewBadge",
              args: [
                "ChronoStamp Badge", // name
                "CSB", // symbol
                baseTokenURI,
                trustedSigner as `0x${string}`,
              ],
            },
            {
              onSuccess: (hash) => resolve(hash),
              onError: (error) =>
                reject(
                  error instanceof Error
                    ? error
                    : new Error(error?.message ?? "Contract deployment failed"),
                ),
            },
          );
        },
      );

      setLoading(true, "Waiting for contract deployment confirmation...");

      // Wait for transaction to be mined using fetch
      let receipt: { logs?: Array<{ address?: string }> } | null = null;
      let attempts = 0;
      const maxAttempts = 30; // Wait up to 30 * 2 = 60 seconds

      while (!receipt && attempts < maxAttempts) {
        try {
          const response = await fetch(
            `https://sepolia-rollup.arbitrum.io/rpc`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_getTransactionReceipt",
                params: [contractTxHash],
                id: 1,
              }),
            },
          );
          const result = (await response.json()) as {
            result?: { logs?: Array<{ address?: string }> };
          };
          if (result.result) {
            receipt = result.result;
            break;
          }
        } catch {
          console.log("Waiting for transaction confirmation...");
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        attempts++;
      }

      if (!receipt) {
        throw new Error("Transaction confirmation timeout");
      }

      // Get the deployed contract address from logs
      const contractAddress = receipt.logs?.[0]?.address;
      if (!contractAddress) {
        throw new Error(
          "Failed to get contract address from transaction receipt",
        );
      }

      setLoading(true, "Saving event to database...");

      // Step 4: Create event record with deployed contract address
      const response = await ApiClient.createEvent({
        name: formData.name,
        description: formData.description,
        imageUrl: imageResult.data?.gatewayUrl ?? "",
        eventCode: formData.eventCode.toUpperCase(),
        organizer: user.address ?? "Unknown",
        eventDate: new Date(formData.eventDate || Date.now()),
        maxSupply: formData.maxSupply
          ? parseInt(formData.maxSupply)
          : undefined,
        contractAddress,
        metadataIpfsHash,
      });

      if (!response.success) {
        throw new Error(
          response.message ?? response.error ?? "Failed to create event",
        );
      }

      showSuccess(`ChronoStamp event created successfully! 🎉`, {
        title: "Event Created",
        duration: 10000,
        actions: [
          {
            label: "Copy Event Code",
            onClick: () => {
              void navigator.clipboard.writeText(
                response.data?.eventCode ?? "",
              );
              showSuccess("Event code copied to clipboard!");
            },
          },
          {
            label: "View Event",
            onClick: () => {
              window.location.href = `/event/${response.data?.id}`;
            },
            variant: "outline",
          },
        ],
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        eventCode: "",
        eventDate: "",
        maxSupply: "",
      });
      setImageFile(null);
      setImagePreview("");
      onPreviewUpdate({ name: "", description: "", imageUrl: "" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      showError("Failed to create event: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create ChronoStamp Event</CardTitle>
        <CardDescription>
          Fill in the details below to create your unique event NFT stamps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Event Name */}
        <div>
          <label
            htmlFor="eventName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Event Name *
          </label>
          <Input
            id="eventName"
            placeholder="e.g., DevConf 2024"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={ui.isLoading}
            className="h-12 sm:h-auto"
          />
        </div>

        {/* Event Description */}
        <div>
          <label
            htmlFor="eventDescription"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Event Description *
          </label>
          <Textarea
            id="eventDescription"
            placeholder="Describe your event and what makes it special..."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            disabled={ui.isLoading}
            rows={3}
            className="text-sm sm:text-base"
          />
        </div>

        {/* Event Code */}
        <div>
          <label
            htmlFor="eventCode"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Secret Event Code *
          </label>
          <div className="relative">
            <Input
              id="eventCode"
              placeholder="e.g., DEVCONF2025SECRET"
              value={formData.eventCode}
              onChange={(e) =>
                handleInputChange("eventCode", e.target.value.toUpperCase())
              }
              disabled={ui.isLoading}
              className={`h-12 pr-10 font-mono text-sm sm:h-auto sm:text-base ${
                eventCodeStatus === "available"
                  ? "border-green-300 focus:border-green-500"
                  : eventCodeStatus === "taken"
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300"
              }`}
            />
            {/* Status indicator */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {eventCodeStatus === "checking" && (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-400"></div>
              )}
              {eventCodeStatus === "available" && (
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {eventCodeStatus === "taken" && (
                <svg
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {eventCodeStatus === "error" && (
                <svg
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            This secret code will be revealed to attendees at the event to claim
            their ChronoStamp
          </p>
          {eventCodeStatus === "checking" && (
            <p className="mt-1 flex items-center text-xs text-gray-500">
              <span className="mr-1">⏳</span>
              {eventCodeMessage}
            </p>
          )}
          {eventCodeStatus === "available" && (
            <p className="mt-1 flex items-center text-xs text-green-600">
              <span className="mr-1">✅</span>
              {eventCodeMessage}
            </p>
          )}
          {eventCodeStatus === "taken" && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <span className="mr-1">❌</span>
              {eventCodeMessage}
            </p>
          )}
          {eventCodeStatus === "error" && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <span className="mr-1">⚠️</span>
              {eventCodeMessage}
            </p>
          )}
        </div>

        {/* Event Image */}
        <div>
          <label
            htmlFor="eventImage"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Event Artwork *
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={ui.isLoading}
              className="w-full sm:w-auto"
            >
              {imageFile ? "Change Image" : "Upload Image"}
            </Button>
            {imageFile && (
              <span className="truncate text-xs text-gray-600 sm:text-sm">
                {imageFile.name}
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                alt="Event preview"
                width={96}
                height={96}
                className="rounded-lg border object-cover sm:h-32 sm:w-32"
              />
            </div>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Event Date & Time
          </label>
          <DatePicker
            value={formData.eventDate}
            onChange={(value) => handleInputChange("eventDate", value)}
            disabled={ui.isLoading}
            placeholder="Select event date and time"
          />
          <p className="mt-1 text-xs text-gray-500">
            When will your event take place?
          </p>
        </div>

        {/* Max Supply */}
        <div>
          <label
            htmlFor="maxSupply"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Max Supply (Optional)
          </label>
          <Input
            id="maxSupply"
            type="number"
            placeholder="e.g., 500"
            value={formData.maxSupply}
            onChange={(e) => handleInputChange("maxSupply", e.target.value)}
            disabled={ui.isLoading}
            className="h-12 sm:h-auto"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty for unlimited supply
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4">
          <Button
            onClick={handleSubmit}
            disabled={
              ui.isLoading ||
              !user.isConnected ||
              !formData.name ||
              !formData.description ||
              !formData.eventCode ||
              !imageFile ||
              eventCodeStatus === "taken" ||
              eventCodeStatus === "checking"
            }
            className="h-12 w-full text-sm sm:h-14 sm:text-base"
            size="lg"
          >
            {ui.isLoading ? ui.loadingMessage : "Create ChronoStamp Event"}
          </Button>

          {!user.isConnected ? (
            <p className="mt-3 text-center text-xs text-gray-500 sm:text-sm">
              Connect your wallet to create events
            </p>
          ) : !formData.name ||
            !formData.description ||
            !formData.eventCode ||
            !imageFile ? (
            <p className="mt-3 text-center text-xs text-gray-400 sm:text-sm">
              Fill in all required fields to continue
            </p>
          ) : eventCodeStatus === "taken" ? (
            <p className="mt-3 text-center text-xs text-red-600 sm:text-sm">
              ❌ Event code is already taken, please choose another
            </p>
          ) : eventCodeStatus === "checking" ? (
            <p className="mt-3 text-center text-xs text-gray-500 sm:text-sm">
              ⏳ Checking event code availability...
            </p>
          ) : eventCodeStatus === "available" ? (
            <p className="mt-3 text-center text-xs text-green-600 sm:text-sm">
              ✅ Ready to create your event!
            </p>
          ) : (
            <p className="mt-3 text-center text-xs text-gray-400 sm:text-sm">
              Enter an event code to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
