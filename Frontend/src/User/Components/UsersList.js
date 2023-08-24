import Card from "../../Shared/Components/UIElements/Card";
import UserItem from "./UserItem";
import styles from "./UsersList.module.css";

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No Users Found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className={styles.usersList}>
      {props.items.map((item) => (
        <UserItem
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.image}
          placeCount={item.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
