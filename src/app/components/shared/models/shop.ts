export interface Shop {
  _id: string;
  ownerId: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
}
