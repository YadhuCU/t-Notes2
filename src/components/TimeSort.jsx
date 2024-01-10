/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { formattedDate } from "../utils/formatter";
import { getAllFoldersAPI, getAllNoteAPI } from "../services/allAPIs";
import { addFoldersToStore } from "../redux/addFolderSlice";
import { addNotesToStore } from "../redux/addNoteSlice";

export const TimeSort = ({ type }) => {
  const allList = useRef(null);
  const dispatch = useDispatch();

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
      const { data } = await getAllFoldersAPI();
      if (data.length > 0 && selection === "Todays") {
        // sort the folder datas
        const newData = data.filter((item) => item.date === currentDate);
        // result
        dispatch(addFoldersToStore(newData));
      } else if (data.length > 0 && selection === "This Month") {
        // sort the folder datas
        const newData = data.filter((item) => {
          const currMonth = currentDate.split("/")[0];
          const folderMonth = item.date.split("/")[0];
          return currMonth === folderMonth;
        });
        // result
        dispatch(addFoldersToStore(newData));
      } else if (data.length > 0 && selection === "All") {
        dispatch(addFoldersToStore(data));
      }
    } else if (type === "note") {
      const { data } = await getAllNoteAPI();
      if (data.length > 0 && selection === "Todays") {
        // sort the folder datas
        const newData = data.filter((item) => item.date === currentDate);
        // result
        dispatch(addNotesToStore(newData));
      } else if (data.length > 0 && selection === "This Month") {
        // sort the folder datas
        const newData = data.filter((item) => {
          const currMonth = currentDate.split("/")[0];
          const folderMonth = item.date.split("/")[0];
          return currMonth === folderMonth;
        });
        // result
        dispatch(addNotesToStore(newData));
      } else if (data.length > 0 && selection === "All") {
        dispatch(addNotesToStore(data));
      }
    }
  };
  return (
    <ul
      ref={allList}
      className="my-4 flex justify-center lg:justify-start gap-8 md:gap-14 border-b py-2 w-full"
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
