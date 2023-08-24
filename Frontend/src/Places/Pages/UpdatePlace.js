import { useParams, useNavigate } from "react-router-dom";
import Input from "../../Shared/Components/FormElements/Input";
import Button from "../../Shared/Components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../Shared/Util/validators";
import styles from "./PlaceForm.module.css";
import useForm from "../../Shared/Hooks/form-hook";
import { useEffect, useState, useContext } from "react";
import Card from "../../Shared/Components/UIElements/Card";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import useHttp from "../../Shared/Hooks/http-hook";
import AuthContext from "../../Shared/Context/auth-context";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const [foundPlace, setFoundPalace] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const navigate = useNavigate();
  const { userId, token } = useContext(AuthContext);
  const [formInput, inputHandler, setFormData] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    true
  );

  useEffect(() => {
    const fetchPlaceHandler = async () => {
      try {
        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`
        );

        setFoundPalace(data.place);

        setFormData({
          title: {
            value: foundPlace.title,
            isValid: true,
          },
          description: {
            value: foundPlace.description,
            isValid: true,
          },
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchPlaceHandler();
  }, [setFormData, placeId, sendRequest]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!foundPlace && !error) {
    return (
      <div className="center">
        <Card>
          <p>Sorry. No such place could be found!</p>
        </Card>
      </div>
    );
  }

  const placeUpdateHandler = async (event) => {
    event.preventDefault();

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${placeId}`,
        "PATCH",
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        JSON.stringify({
          title: formInput.inputs.title.value,
          description: formInput.inputs.description.value,
        })
      );
      navigate("/" + userId + "/places");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && foundPlace && (
        <form className={styles["place-form"]} onSubmit={placeUpdateHandler}>
          <Input
            id="title"
            element="input"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            value={foundPlace.title}
            errorText="Please enter a valid title!"
            onInput={inputHandler}
            valid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            value={foundPlace.description}
            errorText="Please enter a valid description (at least 5 characters long)!"
            onInput={inputHandler}
            valid={true}
          />
          <Button type="submit" disabled={!formInput.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
