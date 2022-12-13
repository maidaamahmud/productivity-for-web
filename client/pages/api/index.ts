import axios, { AxiosResponse } from "axios";
import { ApiDataType, IProject } from "../../type";

const BASE_URL: string = "http://127.0.0.1:4000";

export const addProject = async (
  formData: Omit<IProject, "_id">
): Promise<AxiosResponse<ApiDataType>> => {
  const res: AxiosResponse<ApiDataType> = await axios.post(
    BASE_URL + "/projectt",
    formData
  );
  return res;
};
