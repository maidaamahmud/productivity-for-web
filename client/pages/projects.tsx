import PageLayout from "../components/PageLayout";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps } from "next";
import { IProject } from "../type";
import { useState } from "react";
import NewProjectModal from "../components/NewProjectModal";
import { Button } from "antd";

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

  const onCreateProject = (values: any) => {
    console.log("Received values of form: ", values);
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
