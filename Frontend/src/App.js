import { Routes, Route, Navigate } from "react-router-dom";
import Users from "./User/Pages/Users";
import MainNavigation from "./Shared/Components/Navigation/MainNavigation";
import AuthContext from "./Shared/Context/auth-context";
import React, { useContext, Suspense } from "react";
import LoadingSpinner from "./Shared/Components/UIElements/LoadingSpinner";

const Places = React.lazy(() => import("./Places/Pages/NewPlaces"));
const UserPlaces = React.lazy(() => import("./Places/Pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./Places/Pages/UpdatePlace"));
const Authenticate = React.lazy(() => import("./User/Pages/Authenticate"));

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="/places/new" element={<Places />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Authenticate />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </>
  );
}

export default App;
