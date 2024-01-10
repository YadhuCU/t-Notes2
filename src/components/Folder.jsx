/* eslint-disable react/prop-types */
import { FaFolder } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";

import { useState } from "react";
import {
  deleteFolderAPI,
  getAllFoldersAPI,
  getSingleFolderAPI,
  updateFolderAPI,
} from "../services/allAPIs";
import { useDispatch } from "react-redux";
import { addFoldersToStore } from "../redux/addFolderSlice";
import { AddFolder } from "./AddFolder";

export const Folder = ({ home, folder }) => {
  const dispatch = useDispatch();
  // MUI Thingss..
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDeleteFolder = async (id) => {
    let response;
    try {
      response = await deleteFolderAPI(id);
    } catch (error) {
      console.error(error);
    }
    if (response.status >= 200 && response.status < 300) {
      // deletion success
      const { data } = await getAllFoldersAPI();
      dispatch(addFoldersToStore([...data].reverse()));
    } else {
      // deletion failed
      console.error("Delete Folder Failed: ", response.status);
    }
    handleClose();
  };

  const handleDrop = async (event, folderId) => {
    const note = JSON.parse(event.dataTransfer.getData("note"));
    const { data } = await getSingleFolderAPI(folderId);
    // checking it's already in the folder.
    const itemFound = data.notes.find((item) => item.id == note.id);
    if (itemFound) return;

    data.notes.push(note);
    try {
      const result = await updateFolderAPI(folderId, data);
      if (result.status >= 200 && result.status < 300) {
        // success
        const { data } = await getAllFoldersAPI();
        dispatch(addFoldersToStore([...data].reverse()));
      }
    } catch (error) {
      console.erro("Folder updation Error: ", error);
    }
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
