import api from "./api";

export const getNotes = async () => {
  const response = await api.get("/notes");
  return response.data;
};

export const createNote = async (noteData) => {
  // noteData can be a FormData object containing title, content, and optional image file
  const response = await api.post("/notes", noteData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateNote = async (id, updates) => {
  const response = await api.put(`/notes/${id}`, updates);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};
