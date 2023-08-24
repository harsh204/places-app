import PlaceList from "../Components/PlaceList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useHttp from "../../Shared/Hooks/http-hook";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const params = useParams();
  const userId = params.userId;
  const [userPlaces, setUserPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const fetchUserPlacesHandler = async () => {
      try {
        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`
        );
        setUserPlaces(data.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserPlacesHandler();
  }, [sendRequest]);

  const deleteHandler = (deletedPlaceId) => {
    setUserPlaces((prevState) =>
      prevState.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userPlaces && (
        <PlaceList places={userPlaces} onDelete={deleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
