import { Coordinates } from "./coordinates.type"

export type GeocodedLocation = {
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string,
    fullAddress: string,
    coordinates: Coordinates
}