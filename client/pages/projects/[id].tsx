import { Divider, Button, Space, Table, Typography, message } from "antd";
import { CheckCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons";
import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../../components/PageLayout";
import { IProject, ITask } from "../../type";
import router from "next/router";
import { updateProject } from "../api";

interface Props {
  project: IProject; // comes from getServerSideProps (at bottom of page)
}

export default function ViewProject({ project }: Props) {
  const { Text } = Typography;

  const completeTasks = project.tasks?.filter((task) => {
    return task.status;
  });
  const incompleteTasks = project.tasks?.filter((task) => {
    return !task.status;
  });

  const refreshData = () => {
    // refetches data (projects)
    router.replace(router.asPath);
  };

  const onChangeStatus = async (taskId: String, status: boolean) => {
    if (project && project.tasks) {
      const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
      project.tasks[taskIndex].status = status;
      console.log(project);
    }
    const hideMessage = message.loading("Loading..", 0);
    try {
      await updateProject(project._id, project);
      status
        ? message.success(`Task has been moved back to todo!`, 2)
        : message.success(`Task has been marked as completed!`, 2);
      refreshData(); // data refetched once project has been deleted
    } catch (error: any) {
      message.error(
        "There was an issue updating the task, please try again",
        2
      );
    } finally {
      hideMessage();
    }
  };

  const columns = [
    // the object below is all data to determine how both tables are structured (used as a value to the columns attribute in the ant-design table component)
    {
      title: "Task",
      dataIndex: "description",
      render: (tasks: ITask[], task: ITask) => {
        return (
          <Space size={"large"}>
            {task.status ? (
              <Text
                onClick={() => {
                  onChangeStatus(task._id, false);
                }}
              >
                <MinusCircleTwoTone style={{ fontSize: "20px" }} />
              </Text>
            ) : (
              <CheckCircleTwoTone
                onClick={() => {
                  onChangeStatus(task._id, true);
                }}
                style={{ fontSize: "20px" }}
                twoToneColor={"#6dc76d"}
              />
            )}
            {task.description}
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
      <Divider orientation="left">Todo</Divider>
      <Table
        size="large"
        dataSource={incompleteTasks}
        columns={columns}
        pagination={false}
        style={{ marginBottom: "20px" }}
      />
      <Divider orientation="left">Complete</Divider>
      <Table
        size="large"
        dataSource={completeTasks}
        columns={columns}
        pagination={false}
        style={{ marginBottom: "20px" }}
      />
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async (context) => {
  const { params } = context; // params contains the dynamic variables in the route (id)
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects/" + params!.id); //FIXME: move to api?
  return {
    props: {
      project: results.data.project,
    },
  };
};
