import {
  Button,
  Col,
  ConfigProvider,
  Empty,
  message,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import axios from "axios";
import { GetStaticProps } from "next/types";
import { useMemo, useState } from "react";
import FormModal from "../components/general/FormModal";
import { MinusCircleOutlined } from "@ant-design/icons";

import PageLayout from "../components/general/PageLayout";

import { IProject, ITask, ISprint } from "../type";
import { refreshData } from "../utils/globalFunctions";
import { updateProject } from "./api";
import { useRouter } from "next/router";

interface IListData extends ITask {
  project: { _id: string; name: string };
}

interface Props {
  projects: IProject[]; // comes from getServerSideProps (at bottom of page)
  sprints: ISprint[];
}

export default function Home({ projects, sprints }: Props) {
  const router = useRouter();
  console.log("sprints", sprints);

  const tableData = useMemo(() => {
    let todoTasks: IListData[] = [];
    let inProgressTasks: IListData[] = [];
    let doneTasks: IListData[] = [];

    projects.forEach((project) => {
      project.tasks?.forEach((task) => {
        if (task.inSprint === true) {
          const taskData = {
            project: { _id: project._id, name: project.name },
            ...task,
          };
          if (task.status === "todo") {
            todoTasks.push(taskData);
          }
          if (task.status === "inProgress") {
            inProgressTasks.push(taskData);
          }
          if (task.status === "done") {
            doneTasks.push(taskData);
          }
        }
      });
    });
    return { todoTasks, inProgressTasks, doneTasks };
  }, [projects]);

  const onStartSprint = () => {
    console.log("started");
  };

  const onRemoveFromSprint = async (projectId: string, taskId: String) => {
    const projectIndex = projects.findIndex(
      (project) => project._id === projectId
    );
    const project = projects[projectIndex];
    if (project.tasks) {
      const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
      project.tasks[taskIndex].inSprint = false;
    }
    try {
      await updateProject(project._id, project);
      refreshData(router);
    } catch (error: any) {
      message.error(
        "There was an issue removing this task from the sprint, please try again",
        2
      );
    }
  };

  const displayEmptyTable = () => (
    <div style={{ textAlign: "center" }}>No Tasks</div> //FIXME: add meaningful empty state (no tasks? add tasks from projects and start a sprint)
  );

  const columns = [
    {
      title: "Task",
      dataIndex: "description",
      render: (description: string, tasks: IListData) => {
        return (
          <Space size={"small"}>
            <Tooltip title="remove from sprint">
              <MinusCircleOutlined
                onClick={() => {
                  onRemoveFromSprint(tasks.project._id, tasks._id);
                }}
              />
            </Tooltip>
            {description}
          </Space>
        );
      },
      key: "description",
    },
    {
      title: "Ranking",
      dataIndex: "ranking",
      key: "ranking",
    },
  ];

  return (
    <PageLayout>
      <div style={{ marginTop: "40px" }}>
        <Button
          size="large"
          type="default"
          onClick={() => {
            onStartSprint();
          }}
          style={{
            marginBottom: "35px",
            backgroundColor: "#108ee9",
            color: "white",
            border: "none",
          }}
        >
          Start Sprint
        </Button>
        <div>
          <ConfigProvider renderEmpty={displayEmptyTable}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>Todo</h2>
                <Table
                  size="large"
                  dataSource={tableData.todoTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "40px" }}
                />
              </Col>
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>In Progress</h2>
                <Table
                  size="large"
                  dataSource={tableData.inProgressTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
              <Col span={8}>
                <h2 style={{ fontSize: "17px" }}>Done</h2>
                <Table
                  size="large"
                  dataSource={tableData.doneTasks}
                  columns={columns}
                  pagination={false}
                  style={{ marginBottom: "20px" }}
                />
              </Col>
            </Row>
          </ConfigProvider>
        </div>
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async () => {
  // fetches projects, and returns them within props under the name projects
  const BASE_URL: string = "http://127.0.0.1:4000";
  const projectsRes = await axios.get(BASE_URL + "/projects");
  const sprintsRes = await axios.get(BASE_URL + "/sprints");
  return {
    props: {
      projects: projectsRes.data.projects,
      sprints: sprintsRes.data.sprints,
    },
  };
};
