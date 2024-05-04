import { createSlice } from "@reduxjs/toolkit";



export interface Review {
    _id:string;
    username: string;
    rating: number;
    content: string;
    date:Date;
    reply:Array<string>
  }

//represents the structure of vendor data
export interface VendorData{
    name: string;
    vendor_type:string   
    email:string;
    _id : string;
    city:string;
    mobile:number;
    coverpicUrl:string;
    logoUrl:string;
    reviews:Array<Review>;
    notifications:Array<object>;
    bookedDates:Array<string>;
    totalBooking:number;
    OverallRating:number;
}

export interface VendorState{
    isVendorSignedIn: boolean;
    vendordata : VendorData | null;
}
const initialState : VendorState ={
    vendordata:null,
    isVendorSignedIn:false
}

const vendorSlice =createSlice({
    name:'vendor',
    initialState,
    reducers:{

        setVendorInfo:(state,action)=>{
            state.vendordata =action.payload  
            state.isVendorSignedIn=true          
        },       
        logout:(state)=>{
            state.vendordata=null;   
            state.isVendorSignedIn=false         
        }


    }
})

export const {setVendorInfo,logout} = vendorSlice.actions
export default vendorSlice.reducer;


