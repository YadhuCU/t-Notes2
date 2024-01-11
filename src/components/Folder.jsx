/* eslint-disable react/prop-types */
import { FaFolder } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteFolderFromFirebase,
  getAllFoldersFromFirebase,
  updateFolderInFirebase,
} from "../redux/addFolderSlice";
import { AddFolder } from "./AddFolder";

export const Folder = ({ home, folder }) => {
  const dispatch = useDispatch();
  // MUI Thingss..
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDeleteFolder = (id) => {
    dispatch(deleteFolderFromFirebase(id));
    dispatch(getAllFoldersFromFirebase());
    handleClose();
  };

  const handleDrop = async (event, folderId) => {
    const note = JSON.parse(event.dataTransfer.getData("note"));
    const itemFound = folder.notes.find((noteId) => noteId == note.id);
    if (itemFound) return;

    const newFolder = {
      ...folder,
      notes: [...folder.notes, note.id],
    };
    dispatch(updateFolderInFirebase({ id: folderId, folder: newFolder }));
    dispatch(getAllFoldersFromFirebase());
  };

  const changeColor = (color, intencity) => {
    const colorString = color.split(",")[2].split("");
    const colorArray = color.split(",");
    let lastNum = "";

    for (let i = 0; i < colorString.length; ++i) {
      if (colorString[i] * 1) {
        lastNum += colorString[i];
      }
    }
    lastNum = lastNum * 1;
    colorArray[2] = ` ${lastNum - intencity}%)`;
    return colorArray.join(",");
  };

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => handleDrop(event, folder?.id)}
      style={{
        backgroundColor: folder?.color,
      }}
      className={`rounded-[20px] hover:shadow-inner relative  ${
        home ? " w-40 h-24 md:w-60 md:h-40" : " w-60 h-40 "
      }  p-5 flex flex-col justify-between`}
    >
      <div
        className={`absolute ${
          home ? "top-[4px] right-[4px]" : ""
        } top-[10px] right-[10px]`}
      >
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
          <MenuItem>
            <AddFolder
              handleCloseEditMenu={handleClose}
              entry={"edit"}
              editFolder={folder}
            />
          </MenuItem>
          <MenuItem onClick={() => handleDeleteFolder(folder?.id)}>
            delete
          </MenuItem>
        </Menu>
      </div>
      <FaFolder
        style={{ fontSize: "3rem", color: changeColor(folder?.color, 23) }}
        className="hidden md:block"
      />
      <Link to={`/folders/${folder?.id}`}>
        <div>
          <p
            style={{
              color: changeColor(folder?.color, 60),
            }}
            className="text-2xl leading-5 font-bold text-stone-600"
          >
            {folder?.title?.length > 15
              ? folder?.title.slice(0, 15) + "..."
              : folder?.title}
          </p>
          <p
            style={{
              color: changeColor(folder?.color, 65),
            }}
            className="font-normal"
          >
            {folder?.date}
          </p>
        </div>
      </Link>
    </div>
  );
};
