import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IoMdTimer } from "react-icons/io";
import { TfiHandDrag } from "react-icons/tfi";
import { BsCalendar2DateFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  addNoteToArchiveFirebase,
  addNoteToFirebase,
  deleteNoteFromFirebase,
  fetchNotesFromFirebase,
  removeNoteFromArchiveFirebase,
} from "../redux/addNoteSlice";
import { AddNote } from "./AddNote";
import {
  getAllFoldersFromFirebase,
  updateFolderInFirebase,
} from "../redux/addFolderSlice";
import {
  addNoteToTrashFirebase,
  deleteNoteFromTrashFirebase,
  getNotesFromTrashFirebase,
} from "../redux/addTrashSlice";
import PropTypes from "prop-types";

export const Note = ({ data, trash, archive, folderId }) => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.folder);
  const [drag, setDrag] = useState(true);

  // MUI thingssss
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDeleteNote = async (noteId) => {
    // note in the  folder
    if (folderId) {
      const currentFolder = folders.find((item) => item.id == folderId);
      const newNote = currentFolder.notes.filter((itemId) => itemId != noteId);

      const newFolder = {
        ...currentFolder,
        notes: [...newNote],
      };

      dispatch(updateFolderInFirebase({ id: folderId, folder: newFolder }));
      dispatch(getAllFoldersFromFirebase());

      // note in the trash
    } else if (trash) {
      dispatch(deleteNoteFromTrashFirebase(noteId));
      dispatch(getNotesFromTrashFirebase());
    } else {
      // delete note from firebase db 'notes'

      const updatedNote = {
        body: data.body,
        date: data.date,
        time: data.time,
        day: data.day,
        color: data.color,
        archive: data.archive,
      };
      dispatch(addNoteToTrashFirebase(updatedNote));
      dispatch(deleteNoteFromFirebase(noteId));
      dispatch(fetchNotesFromFirebase());
    }
    handleClose();
  };

  const handleDragStart = (event, note) => {
    event.dataTransfer.setData("note", JSON.stringify(note));
  };

  const handleAddToArchive = async (note) => {
    // firebase

    if (note.archive) {
      dispatch(removeNoteFromArchiveFirebase({ id: note.id, note: note }));
      if (archive) {
        dispatch(fetchNotesFromFirebase());
      }
    } else {
      dispatch(addNoteToArchiveFirebase({ id: note.id, note: note }));
    }

    handleClose();
  };

  // restoring note
  const handleRestoreNote = async (note) => {
    const updatedNote = {
      body: note.body,
      date: note.date,
      time: note.time,
      day: note.day,
      color: note.color,
      archive: note.archive,
    };
    dispatch(addNoteToFirebase(updatedNote));
    dispatch(deleteNoteFromTrashFirebase(note.id));
    dispatch(getNotesFromTrashFirebase());
  };

  return (
    <div
      draggable={drag}
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
      <div
        dangerouslySetInnerHTML={{ __html: data?.body }}
        className="w-full opacity-70 bg-transparent"
      ></div>
      <div
        style={{ fontSize: "1.5rem" }}
        className="flex gap-2 items-center opacity-50"
      >
        <IoMdTimer />
        <p className="font-bold text-xs ">
          {data?.time} {data?.day}
        </p>
        <div
          onClick={() => setDrag((prev) => !prev)}
          title="draggable"
          className={`ml-auto rounded-full p-2 cursor-pointer ${
            drag || "opacity-30"
          }`}
        >
          <TfiHandDrag />
        </div>
      </div>
    </div>
  );
};

Note.propTypes = {
  data: PropTypes.object,
  trash: PropTypes.bool,
  archive: PropTypes.bool,
  folderId: PropTypes.string,
};
