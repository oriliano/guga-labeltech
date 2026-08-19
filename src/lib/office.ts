/** Panelde girilen ofis kaydını tek satırlık adrese çevirir. */
export type Office = {
  street: string
  postalCode?: string | null
  district?: string | null
  city: string
  country: string
  mapUrl?: string | null
  label?: string | null
}

export const officeAddress = (office: Office) =>
  [office.street, [office.postalCode, office.district].filter(Boolean).join(' '), office.city, office.country]
    .filter(Boolean)
    .join(', ')

/** Panelde harita adresi girilmemişse adresten yol tarifi bağlantısı üretir. */
export const directionsUrl = (office: Office) =>
  office.mapUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(officeAddress(office))}`
