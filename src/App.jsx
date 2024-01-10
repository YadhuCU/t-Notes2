import { Route, Routes } from "react-router-dom";
import "./App.css";
import Archive from "./pages/Archive";
import Home from "./pages/Home";
import Trash from "./pages/Trash";
import AllFolders from "./pages/AllFolders";
import { Sidebar } from "./components/Sidebar";
import CommonPage from "./pages/CommonPage";
import { useSelector } from "react-redux";

function App() {
  const { folders } = useSelector((state) => state.folder);

  return (
    <div className="grid-app">
      <Sidebar />
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"/archive"} element={<Archive />} />
        <Route path={"/trash"} element={<Trash />} />
        <Route path={"/folders"} element={<AllFolders />} />
        {folders?.length > 0 &&
          folders?.map((item, index) => (
            <Route
              key={index}
              path={`/folders/${item?.id}`}
              element={<CommonPage id={item?.id} pageTitle={item?.title} />}
            />
          ))}
      </Routes>
    </div>
  );
}

export default App;
