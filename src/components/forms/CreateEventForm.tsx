"use client";

import { useState, useRef, type ChangeEvent } from "react";
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
import { ApiClient } from "~/lib/api";
import Image from "next/image";

interface CreateEventFormProps {
  onPreviewUpdate: (data: {
    name: string;
    description: string;
    imageUrl: string;
  }) => void;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, setLoading, ui } = useAppStore();

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
    if (!formData.name || !formData.description || !formData.eventCode || !imageFile) {
      alert("Please fill in all required fields and upload an image");
      return;
    }

    if (!user.isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true, "Creating your ChronoStamp event...");

      const response = await ApiClient.createEvent({
        name: formData.name,
        description: formData.description,
        imageUrl: imagePreview,
        eventCode: formData.eventCode.toUpperCase(),
        organizer: user.address ?? "Unknown",
        eventDate: new Date(formData.eventDate || Date.now()),
        maxSupply: formData.maxSupply
          ? parseInt(formData.maxSupply)
          : undefined,
      });

      if (!response.success) {
        throw new Error(response.message ?? response.error ?? 'Failed to create event');
      }

      alert(`ChronoStamp event created successfully!\n\n🔐 Secret Event Code: ${response.data?.eventCode}\n\n⚠️ Keep this code secret! Only share it with attendees at your event.`);

      // Reset form
      setFormData({ name: "", description: "", eventCode: "", eventDate: "", maxSupply: "" });
      setImageFile(null);
      setImagePreview("");
      onPreviewUpdate({ name: "", description: "", imageUrl: "" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert("Failed to create event: " + (error as Error).message);
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
          <Input
            id="eventCode"
            placeholder="e.g., DEVCONF2024SECRET"
            value={formData.eventCode}
            onChange={(e) => handleInputChange("eventCode", e.target.value.toUpperCase())}
            disabled={ui.isLoading}
            className="font-mono h-12 sm:h-auto text-sm sm:text-base"
          />
          <p className="mt-1 text-xs text-gray-500">
            This secret code will be revealed to attendees at the event to claim their ChronoStamp
          </p>
        </div>

        {/* Event Image */}
        <div>
          <label
            htmlFor="eventImage"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Event Artwork *
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
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
              <span className="text-xs sm:text-sm text-gray-600 truncate">
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
                className="sm:w-32 sm:h-32 rounded-lg border object-cover"
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
              !imageFile
            }
            className="w-full h-12 sm:h-14 text-sm sm:text-base"
            size="lg"
          >
            {ui.isLoading ? ui.loadingMessage : "Create ChronoStamp Event"}
          </Button>

          {!user.isConnected ? (
            <p className="mt-3 text-center text-xs sm:text-sm text-gray-500">
              Connect your wallet to create events
            </p>
          ) : !formData.name || !formData.description || !formData.eventCode || !imageFile ? (
            <p className="mt-3 text-center text-xs sm:text-sm text-gray-400">
              Fill in all required fields to continue
            </p>
          ) : (
            <p className="mt-3 text-center text-xs sm:text-sm text-green-600">
              ✓ Ready to create your event!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
