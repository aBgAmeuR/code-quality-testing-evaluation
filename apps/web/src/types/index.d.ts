export interface User {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  created_at: Date;
  updated_at?: Date;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at?: Date;
}
