import { useEffect, useState } from "react";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import UsersList from "../Components/UsersList";
import useHttp from "../../Shared/Hooks/http-hook";

const Users = () => {
  const [users, setUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const fetchUsersHandler = async () => {
      const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/users"
      );
      setUsers(data.users);
    };
    fetchUsersHandler().catch((err) => {
      console.log(err);
    });
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner onOverlay />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </>
  );
};

export default Users;
