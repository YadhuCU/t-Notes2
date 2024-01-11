/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Note } from "../components/Note";
import { TimeSort } from "../components/TimeSort";
import { useEffect, useState } from "react";
import { getSingleFolderAPI } from "../services/allAPIs";
import { useSelector } from "react-redux";

const CommonPage = ({ pageTitle, id }) => {
  const [currNotes, setCurrNotes] = useState([]);
  const { folders } = useSelector((state) => state.folder);
  const { notes } = useSelector((state) => state.note);

  useEffect(() => {
    const currentFolder = folders.find((item) => item.id == id);
    const currentNotes = [];
    currentFolder.notes.forEach((currNoteId) => {
      const singleNote = notes.find((note) => note.id == currNoteId);
      if (singleNote) {
        currentNotes.push(singleNote);
      }
    });

    setCurrNotes(currentNotes);
  }, [folders, id, notes]);

  return (
    <div className=" container flex flex-col items-center lg:items-start px-2 py-4 mt-5">
      <h1 className="text-5xl">{pageTitle || "None"}</h1>
      <TimeSort type={"note"} />
      <div className="my-10 columns-1 gap-8 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
        {currNotes?.length > 0 &&
          currNotes?.map((item, index) => (
            <Note key={index} folderId={id} data={item} />
          ))}
      </div>
    </div>
  );
};

export default CommonPage;
