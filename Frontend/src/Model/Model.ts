export default interface vendor {
    _id: string;
    name: string;
    email: string;
    phone: number;
    city:string;
    password:string;
    isActive: boolean;
    isVerified:boolean;
    verificationRequest:boolean;
    totalBooking:number;
}