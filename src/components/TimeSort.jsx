/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formattedDate } from "../utils/formatter";
import { getAllFoldersAPI, getAllNoteAPI } from "../services/allAPIs";
import {
  addFoldersToStore,
  getAllFoldersFromFirebase,
} from "../redux/addFolderSlice";
import { addNotesToStore, fetchNotesFromFirebase } from "../redux/addNoteSlice";

export const TimeSort = ({ type }) => {
  const allList = useRef(null);
  const dispatch = useDispatch();
  const { notes, notesClone } = useSelector((state) => state.note);
  const { folders, foldersClone } = useSelector((state) => state.folder);

  const handlActive = async (e) => {
    Array.from(allList.current.children).forEach((item) => {
      if (item.classList.contains("active")) {
        item.classList.remove("active");
      }
    });
    e.currentTarget.classList.add("active");

    const currentDate = formattedDate(new Date());
    const selection = e.currentTarget.innerText;

    // Sort the contents
    if (type === "folder") {
      // const { data } = await getAllFoldersAPI();
      if (foldersClone.length > 0 && selection == "Todays") {
        // sort the folder datas
        const newData = foldersClone.filter((item) => item.date == currentDate);
        // result
        dispatch(addFoldersToStore(newData));
      } else if (foldersClone.length > 0 && selection === "This Month") {
        // sort the folder datas
        const newData = foldersClone.filter((item) => {
          const currMonth = currentDate.split("/")[0];
          const folderMonth = item.date.split("/")[0];
          return currMonth == folderMonth;
        });
        // result
        dispatch(addFoldersToStore(newData));
      } else if (foldersClone.length > 0 && selection === "All") {
        dispatch(getAllFoldersFromFirebase());
      }
    } else if (type === "note") {
      if (notesClone.length > 0 && selection === "Todays") {
        const newData = notesClone.filter((item) => item.date === currentDate);
        dispatch(addNotesToStore(newData));
      } else if (notesClone.length > 0 && selection === "This Month") {
        const newData = notesClone.filter((item) => {
          const currMonth = currentDate.split("/")[0];
          const folderMonth = item.date.split("/")[0];
          return currMonth === folderMonth;
        });
        dispatch(addNotesToStore(newData));
      } else if (notesClone.length > 0 && selection === "All") {
        dispatch(fetchNotesFromFirebase());
      }
    }
  };
  return (
    <ul
      ref={allList}
      className="my-4 flex justify-center lg:justify-start gap-8 md:gap-14 border-b py-2 w-full"
      style={{ listStyle: "none" }}
    >
      {["All", "Todays", "This Month"].map((item) => (
        <li
          onClick={(e) => handlActive(e)}
          key={item}
          className={`cursor-pointer text-sm md:text-md relative ${
            item == "All" && "active"
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
