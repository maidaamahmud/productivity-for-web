import {
  Divider,
  Button,
  Space,
  Table,
  Typography,
  message,
  ConfigProvider,
} from "antd";
import {
  CheckCircleTwoTone,
  MinusCircleTwoTone,
  LeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../../components/PageLayout";
import { IProject, ITask } from "../../type";
import router from "next/router";
import { updateProject } from "../api";

interface Props {
  project: IProject; // comes from getServerSideProps (at bottom of page)
}

export default function ViewProjectTasks({ project }: Props) {
  const { Text } = Typography;

  const completeTasks = project.tasks?.filter((task) => {
    return task.status;
  });
  const incompleteTasks = project.tasks?.filter((task) => {
    return !task.status;
  });

  const displayEmptyTable = () => (
    <div style={{ textAlign: "center" }}>No Tasks</div>
  );

  const refreshData = () => {
    // refetches data (projects)
    router.replace(router.asPath); //FIXME: make global?
  };

  const onChangeStatus = async (taskId: String, status: boolean) => {
    if (project && project.tasks) {
      const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
      project.tasks[taskIndex].status = status;
    }
    try {
      await updateProject(project._id, project);
      refreshData(); // data refetched once project has been deleted
    } catch (error: any) {
      message.error("There was an issue moving the task, please try again", 2);
    }
  };

  const columns = [
    // the object below is all data to determine how both tables are structured
    //(used as a value to the columns attribute in the ant-design table component)
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
      <Space
        style={{ color: "black", fontWeight: "600", cursor: "pointer" }}
        onClick={() => {
          router.back();
        }}
      >
        <LeftOutlined />
        Projects
      </Space>
      <ConfigProvider renderEmpty={displayEmptyTable}>
        <h2 style={{ fontSize: "17px", color: "black" }}>Todo</h2>
        <Table
          size="large"
          dataSource={incompleteTasks}
          columns={columns}
          pagination={false}
          style={{ marginBottom: "40px" }}
        />
        <h2 style={{ fontSize: "17px", color: "black" }}>Completed</h2>
        <Table
          size="large"
          dataSource={completeTasks}
          columns={columns}
          pagination={false}
          style={{ marginBottom: "20px" }}
        />
      </ConfigProvider>
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
