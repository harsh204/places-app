import PlaceItem from "./PlaceItem";
import styles from "./PlaceList.module.css";
import Card from "../../Shared/Components/UIElements/Card";
import Button from "../../Shared/Components/FormElements/Button";

const PlaceList = (props) => {
  if (props.places.length === 0) {
    return (
      <div className={`${styles["place-list"]} center`}>
        <Card>
          <h2>No Places Found. Maybe Create One?</h2>
          <Button to="/places/new" >Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className={styles["place-list"]}>
      {props.places.map((place) => (
        <PlaceItem
          id={place.id}
          key={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creatorId}
          coordinates={place.location}
          onDelete={props.onDelete}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
