'use client';

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Card, CardContent } from './Card';

export interface AddressOption {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
}

export interface SelectedAddress {
  name: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: SelectedAddress) => void;
  placeholder?: string;
  className?: string;
  selectedAddress?: SelectedAddress | null;
  onClear?: () => void;
  onValidationError?: (message: string) => void;
}

export function AddressAutocomplete({
  onAddressSelect,
  placeholder = 'Search for event location...',
  className = '',
  selectedAddress,
  onClear,
  onValidationError,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionContainerRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Search for addresses using OpenStreetMap Nominatim API
  const searchAddresses = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          searchQuery,
        )}`,
        {
          headers: {
            'User-Agent': 'ChronoStamp/1.0',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to search addresses');
      }

      const data = (await response.json()) as AddressOption[];

      // Filter and sort results by importance
      const filteredData = data
        .filter((item) => item.lat && item.lon)
        .sort((a, b) => (b.importance || 0) - (a.importance || 0))
        .slice(0, 5);

      setSuggestions(filteredData);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Address search error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(false);

    // If user starts typing after having a selected address, clear the selection
    if (selectedAddress && value !== selectedAddress.name) {
      onClear?.();
    }

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      void searchAddresses(value);
    }, 300);
  };

  // Handle address selection
  const handleAddressSelect = (suggestion: AddressOption) => {
    const selectedAddress: SelectedAddress = {
      name: suggestion.display_name,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      placeId: suggestion.place_id,
    };

    onAddressSelect(selectedAddress);
    setQuery(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle clear selection
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (onClear) {
      onClear();
    }
    searchRef.current?.focus();
  };

  // Handle keyboard navigation and validation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      // If user presses Enter without selecting from suggestions, validate input
      if (e.key === 'Enter' && query.length > 0 && !selectedAddress) {
        e.preventDefault();
        validateUserInput();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      suggestionRefs.current[0]?.focus();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Validate user input when they try to submit without selecting from suggestions
  const validateUserInput = () => {
    if (!selectedAddress && query.length > 0) {
      const errorMessage =
        'Please select a location from the suggestions above. Manual text input is not supported for accuracy.';
      onValidationError?.(errorMessage);
    }
  };

  // Handle input blur to validate
  const handleBlur = () => {
    // Check if the blur is due to clicking on a suggestion
    // Use setTimeout to allow click events to complete first
    setTimeout(() => {
      // Only validate if we're not focusing on a suggestion button
      const activeElement = document.activeElement;
      const isClickingSuggestion = activeElement?.closest('[data-suggestion-button]');

      if (!selectedAddress && query.length > 0 && !showSuggestions && !isClickingSuggestion) {
        validateUserInput();
      }
    }, 150);
  };

  const handleSuggestionKeyDown = (e: React.KeyboardEvent, index: number, suggestion: AddressOption) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAddressSelect(suggestion);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, suggestions.length - 1);
      suggestionRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        searchRef.current?.focus();
      } else {
        suggestionRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchRef.current?.focus();
    }
  };

  // Click outside to close suggestions and cleanup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if clicking inside the input or suggestion container
      const clickedInsideInput = searchRef.current?.contains(target);
      const clickedInsideSuggestions = suggestionContainerRef.current?.contains(target);

      if (!clickedInsideInput && !clickedInsideSuggestions) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      // Cleanup timeout on unmount
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Show selected address if provided
  if (selectedAddress) {
    return (
      <div className={`relative ${className}`}>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium text-green-800">Selected Location</p>
                <p className="text-sm text-green-600">{selectedAddress.name}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-green-600 hover:text-green-700"
            >
              Change
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">📍</span>
        <Input
          ref={searchRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pl-10"
        />
        {isLoading && (
          <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 animate-pulse">🔄</span>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionContainerRef}>
          <Card className="absolute top-full z-50 mt-1 w-full shadow-lg">
            <CardContent className="p-0">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id}
                  ref={(el) => {
                    suggestionRefs.current[index] = el;
                  }}
                  data-suggestion-button="true"
                  type="button"
                  className="hover:bg-muted focus:bg-muted flex w-full items-start gap-3 p-3 text-left focus:outline-none"
                  onMouseUp={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddressSelect(suggestion);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onKeyDown={(e) => handleSuggestionKeyDown(e, index, suggestion)}
                >
                  <span className="text-muted-foreground mt-0.5">📍</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{suggestion.display_name}</p>
                    <p className="text-muted-foreground text-xs">
                      {suggestion.type} • {parseFloat(suggestion.lat).toFixed(4)},{' '}
                      {parseFloat(suggestion.lon).toFixed(4)}
                    </p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && query.length >= 3 && !isLoading && (
        <Card className="absolute top-full z-50 mt-1 w-full shadow-lg">
          <CardContent className="p-3">
            <p className="text-muted-foreground text-sm">No locations found. Try a different search term.</p>
            <p className="mt-1 text-xs text-orange-600">
              💡 You must select from search results - manual input is not supported
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
