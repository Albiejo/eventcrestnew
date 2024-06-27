import {
  Avatar,
  Button, Card, CardBody, CardFooter, CardHeader, Chip, Input, Typography
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { axiosInstanceAdmin } from "../../../Api/axiosinstance";
import { useLocation, useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { logout, setUserInfo } from "../../../Redux/slices/UserSlice";
import { useDispatch } from "react-redux";
import { UserData } from "../../../Types/userType";
import { ADMINROUTES } from "../../../Constants/constants";




const TABLE_HEAD = ["User", "Phone", "Status", "Action"];

const UsersTable=()=> {


  const [users, setUsers] = useState<UserData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {

    const queryParams = new URLSearchParams(location.search);
    const pageParam = queryParams.get("page");
    const searchParam = queryParams.get("search");
  
    setPage(pageParam ? parseInt(pageParam, 10) : 1);
    setSearch(searchParam? searchParam: "");

    fetchData(pageParam, searchParam);

  }, [location.search   ]);

  

  const fetchData = (pageParam?: string | null, searchParam?: string | null)=>{
    axiosInstanceAdmin
    .get(`/users?page=${pageParam || page}&search=${searchParam || search}`)
    .then((response) => {
      setUsers(response.data.users);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
  };


  const handleBlock=(userId:string)=>{
    axiosInstanceAdmin.patch(`/block-unblock?userId=${userId}`)
      .then((response) => {
        dispatch(setUserInfo(response.data.User))
        dispatch(logout());
        toast.success(response.data.message)
        fetchData()
        navigate("/admin/users");
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }


  const handleSearch = () => {
    navigate(`/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
  };


  return (
    <Card
      className="h-full w-full"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="mb-2 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Adjusted for smaller screens */}
          <div>
            <Typography
              variant="h5"
              color="blue-gray"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              Users list
            </Typography>
            <Typography
              color="gray"
              className="mt-1 font-normal"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              See information about all members
            </Typography>
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              name="search"
              value={search}
              color="black"
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleSearch}
              crossOrigin={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody
        className="overflow-x-scroll px-0"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => {
                const classes = "p-4";

                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={
                           user.image?user.image: '/imgs/head.png' 
                          }
                          
                          size="sm"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {user.email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {user.phone}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={user.isActive ? "active" : "Blocked"}
                          color={user.isActive ? "green" : "red"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      {user.isActive ? (
                        <Button
                          onClick={() => handleBlock(user._id)}
                          size="sm"
                          className="hidden lg:inline-block w-30 bg-blue-700"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <span>Block</span>
                        </Button>
                      ) : (
                        <Button
                         
                          onClick={() => handleBlock(user._id)}
                          size="sm"
                          className="hidden lg:inline-block w-30 bg-red-700"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <span>Unblock</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardBody>

      <CardFooter
        className="flex flex-col md:flex-row items-center justify-between border-t border-blue-gray-50 p-4"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Typography
          variant="small"
          color="blue-gray"
          className="font-normal"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Page {page} of 10
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            color="pink"
            onClick={() => {
              const nextPage = page - 1 > 0 ? page - 1 : 1;
              navigate(`${ADMINROUTES.ADMIN_USERS}?page=${nextPage}&search=${search}`);
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Previous
          </Button>

          <Button
            variant="outlined"
            size="sm"
            color="pink"
            onClick={() => {
              const nextPage = page + 1 <= 10 ? page + 1 : 10;
              navigate(`${ADMINROUTES.ADMIN_USERS}?page=${nextPage}&search=${search}`);
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
  

  export default UsersTable