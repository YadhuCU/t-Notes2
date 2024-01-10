import { AddNote } from "./AddNote";
import { Note } from "./Note";
import { TimeSort } from "./TimeSort";
import { getAllNoteAPI } from "../services/allAPIs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotesToStore } from "../redux/addNoteSlice";

export const Notes = () => {
  const { notes } = useSelector((state) => state.note);
  const dispatch = useDispatch();

  const getData = async () => {
    const { data } = await getAllNoteAPI();
    dispatch(addNotesToStore([...data].reverse()));
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className=" container flex flex-col items-center lg:items-start px-2 py-4 mt-5">
      <h1 className="text-5xl">Notes</h1>
      <TimeSort type="note" />
      <div className="w-full my-10 columns-[300px]">
        <AddNote />
        {notes?.map((item, index) => (
          <Note key={index} data={item} />
        ))}
      </div>
    </div>
  );
};
