import { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({currentPage, totalPages, handlePageChange }) {
  const [pagesArray, setPagesArray] = useState([]);

  useEffect(() => {
    const page = currentPage%10;
    let pages;
    if(page === 0) {
      pages = currentPage - page - 9
    } else {
      pages = currentPage - page + 1
    }
    const newPageArray = []
    if(pages < totalPages){
      for(let i = pages; i < pages+10; i++) {
        if(i <= totalPages) {
          newPageArray.push(i);
        }
      }
      setPagesArray(newPageArray)
    }
  },[])

  return (
    <>
      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" spacing={1} mt={4}>
          {pagesArray[0] - 10 > 0 && (
            <Box
              sx={{
                py: 2,
                px: 1.5,
                borderRadius: "4px",
                background: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick = {() => handlePageChange(pagesArray[0]-10)}
            >
              <ChevronLeftIcon style={{ width: "25px", height: "25px" }} />
            </Box>
          )}
          {pagesArray.map((page) => (
            <Box
              sx={{
                p: 2,
                background: page === currentPage ? "#4848e9" : "#e0e0e0",
                color: page === currentPage ? "#fff" : "#000",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick = {() => handlePageChange(page)}
            >
              {page}
            </Box>
          ))}
          {pagesArray[9] + 1 <= totalPages && (
            <Box
              sx={{
                py: 2,
                px: 1.5,
                borderRadius: "4px",
                background: "#e0e0e0",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick = {() => handlePageChange(pagesArray[0]+10)}
            >
              <ChevronRightIcon style={{ width: "25px", height: "25px" }} />
            </Box>
          )}
        </Stack>
      )}
    </>
  );
}
