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

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export interface IAuth {
  email: string;
  password: string;
}

//declare a global namespace for the request object
//to extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}