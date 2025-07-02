'use client';

import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Textarea } from "~/components/ui/Textarea";
import { DatePicker } from "~/components/ui/DatePicker";
import { useAppStore } from "~/stores/useAppStore";

interface CreateEventFormProps {
  onPreviewUpdate: (data: { name: string; description: string; imageUrl: string }) => void;
}

export function CreateEventForm({ onPreviewUpdate }: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventDate: '',
    maxSupply: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, mockCreateEvent, setLoading, ui } = useAppStore();

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
    if (!formData.name || !formData.description || !imageFile) {
      alert('Please fill in all required fields and upload an image');
      return;
    }

    if (!user.isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true, 'Creating your ChronoStamp event...');
      
      await mockCreateEvent({
        name: formData.name,
        description: formData.description,
        imageUrl: imagePreview,
        eventCode: `${formData.name.toUpperCase().replace(/\s+/g, '')}${Date.now().toString().slice(-4)}`,
        organizer: user.address ?? 'Unknown',
        eventDate: new Date(formData.eventDate || Date.now()),
        maxSupply: formData.maxSupply ? parseInt(formData.maxSupply) : undefined,
      });
      
      alert('ChronoStamp event created successfully!');
      
      // Reset form
      setFormData({ name: '', description: '', eventDate: '', maxSupply: '' });
      setImageFile(null);
      setImagePreview('');
      onPreviewUpdate({ name: '', description: '', imageUrl: '' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      alert('Failed to create event: ' + (error as Error).message);
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
      <CardContent className="space-y-6">
        {/* Event Name */}
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
            Event Name *
          </label>
          <Input
            id="eventName"
            placeholder="e.g., DevConf 2024"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={ui.isLoading}
          />
        </div>

        {/* Event Description */}
        <div>
          <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Event Description *
          </label>
          <Textarea
            id="eventDescription"
            placeholder="Describe your event and what makes it special..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={ui.isLoading}
            rows={3}
          />
        </div>

        {/* Event Image */}
        <div>
          <label htmlFor="eventImage" className="block text-sm font-medium text-gray-700 mb-2">
            Event Artwork *
          </label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={ui.isLoading}
            >
              {imageFile ? 'Change Image' : 'Upload Image'}
            </Button>
            {imageFile && (
              <span className="text-sm text-gray-600">
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
              <img
                src={imagePreview}
                alt="Event preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Date & Time
          </label>
          <DatePicker
            value={formData.eventDate}
            onChange={(value) => handleInputChange('eventDate', value)}
            disabled={ui.isLoading}
            placeholder="Select event date and time"
          />
          <p className="text-xs text-gray-500 mt-1">
            When will your event take place?
          </p>
        </div>

        {/* Max Supply */}
        <div>
          <label htmlFor="maxSupply" className="block text-sm font-medium text-gray-700 mb-2">
            Max Supply (Optional)
          </label>
          <Input
            id="maxSupply"
            type="number"
            placeholder="e.g., 500"
            value={formData.maxSupply}
            onChange={(e) => handleInputChange('maxSupply', e.target.value)}
            disabled={ui.isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty for unlimited supply
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={ui.isLoading || !user.isConnected || !formData.name || !formData.description || !imageFile}
            className="w-full"
            size="lg"
          >
            {ui.isLoading ? ui.loadingMessage : 'Create ChronoStamp Event'}
          </Button>
          
          {!user.isConnected ? (
            <p className="text-sm text-gray-500 text-center mt-3">
              Connect your wallet to create events
            </p>
          ) : (!formData.name || !formData.description || !imageFile) ? (
            <p className="text-sm text-gray-400 text-center mt-3">
              Fill in all required fields to continue
            </p>
          ) : (
            <p className="text-sm text-green-600 text-center mt-3">
              ✓ Ready to create your event!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}