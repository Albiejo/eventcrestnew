import { SetStateAction, useState } from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import VendorPosts from "./VendorPosts";
import ReviewCard from "../ReviewCard";
import { Review } from "../../../Types/reviewType";



export default function VendorTabs({ reviews } : { reviews: Review[]  }) {


  const [activeTab, setActiveTab] = useState("images");

  const handleTabChange = (value: SetStateAction<string>) => {
    setActiveTab(value);
  };

  const data = [
    {
      label: "Images",
      value: "images",
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "Reviews",
      value: "reviews",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
  ];

  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      className="ml-20 mr-20 mb-20 z-0"
    >

      <TabsHeader placeholder={undefined}  className="z-0 bg-gray-500">
        {data.map(({ label, value }) => (
          <Tab key={value} value={value} placeholder={undefined}>
            {label}
          </Tab>
        ))}
      </TabsHeader>

      <TabsBody placeholder={undefined}>
        
        {data.map(({ value }) => (
          <TabPanel key={value} value={value}>
            
            
            {value === "images" && <VendorPosts />}
            
          

            {value === 'reviews' && ( 
                <div className="grid grid-cols-1 gap-4">
                  {reviews?.length === 0 ? (
                    <p className="text-center text-gray-500">No reviews yet!</p>
                  ) : (
                    reviews.map((review, index) => (
                      <div key={index} className="border-2 border-blue-600 bg-gray-200 rounded-md p-4">
                        <ReviewCard {...review} />
                        {review.reply && review.reply.length > 0 && (
                          <div className="ml-8">
                            {review.reply.map((reply, replyIndex) => (
                              <div key={replyIndex} className="bg-gray-300 p-2 rounded-md mb-2">
                                <p style={{color:'black'}}> replied : {reply}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
            )}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
}
