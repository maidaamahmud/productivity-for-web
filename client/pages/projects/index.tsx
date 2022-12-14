import PageLayout from "../../components/PageLayout";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { IProject } from "../../type";
import { useState } from "react";
import NewProjectModal from "../../components/ProjectModal";
import { Button, message, Card, List, Typography, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { addProject, updateProject, deleteProject } from "../api";

const { Text } = Typography;

interface Props {
  projects: IProject[]; // comes from getServerSideProps (at bottom of page)
}

export default function Projects({ projects }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<IProject | null>(null);

  const router = useRouter();

  const refreshData = () => {
    // refetches data (projects)
    router.replace(router.asPath);
  };

  const onCancelModal = () => {
    // when modal is closed
    setOpenModal(false);
    setProjectToEdit(null);
  };

  const onCreateProject = async (values: Omit<IProject, "_id">) => {
    // loading message appears whilst project is being created, once complete user recieves a response message
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await addProject(values);
      message.success(
        `${res.data.project?.name} has successfully been created!`,
        2
      );
      refreshData(); // data refetched once new project added to database
    } catch (error: any) {
      message.error("There seems to have been an issue, please try again.", 2);
    } finally {
      hideMessage();
    }
    setOpenModal(false);
  };

  const onEditProject = async (id: String, values: Omit<IProject, "_id">) => {
    // loading message appears whilst project changed are being saved , once complete user recieves a response message
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await updateProject(id, values);
      message.success(
        `Your changes to ${res.data.project?.name} have been saved!`,
        2
      );
      refreshData(); // data refetched once existing project has been altered
    } catch (error: any) {
      message.error(
        "We were unable to save your changes, please try again.",
        2
      );
    } finally {
      hideMessage();
    }
    setOpenModal(false);
  };

  const onDeleteProject = async (id: String) => {
    // loading message appears whilst project is being deleted , once complete user recieves a response message
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await deleteProject(id);
      message.success(`${res.data.project?.name} has been deleted!`, 2);
      refreshData(); // data refetched once project has been deleted
    } catch (error: any) {
      message.error(
        "We were unable to delete this project, please try again.",
        2
      );
    } finally {
      hideMessage();
    }
  };

  return (
    <PageLayout>
      <div>
        <Button
          icon={<PlusOutlined />}
          shape="round"
          size="large"
          type="default"
          onClick={() => {
            setOpenModal(true); // this opens the ProjectModal component
          }}
          style={{ marginBottom: "35px" }}
        >
          Project
        </Button>
        {/* grid attribute in List component determines how many boxes (Card components) should appear in a row depending on the screen size*/}
        <List
          grid={{
            gutter: 5,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 4,
          }}
          dataSource={projects}
          renderItem={(project) => (
            <List.Item>
              <Card
                title={project.name}
                actions={[
                  <Text
                    key="view"
                    onClick={() => {
                      router.push("/projects/" + project._id);
                    }}
                  >
                    <Space>
                      <EyeOutlined />
                      View
                    </Space>
                  </Text>,
                  <Text
                    key="edit"
                    onClick={() => {
                      //projectToEdit state is passed to ProjectModal (form used to create and edit project details)
                      setProjectToEdit(project);
                      setOpenModal(true); // this opens the ProjectModal component
                    }}
                  >
                    <Space>
                      <EditOutlined />
                      Edit
                    </Space>
                  </Text>,
                  <Text
                    key="delete"
                    onClick={() => {
                      onDeleteProject(project._id);
                    }}
                  >
                    <Space>
                      <DeleteOutlined key="delete" />
                      Delete
                    </Space>
                  </Text>,
                ]}
              >
                Progress
              </Card>
            </List.Item>
          )}
        />
        <NewProjectModal
          open={openModal}
          projectToEdit={projectToEdit} // if projectToEdit is null if new project is being created or it is set to the project object to be edited
          onCreate={onCreateProject}
          onEdit={onEditProject}
          handleCancel={onCancelModal}
        />
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  // fetches projects, and returns them within props under the name projects
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects"); //FIXME: move to api?
  return {
    props: {
      projects: results.data.projects,
    },
  };
};
