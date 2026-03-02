export interface Shop {
  _id: string;
  ownerId: string;
  name: string;
  location: Location;
  category: string;
  status: 'ACTIVE' | 'PENDING';
}

export interface Location {
  floor: string;
  shopNumber: string;
}
