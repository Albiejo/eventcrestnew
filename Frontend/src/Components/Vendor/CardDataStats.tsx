import React, { ReactNode } from "react";

interface CardDataStatsProps {
  title: string;
  value: number | undefined;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  value,
  children,
}) => {
  return (
    <div className=" mb-6 mr-6 flex justify-between rounded-sm border border-stroke bg-blue-900 py-6 px-7.5 shadow-default border-2 border-gray-900 mr-4 mt-8">
      <div className=" ml-2 flex h-11.5 w-20 items-center justify-between rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
          <h4 className="text-lg ml-3 text-title-md  text-white dark:text-white w-full">
            {title}
          </h4>
          <h4 className="ml-10 text-lg text-title-md font-bold text-white dark:text-white">
            {value}
          </h4>
       
      </div>
    </div>
  );
};

export default CardDataStats;