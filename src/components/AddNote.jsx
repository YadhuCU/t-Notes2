/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useState } from "react";
import { FaFile } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
} from "@mui/material";

import { colors } from "../utils/colors";
import {
  getAllNoteAPI,
  updateNoteAPI,
  uploadNoteAPI,
} from "../services/allAPIs";
import { useDispatch } from "react-redux";
import { addNotesToStore } from "../redux/addNoteSlice";
import { formattedDate, formattedDay, formattedTime } from "../utils/formatter";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "20px",
  p: 4,
};

export const AddNote = ({ currentNote, entry, handlCloseEditMenu }) => {
  const [open, setOpen] = useState(false);
  const textAreaRef = useRef(null);
  const [textInput, setTextInput] = useState(currentNote?.title || "");
  const [textArea, setTextArea] = useState(currentNote?.body || "");
  const [color, setColor] = useState(currentNote?.color || "#f5f5f4");
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const openColor = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseColor = () => setAnchorEl(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      textAreaRef.current.focus();
    }
  };

  const handleTextInputChange = ({ value }) => setTextInput(value);
  const handleTextAreaChange = ({ value }) => setTextArea(value);
  const handleColorPick = (color) => setColor(color);

  const handleCancelButton = () => {
    setTimeout(() => {
      setColor("#f5f5f4");
      setTextInput("");
      setTextArea("");
    }, 1000);
    setOpen(false);
    if (currentNote) {
      handlCloseEditMenu();
    }
  };

  const handleUpload = async () => {
    handleCancelButton();
    if (!textInput && !textArea) return;
    currentNote && handleCancelButton();
    const date = formattedDate(new Date());
    const time = formattedTime(new Date());
    const day = formattedDay(new Date());
    let response;

    if (currentNote) {
      // update the existing note in server.
      const updatedNote = {
        ...currentNote,
        title: textInput,
        body: textArea,
        date,
        time,
        day,
        color: color,
      };

      try {
        response = await updateNoteAPI(currentNote.id, updatedNote);
      } catch (error) {
        console.error("Updation Error: ", error);
      }
      const { data } = await getAllNoteAPI();
      dispatch(addNotesToStore([...data].reverse()));
      handlCloseEditMenu();
    } else {
      // create new note and upload it to the server
      // uploading object
      const singleNoteData = {
        title: textInput,
        body: textArea,
        date,
        time,
        day,
        color: color,
        archive: false,
      };
      try {
        response = await uploadNoteAPI(singleNoteData);
      } catch (error) {
        console.error("Error: ", error);
      }
      if (response.status >= 200 && response.status <= 300) {
        const { data } = await getAllNoteAPI();
        dispatch(addNotesToStore([...data].reverse()));
      } else {
        console.error("Error: ", response);
      }
    }
  };

  return (
    <div
      className={
        currentNote
          ? `w-full`
          : `mx-auto max-w-sm break-inside-avoid flex justify-center items-center border-dashed border-2 border-slate-400 rounded-lg  p-5  flex-col gap-5 mb-5 h-40 `
      }
    >
      {currentNote ? (
        <div onClick={handleOpen}>{entry}</div>
      ) : (
        <IoMdAddCircle
          onClick={handleOpen}
          style={{ fontSize: "2rem" }}
          className="text-slate-400"
        />
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box style={{ backgroundColor: color }} sx={style}>
            <div className="add-note flex flex-col gap-5 mb-5 max-w-md ">
              <label className="flex items-center gap-2 opacity-50">
                {" "}
                {<FaFile />}Create New Note
              </label>
              <input
                id="note-title"
                type="text"
                placeholder="Title"
                autoFocus
                onKeyDown={handleKeyPress}
                value={textInput}
                onChange={(e) => handleTextInputChange(e.target)}
              />
              <textarea
                ref={textAreaRef}
                id="note-body"
                rows={10}
                spellCheck={false}
                placeholder="Content"
                value={textArea}
                onChange={(e) => handleTextAreaChange(e.target)}
              ></textarea>
              <div className="flex justify-between">
                <button
                  onClick={() => handleCancelButton()}
                  className="px-3 py-2 rounded-lg bg-red-100"
                >
                  cancel
                </button>
                <div>
                  <Tooltip title="Account settings">
                    <IconButton
                      onClick={handleClick}
                      size="small"
                      sx={{ ml: 2 }}
                      aria-controls={open ? "account-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                    >
                      <div className="p-3 border-slate-400 border-2 rounded-full"></div>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openColor}
                    onClose={handleCloseColor}
                    onClick={handleCloseColor}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    {colors.map((item) => (
                      <MenuItem key={item}>
                        <div
                          onClick={() => handleColorPick(item)}
                          style={{ backgroundColor: item }}
                          className="p-3 border-2 border-slate-400 rounded-full"
                        ></div>
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
                <button
                  onClick={handleUpload}
                  className="px-3 py-2 rounded-lg bg-green-100"
                >
                  Add
                </button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

AddNote.propTypes = {
  currentNote: PropTypes.object,
  entry: PropTypes.string,
  handlCloseEditMenu: PropTypes.func,
};
