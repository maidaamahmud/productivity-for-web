import PageLayout from "../components/PageLayout";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps } from "next";
import { IProject } from "../type";
import { useState } from "react";
import NewProjectModal from "../components/NewProjectModal";
import { Button, message } from "antd";
import { addProject } from "./api";

export const getStaticProps: GetStaticProps = async () => {
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects"); //FIXME: move to api?
  return {
    props: {
      projects: results.data.projects,
    },
  };
};

interface Props {
  projects: IProject;
}

export default function Projects({ projects }: Props) {
  const [openModal, setOpenModal] = useState(false);

  const onCancelModal = (e: React.MouseEvent<HTMLElement>) => {
    setOpenModal(false);
  };

  const onCreateProject = async (values: Omit<IProject, "_id">) => {
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await addProject(values);
      message.success(
        `${res.data.project?.name} has successfully been created!`,
        3
      );
    } catch (error: any) {
      message.error("There seems to have been an issue, please try again.", 3);
    } finally {
      hideMessage();
    }
    setOpenModal(false);
  };

  return (
    <PageLayout>
      <Button
        type="primary"
        onClick={() => {
          setOpenModal(true);
        }}
      >
        Create New Project
      </Button>
      <NewProjectModal
        open={openModal}
        onCreate={onCreateProject}
        handleCancel={onCancelModal}
      />
    </PageLayout>
  );
}
