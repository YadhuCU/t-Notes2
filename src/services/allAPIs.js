import { SERVER_URL } from "./serverURL";
import { commonAPI } from "./commonAPI";

export const getAllNoteAPI = async () => {
  return await commonAPI({
    url: `${SERVER_URL}/notes`,
    method: "GET",
  });
};

export const getSingleNoteAPI = async (id) => {
  return await commonAPI({
    url: `${SERVER_URL}/notes/${id}`,
    method: "GET",
  });
};

export const uploadNoteAPI = async (data) => {
  return await commonAPI({
    url: `${SERVER_URL}/notes`,
    method: "POST",
    data,
  });
};

export const deleteNoteAPI = async (id) => {
  return await commonAPI({
    url: `${SERVER_URL}/notes/${id}`,
    method: "DELETE",
    data: {},
  });
};
export const updateNoteAPI = async (id, data) => {
  return await commonAPI({
    url: `${SERVER_URL}/notes/${id}`,
    method: "PUT",
    data,
  });
};

// folders
export const getAllFoldersAPI = async () => {
  return await commonAPI({
    url: `${SERVER_URL}/folders`,
    method: "GET",
  });
};

export const addFolderAPI = async (data) => {
  return await commonAPI({
    url: `${SERVER_URL}/folders`,
    method: "POST",
    data,
  });
};

export const deleteFolderAPI = async (id) => {
  return await commonAPI({
    url: `${SERVER_URL}/folders/${id}`,
    method: "DELETE",
    data: {},
  });
};

export const updateFolderAPI = async (id, data) => {
  return await commonAPI({
    url: `${SERVER_URL}/folders/${id}`,
    method: "PUT",
    data,
  });
};

export const getSingleFolderAPI = async (id) => {
  return await commonAPI({
    url: `${SERVER_URL}/folders/${id}`,
    method: "GET",
  });
};

// trash
export const addToTrashAPI = async (data) => {
  return await commonAPI({
    url: `${SERVER_URL}/trash`,
    method: "POST",
    data,
  });
};

export const getAllTrashAPI = async () => {
  return await commonAPI({
    url: `${SERVER_URL}/trash`,
    method: "GET",
  });
};

export const removeFromTrashAPI = async (id) => {
  return await commonAPI({
    url: `${SERVER_URL}/trash/${id}`,
    method: "DELETE",
    data: {},
  });
};
// archive
export const addToArchiveAPI = async (data) => {
  return await commonAPI({
    url: `${SERVER_URL}/archive`,
    method: "POST",
    data,
  });
};

export const getAllArchiveAPI = async () => {
  return await commonAPI({
    url: `${SERVER_URL}/archive`,
    method: "GET",
  });
};

export const removeFromArchiveAPI = async (id) => {
  return await commonAPI({
    url: `${SERVER_URL}/archive/${id}`,
    method: "DELETE",
    data: {},
  });
};
