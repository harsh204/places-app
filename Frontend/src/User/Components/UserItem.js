import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../Shared/Components/UIElements/Avatar";
import Card from "../../Shared/Components/UIElements/Card";
import classes from "./UserItem.module.css";

const UserItem = (props) => {
  return (
    <li className={classes["user-item"]}>
      <Card className="user-item__content" style={{ padding: 0 }}>
        <Link to={`/${props.id}/places`}>
          <div className={classes["user-item__image"]}>
            <Avatar
              image={
                process.env.REACT_APP_ASSET_URL +
                `/${props.image}`
              }
              alt={props.name}
            />
          </div>
          <div className={classes["user-item__info"]}>
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
