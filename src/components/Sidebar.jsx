import { HiDocumentAdd } from "react-icons/hi";
import { FaArchive } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaFolder } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="sidebar h-screen ">
      <div
        style={{ top: "50%", transform: "translateY(-50%)" }}
        className="flex rounded-[20px]  shadow-2xl flex-col fixed  justify-center md:px-[2rem] gap-[7vh]  p-2"
      >
        <div className="flex p-3 transition duration-250 ease-out hover:bg-slate-100 text-lime-400 rounded-full items-center cursor-pointer justify-center gap-2 text-lg">
          <Link to="/">
            <FaHome title="Home" style={{ fontSize: "1.7rem" }} />
          </Link>
        </div>
        {true || (
          <div className="flex transition duration-250 ease-out  p-3 hover:bg-slate-100 text-purple-400 rounded-full items-center cursor-pointer justify-center gap-2 text-lg">
            <HiDocumentAdd title="Add Note" style={{ fontSize: "1.7rem" }} />
          </div>
        )}
        <div className="flex transition duration-250 ease-out  p-3 hover:bg-slate-100 text-amber-400 rounded-full items-center cursor-pointer justify-center gap-2 text-lg">
          <Link to="/archive">
            <FaArchive title="Archive" style={{ fontSize: "1.3rem" }} />
          </Link>
        </div>
        <div className="flex transition duration-250 ease-out  p-3 hover:bg-slate-100 text-pink-400 rounded-full items-center cursor-pointer justify-center gap-2 text-lg">
          <Link to="/trash">
            <FaTrash title="Trash" style={{ fontSize: "1.3rem" }} />
          </Link>
        </div>
        <div className="flex transition duration-250 ease-out   p-3 hover:bg-slate-100 text-stone-400 rounded-full items-center cursor-pointer justify-center gap-2 text-lg">
          <Link to="/folders">
            <FaFolder title="Folders" style={{ fontSize: "1.3rem" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};
