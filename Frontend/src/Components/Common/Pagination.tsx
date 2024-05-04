import { Button } from '@material-tailwind/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}



const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  
  const handleClick = (pageNumber:number) => {
    onPageChange(pageNumber);
  };


  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          color={pageNumber === currentPage ? 'blue' : 'blue-gray'}
          className="mx-1 font-medium"
          onClick={() => handleClick(pageNumber)}
          placeholder={undefined}
        >
          {pageNumber}
        </Button>
      ))}
    </div>
  );
};

export default Pagination;
