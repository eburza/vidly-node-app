export interface IGenre {
  _id?: string;
  name: string;
}

export interface ICustomer {
  _id?: string;
  name: string;
  isGold: boolean;
  phone: string;
}

export interface IMovie {
  _id?: string;
  title: string;
  genre: IGenre;
  numberInStock: number;
  dailyRentalRate: number;
}

export interface IRental {
  _id?: string;
  customer: ICustomer;
  movie: IMovie;
  dateOut: Date;
  dateReturned?: Date;
  rentalFee?: number;
}