export interface Order {
       id: number,
       shipping_address: ShippingAddress[]
       uniqId :  string,
       items : OrderItem[],
       created_at : string,
       updated_at : string,
       status: 'processing' | 'pending' | 'shipped' | 'delivered' | 'cancelled';  
       total_price : string,
       tax : string,
       shipping_cost: string;
       payment_status: boolean;
       user: number,

}


export interface OrderItem {
  id: number;
  product: {
    name: string;
    price: string;
  };
  image: string;
  color: string | null;
  size: string;
  order: number;
  user : number;
  sku : string;
  quantity: number;
  unit_price: string;
  
}

export interface ShippingAddress{
  id: number,
  firstName : string,
  lastName : string,
  address : string,
  apartment : string,
  city : string,
  country: string,
  state : string,
  phone: string,
  saveInfo : boolean,
  shipping_method : string,
  order : number
  postalCode :string
  trackingNumber: "1Z999AA1234567890",

}





interface User {
  id : number,
  username : string,
  email : string


}

