export interface product{
    id:number;
    title:string;
    price:number;
    thumbnail?:string;
}

export interface productResponse{
    products:product[];
    total:number;
    skip:number;
    limit:number;
}