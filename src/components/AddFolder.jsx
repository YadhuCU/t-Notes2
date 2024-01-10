/* eslint-disable react/prop-types */
import { IoMdAddCircle } from "react-icons/io";
import { FaFolder } from "react-icons/fa";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "swiper/css";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Tooltip from "@mui/material/Tooltip";

import { colors } from "../utils/colors";
import { useState } from "react";
import { formattedDate } from "../utils/formatter";
import {
  updateFolderAPI,
  addFolderAPI,
  getAllFoldersAPI,
} from "../services/allAPIs";
import { useDispatch } from "react-redux";
import { addFoldersToStore } from "../redux/addFolderSlice";
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

export const AddFolder = ({ entry, editFolder, handleCloseEditMenu }) => {
  const [color, setColor] = useState(editFolder?.color || "hsl(60, 5%, 96%)");
  const [textInput, setTextInput] = useState(editFolder?.title || "");
  const dispatch = useDispatch();

  // MUI things
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const openColor = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseColor = () => setAnchorEl(null);

  // ------
  const handleColorPick = (color) => setColor(color);
  const handleTextInputChange = ({ value }) => setTextInput(value);

  // cancel button | reset all state
  const handleCancelButton = () => {
    setTimeout(() => {
      setColor("hsl(60, 5%, 96%)");
      setTextInput("");
    }, 1000);
    setOpen(false);
    if (editFolder) {
      handleCloseEditMenu();
    }
  };
  // upload the folder to db
  const handleUpload = async () => {
    handleCancelButton();
    if (!textInput) return;
    editFolder && handleCloseEditMenu();
    const date = formattedDate(new Date());
    let response;

    if (editFolder) {
      // update the existing Folder
      const newFolder = {
        ...editFolder,
        title: textInput,
        color,
        date,
      };
      try {
        await updateFolderAPI(editFolder.id, newFolder);
      } catch (error) {
        console.error("Folder Uploading Error: ", error);
      }
      if (response.status >= 200 && response.status < 300) {
        // success (file creation)
        const { data } = await getAllFoldersAPI();
        dispatch(addFoldersToStore([...data].reverse()));
      } else {
        // failed (file creation)
        console.error("Stataus code error ", response.status);
      }
    } else {
      // folder object
      const newFolder = {
        title: textInput,
        color,
        date,
        notes: [],
      };
      try {
        response = await addFolderAPI(newFolder);
      } catch (error) {
        console.error("Folder Uploading Error: ", error);
      }
      if (response.status >= 200 && response.status < 300) {
        // success (file creation)
        const { data } = await getAllFoldersAPI();
        dispatch(addFoldersToStore([...data].reverse()));
      } else {
        // failed (file creation)
        console.error("Stataus code error ", response.status);
      }
    }
  };

  return (
    <div className="w-100">
      {entry ? (
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
                {<FaFolder />}Create New Folder
              </label>
              <input
                autoFocus
                id="note-title"
                type="text"
                placeholder="Folder Name"
                onChange={(e) => handleTextInputChange(e.target)}
                value={textInput}
              />
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
                    {colors?.map((item) => (
                      <MenuItem key={item}>
                        <div
                          onClick={() => handleColorPick(item)}
                          style={{ backgroundColor: item }}
                          className="p-3  rounded-full border-2 border-slate-400"
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

AddFolder.propTypes = {
  entry: PropTypes.string,
  editFolder: PropTypes.object,
  handleCloseEditMenu: PropTypes.func,
};
