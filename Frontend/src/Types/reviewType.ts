

export interface Review {
    _id: string;
    username: string;
    rating: number;
    content: string;
    date:Date;
    reply:Array<string>
  }