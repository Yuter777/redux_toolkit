import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  teachers: [],
  status: "idle",
  error: null,
};

export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async () => {
    const response = await axios.get("http://localhost:3000/teachers");
    return response.data;
  }
);

export const addTeacher = createAsyncThunk(
  "teachers/addTeacher",
  async (newTeacher) => {
    const response = await axios.post(
      "http://localhost:3000/teachers",
      newTeacher
    );
    return response.data;
  }
);

export const updateTeacher = createAsyncThunk(
  "teachers/updateTeacher",
  async (updatedTeacher) => {
    const { id, ...data } = updatedTeacher;
    const response = await axios.put(
      `http://localhost:3000/teachers/${id}`,
      data
    );
    return response.data;
  }
);

export const deleteTeacher = createAsyncThunk(
  "teachers/deleteTeacher",
  async (id) => {
    await axios.delete(`http://localhost:3000/teachers/${id}`);
    return id;
  }
);

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload);
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex(
          (teacher) => teacher.id === action.payload.id
        );
        state.teachers[index] = action.payload;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(
          (teacher) => teacher.id !== action.payload
        );
      });
  },
});

export default teacherSlice.reducer;
