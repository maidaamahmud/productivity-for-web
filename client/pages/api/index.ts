import axios, { AxiosResponse } from "axios";
import { ApiDataType, IProject } from "../../type";

const BASE_URL: string = "http://127.0.0.1:4000";

export const addProject = async (): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const project: Omit<IProject, "_id"> = {
      name: "a",
      startDate: new Date(),
      endDate: new Date(),
    };
    const res: AxiosResponse<ApiDataType> = await axios.post(
      BASE_URL + "/project",
      project
    );
    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};
