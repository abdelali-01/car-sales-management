export interface ProductItem  {
  product: string;
  quantity: number;
  price: number;
  image? : string | File;
}


export interface NotebookItem {
  _id? : string ;
  products : ProductItem[];
  total : number ;
  prePayment : number ;
  date?: Date | string;
  paid: boolean;
  paidDate?: Date | string;
}

export interface Notebook {
  _id: string; // Mongoose adds _id to each document
  client: {
    id: string; // ObjectId as string
    username: string;
    phone: string
  };
  table: NotebookItem[];
  total: number;
  prePayment: number;
  createdAt: string | Date; // from timestamps
  updatedAt: string | Date; // from timestamps
}

