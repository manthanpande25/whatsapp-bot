export interface IOrganization {
  id?: string;

  businessName: string;
  businessType: string;

  email: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;

  timezone: string;

  workingHours: {
    start: string;
    end: string;
  };

  logo?: string;

  createdAt?: any;
  updatedAt?: any;
}