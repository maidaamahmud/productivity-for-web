import PageLayout from "../components/PageLayout";
import axios, { AxiosResponse } from "axios";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { IProject } from "../type";
import { useState } from "react";
import NewProjectModal from "../components/NewProjectModal";
import { Button, message, Card, List, Typography, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { addProject } from "./api";

const { Text } = Typography;

interface Props {
  projects: IProject[];
}

export default function Projects({ projects }: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [projectToEdit, setProjectToEdit] = useState<IProject | null>(null);

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const onCancelModal = () => {
    setOpenModal(false);
    setProjectToEdit(null);
  };

  const onCreateProject = async (values: Omit<IProject, "_id">) => {
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await addProject(values);
      message.success(
        `${res.data.project?.name} has successfully been created!`,
        3
      );
      refreshData();
    } catch (error: any) {
      message.error("There seems to have been an issue, please try again.", 3);
    } finally {
      hideMessage();
    }
    setOpenModal(false);
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
            setOpenModal(true);
          }}
          style={{ marginBottom: "35px" }}
        >
          Project
        </Button>
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
                  <Text key="view">
                    <Space>
                      <EyeOutlined />
                      View
                    </Space>
                  </Text>,
                  <Text
                    key="edit"
                    onClick={() => {
                      setProjectToEdit(project);
                      setOpenModal(true);
                    }}
                  >
                    <Space>
                      <EditOutlined />
                      Edit
                    </Space>
                  </Text>,
                  <Text key="delete">
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
          projectToEdit={projectToEdit}
          onCreate={onCreateProject}
          handleCancel={onCancelModal}
        />
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects"); //FIXME: move to api?
  return {
    props: {
      projects: results.data.projects,
    },
  };
};
