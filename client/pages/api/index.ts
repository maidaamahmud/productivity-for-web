import axios, { AxiosResponse } from "axios";
import { ApiDataType, IProject, ISprint } from "../../type";

const BASE_URL: string = "http://127.0.0.1:4000";

// project
export const addProject = async (
  data: Omit<IProject, "_id">
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.post(
    BASE_URL + "/add-project",
    data
  );
  return res;
};

export const updateProject = async (
  id: String,
  data: Omit<IProject, "_id">
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.put(
    BASE_URL + "/update-project/" + id,
    data
  );
  return res;
};

export const deleteProject = async (
  id: String
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.delete(
    BASE_URL + "/delete-project/" + id
  );
  return res;
};

export const addTask = async (
  id: String,
  data: { description: String; ranking: number }
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.put(
    BASE_URL + "/projects/" + id + "/add-task",
    data
  );
  return res;
};

// sprint
export const addSprint = async (): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.post(
    BASE_URL + "/add-sprint"
  );
  return res;
};

export const updateSprint = async (
  id: String,
  data: Omit<ISprint, "_id">
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.put(
    BASE_URL + "/update-sprint/" + id,
    data
  );
  return res;
};
