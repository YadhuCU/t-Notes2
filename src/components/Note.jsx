import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IoMdTimer } from "react-icons/io";
import { BsCalendar2DateFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import {
  addToArchiveAPI,
  addToTrashAPI,
  deleteNoteAPI,
  getAllArchiveAPI,
  getAllFoldersAPI,
  getAllNoteAPI,
  getAllTrashAPI,
  getSingleFolderAPI,
  getSingleNoteAPI,
  removeFromArchiveAPI,
  removeFromTrashAPI,
  updateFolderAPI,
  updateNoteAPI,
  uploadNoteAPI,
} from "../services/allAPIs";
import { addNotesToStore } from "../redux/addNoteSlice";
import { AddNote } from "./AddNote";
import { addArchivesToStore } from "../redux/addArchiveSlice";
import { addFoldersToStore } from "../redux/addFolderSlice";
import { addTrashToStore } from "../redux/addTrashSlice";
import PropTypes from "prop-types";

export const Note = ({ data, trash, archive, folderId }) => {
  const dispatch = useDispatch();
  const textAreaRef = useRef(null);
  const [height, setHeight] = useState(0);

  // MUI thingssss
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    const scrollAreaHeight = textAreaRef.current.scrollHeight;
    setHeight(`${scrollAreaHeight}px`);
  }, []);

  const handleDeleteNote = async (noteId) => {
    // note in the  folder
    if (folderId) {
      const { data } = await getSingleFolderAPI(folderId);
      const newFolderNote = data.notes.filter((item) => item.id != noteId);
      const newData = { ...data, notes: newFolderNote };
      await updateFolderAPI(folderId, newData);
      try {
        const { data } = await getAllFoldersAPI();
        dispatch(addFoldersToStore([...data].reverse()));
      } catch (error) {
        console.error("Error", error);
      }
      // note in the trash
    } else if (trash) {
      try {
        await removeFromTrashAPI(noteId);
        const { data } = await getAllTrashAPI();
        dispatch(addTrashToStore(data));
      } catch (error) {
        console.error("Deletion ", error);
      }
    } else {
      try {
        const { data } = await getSingleNoteAPI(noteId);
        await addToTrashAPI(data);
        await deleteNoteAPI(noteId);
      } catch (error) {
        console.error("Deletion API error: ", error);
      }
      // deleting the note also from the Archive
      //TODO: fetch allArchiveNote and check if it's there
      //TODO: if YES, make deletea archive api call

      //1.
      try {
        const { data } = await getAllArchiveAPI();
        const archiveNote = data.find((item) => item.id == noteId);
        if (archiveNote) {
          await removeFromArchiveAPI(noteId);
        }
      } catch (error) {
        console.error("Error : ", error);
      }

      const { data } = await getAllNoteAPI();
      dispatch(addNotesToStore([...data].reverse()));
    }
    handleClose();
  };

  const handleDragStart = (event, note) => {
    event.dataTransfer.setData("note", JSON.stringify(note));
  };

  const handleAddToArchive = async (note) => {
    // if the note in Archive page
    if (archive) {
      // remove from the archive and update the store
      // remove from archive db
      await removeFromArchiveAPI(note.id);
      // change the value 'archive' in note db
      const singleNote = await getSingleNoteAPI(note.id);

      const newSinlgeNote = {
        ...singleNote.data,
        archive: false,
      };
      await updateNoteAPI(note.id, newSinlgeNote);

      // updating the store of Archive
      const { data } = await getAllArchiveAPI();
      dispatch(addArchivesToStore([...data].reverse()));
    } else {
      // in other pages
      const { data } = await getAllArchiveAPI();
      const isArchived = data.find((item) => item.id == note.id);
      if (isArchived) {
        await removeFromArchiveAPI(note.id);
        // change the value 'archive' in note db
        const singleNote = await getSingleNoteAPI(note.id);

        const newSinlgeNote = {
          ...singleNote.data,
          archive: false,
        };
        await updateNoteAPI(note.id, newSinlgeNote);
        // updating the store
        try {
          const { data } = await getAllNoteAPI();
          dispatch(addNotesToStore([...data].reverse()));
        } catch (error) {
          console.error("Error: ", error);
        }
        try {
          const { data } = await getAllArchiveAPI();
          dispatch(addArchivesToStore([...data].reverse()));
        } catch (error) {
          console.error("Error: ", error);
        }
      } else {
        // fetchinge singe note to update the 'archive' field
        const singleNote = await getSingleNoteAPI(note.id);
        const newSinlgeNote = {
          ...singleNote.data,
          archive: true,
        };
        await updateNoteAPI(note.id, newSinlgeNote);
        // adding note to archive db
        await addToArchiveAPI(newSinlgeNote);
        // updating the store
        try {
          const { data } = await getAllNoteAPI();
          dispatch(addNotesToStore([...data].reverse()));
        } catch (error) {
          console.error("Error: ", error);
        }
        try {
          const { data } = await getAllArchiveAPI();
          dispatch(addArchivesToStore([...data].reverse()));
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    }
    handleClose();
  };

  // restoring note
  const handleRestoreNote = async (note) => {
    handleDeleteNote(note?.id);
    try {
      await uploadNoteAPI({
        ...note,
        archive: false,
      });
    } catch (error) {
      console.error("Restore Error: ", error);
    }
  };

  return (
    <div
      draggable
      onDragStart={(event) => handleDragStart(event, data || {})}
      style={{
        backgroundColor: data.color,
      }}
      className="hover:shadow-2xl transition duration-250 ease-out break-inside-avoid rounded-[20px] p-5 flex flex-col gap-5 mb-5 max-w-sm mx-auto"
    >
      <div className="flex justify-between items-center">
        <div
          style={{ fontSize: "1.2rem" }}
          className="flex gap-2 items-center opacity-50"
        >
          <BsCalendar2DateFill />
          <p className="font-normal text-sm ">{data?.date}</p>
        </div>
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {trash && (
              <MenuItem onClick={() => handleRestoreNote(data)}>
                restore
              </MenuItem>
            )}
            {trash || archive || (
              <MenuItem>
                <AddNote
                  handlCloseEditMenu={handleClose}
                  currentNote={data}
                  entry={"edit"}
                />
              </MenuItem>
            )}
            {archive || (
              <MenuItem onClick={() => handleDeleteNote(data?.id)}>
                {trash ? "delete" : folderId ? "remove" : "move to trash"}
              </MenuItem>
            )}
            {trash || (
              <MenuItem onClick={() => handleAddToArchive(data)}>
                {data?.archive ? "unarchive" : "archive"}
              </MenuItem>
            )}
          </Menu>
        </div>
      </div>
      <h3 className="text-xl py-2 font-normal tracking-wider border-b border-slate-400 border-bottom">
        {data?.title}
      </h3>
      <textarea
        // className="text-base leading-7 tracking-wider text-left  font-normal opacity-70"
        // style={{ wordWrap: "break-word" }}
        ref={textAreaRef}
        className="note-textarea w-full text-base leading-7 font-normal opacity-70 bg-transparent border-none outline-none "
        style={{
          height: height,
        }}
        readOnly
        value={data?.body}
      />
      <div
        style={{ fontSize: "1.5rem" }}
        className="flex gap-2 items-center opacity-50"
      >
        <IoMdTimer />
        <p className="font-bold text-xs ">
          {data?.time} {data?.day}
        </p>
      </div>
    </div>
  );
};

Note.propTypes = {
  data: PropTypes.object,
  trash: PropTypes.bool,
  archive: PropTypes.bool,
  folderId: PropTypes.number,
};
