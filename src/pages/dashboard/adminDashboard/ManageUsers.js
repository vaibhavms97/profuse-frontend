import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  blockUserRequest,
  getUsersRequest,
} from "../../../services/adminService";
import {
  TrashIcon,
  NoSymbolIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "material-react-toastify";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";

export default function ManageUsers() {
  const [usersList, setUsersList] = useState([]);
  const [users, setUsers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getUsersRequest(1)
      .then((res) => {
        setUsersList(res.data.data.users.docs);
        setUsers(res.data.data.users);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function handleBlock(user, index) {
    blockUserRequest({ _id: user._id }).then((res) => {
      if (res.data.status === 200) {
        toast.success("User blocked successfully");
        const modifiedUsersList = [...usersList];
        modifiedUsersList[index].status = !modifiedUsersList[index].status;
        setUsersList(modifiedUsersList);
      }
    });
  }

  function handleDelete() {}

  function handlePageChange(pageNo) {
    setIsLoading(true);
    getUsersRequest(pageNo)
      .then((res) => {
        setUsersList(res.data.data.users.docs);
        setUsers(res.data.data.users);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      {isLoading && <Loader/>}
      <Box sx={{ pl: "240px" }}>
        <Box m={4}>
          <Box>
            <Typography variant="h4">Manage Users</Typography>
          </Box>
          {usersList.length === 0 && (
            <Typography>Sorry, No users availabe</Typography>
          )}
          {usersList.length !== 0 && (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell style={{ width: "10px" }}>Block</TableCell>
                    {/* <TableCell style={{ width: "10px" }}>Delete</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersList.map((user, index) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.status ? "Active" : "Blocked"}
                      </TableCell>
                      <TableCell>
                        {user.status ? (
                          <Tooltip title="Block">
                            <NoSymbolIcon
                              style={{ width: "30px", height: "30px" }}
                              color="#4848e9"
                              onClick={() => handleBlock(user, index)}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Unblock">
                            <MinusCircleIcon
                              style={{ width: "30px", height: "30px" }}
                              color="#4848e9"
                              onClick={() => handleBlock(user, index)}
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      {/* <TableCell>
                        <Tooltip title="Delete">
                          <TrashIcon
                            style={{ width: "30px", height: "30px" }}
                            color="#4848e9"
                            onClick={() => handleDelete(user, index)}
                          />
                        </Tooltip>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {!isLoading && (
            <Pagination
              currentPage={users.page}
              totalPages={users.totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
