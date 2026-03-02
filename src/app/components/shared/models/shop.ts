export interface Shop {
  _id: string;
  ownerId: string;
  name: string;
  location: Location;
  category: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface Location {
  floor: string;
  shopNumber: string;
}
