import React, { useEffect, useState } from 'react';
import Script from "next/script"
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import getConfig from 'next/config';
const delay = (ms: number | undefined) => new Promise(
    resolve => setTimeout(resolve, ms)
);
const AutocompleteSearchInput = () => {
    const [address, setAddress] = useState('8800 Heritage Center Dr, Anchorage, AK 99504, USA');
    const { publicRuntimeConfig } = getConfig();
    const handleSelect = async (selectedAddress: string) => {
        const results = await geocodeByAddress(selectedAddress);
        const latLng = await getLatLng(results[0]);
        console.log('Selected address:', selectedAddress);
        console.log('Lat & Lng:', latLng);
    };
    useEffect(() => {
        ; <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${publicRuntimeConfig.googleMapApiKey}&libraries=places`}
        />
    }, [])
    return (
        <div>
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places...',
                                className: 'location-search-input',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {suggestions.map((suggestion) => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                return (
                                    <>
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                            })}
                                        >
                                            {suggestion.description}
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
            </div>
    );
};

export default AutocompleteSearchInput;
