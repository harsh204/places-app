import styles from "./PlaceItem.module.css";
import Card from "../../Shared/Components/UIElements/Card";
import Button from "../../Shared/Components/FormElements/Button";
import { useState, useContext } from "react";
import Modal from "../../Shared/Components/UIElements/Modal";
import Map from "../../Shared/Components/UIElements/Map";
import AuthContext from "../../Shared/Context/auth-context";
import LoadingSpinner from "../../Shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../Shared/Components/UIElements/ErrorModal";
import useHttp from "../../Shared/Hooks/http-hook";

const PlaceItem = (props) => {
  const { userId, token } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const showMapHandler = () => {
    setShowMap(true);
  };

  const hideMapHandler = () => {
    setShowMap(false);
  };

  const showDeleteModalHandler = () => {
    setShowConfirmModal(true);
  };

  const hideDeleteModalHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
        "DELETE",
        { Authorization: "Bearer " + token }
      );

      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ErrorModal onClear={clearError} error={error} />
      <li>
        <Modal
          onCancel={hideMapHandler}
          header={props.address}
          show={showMap}
          contentClass={styles["place-item__modal-content"]}
          footerClass={styles["place-item__modal-actions"]}
          footer={<Button onClick={hideMapHandler}>CLOSE</Button>}
        >
          <div className={styles["map-container"]}>
            <h2>
              <Map center={props.coordinates} zoom={16} />
            </h2>
          </div>
        </Modal>
        <Modal
          onCancel={hideDeleteModalHandler}
          show={showConfirmModal}
          header="Delete Place?"
          footerClass={styles["place-item__modal-actions"]}
          footer={
            <>
              <Button inverse onClick={hideDeleteModalHandler}>
                CANCEL
              </Button>
              <Button danger onClick={confirmDeleteHandler}>
                DELETE
              </Button>
            </>
          }
        >
          <p>
            Are you sure you want to delete this place? The changes made will be
            permanent and cannot be undone!
          </p>
        </Modal>
        <Card
          className={styles["place-item__content"]}
          style={{ marginBottom: 20 }}
        >
          {isLoading && <LoadingSpinner asOverlay />}
          <div className={styles["place-item__image"]}>
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className={styles["place-item__info"]}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className={styles["place-item__actions"]}>
            <Button inverse onClick={showMapHandler}>
              VIEW ON MAP
            </Button>
            {userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {userId === props.creatorId && (
              <Button danger onClick={showDeleteModalHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
