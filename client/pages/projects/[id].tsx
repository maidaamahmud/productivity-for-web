import {
  Divider,
  Button,
  Space,
  Table,
  Typography,
  message,
  ConfigProvider,
  Row,
  Col,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../../components/PageLayout";
import { IProject, ITask } from "../../type";
import router from "next/router";
import { addTask, updateProject } from "../api";
import { useState } from "react";
import AddTaskModal from "../../components/AddTaskModal";

// const onChangeStatus = async (taskId: String, status: boolean) => {
//   if (project && project.tasks) {
//     const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
//     project.tasks[taskIndex].status = status;
//   }
//   try {
//     await updateProject(project._id, project);
//     refreshData(); // data refetched once project has been deleted
//   } catch (error: any) {
//     message.error("There was an issue moving the task, please try again", 2);
//   }
// };

// render: (tasks: ITask[], task: ITask) => {
//   return (
//     <Space size={"large"}>
//       {task.status ? (
//         <Text
//           onClick={() => {
//             onChangeStatus(task._id, false);
//           }}
//         >
//           <MinusCircleTwoTone style={{ fontSize: "20px" }} />
//         </Text>
//       ) : (
//         <CheckCircleTwoTone
//           onClick={() => {
//             onChangeStatus(task._id, true);
//           }}
//           style={{ fontSize: "20px" }}
//           twoToneColor={"#6dc76d"}
//         />
//       )}
//       {task.description}
//     </Space>
//   );
// },
interface Props {
  project: IProject; // comes from getServerSideProps (at bottom of page)
}

export default function ViewProjectTasks({ project }: Props) {
  const [openNewTaskModal, setOpenNewTaskModal] = useState<boolean>(false);

  const todoTasks = project.tasks?.filter((task) => {
    return task.status === "todo";
  });
  const inProgressTasks = project.tasks?.filter((task) => {
    return task.status === "inProgress";
  });
  const doneTasks = project.tasks?.filter((task) => {
    return task.status === "done";
  });
  const displayEmptyTable = () => (
    <div style={{ textAlign: "center" }}>No Tasks</div>
  );

  const refreshData = () => {
    // refetches data (project)
    console.log("refetch");
    router.replace(router.asPath); //FIXME: make global?
  };

  const onAddTask = async (taskValues: {
    description: string;
    ranking: number;
  }) => {
    const hideMessage = message.loading("Loading..", 0);
    try {
      const res = await addTask(project._id, taskValues);
      message.success(`Task has been added into ${project.name}!`, 2);
      refreshData(); // data refetched once project has been deleted
    } catch (error: any) {
      message.error("There was an issue adding the task, please try again", 2);
    } finally {
      hideMessage();
    }
    setOpenNewTaskModal(false);
  };

  const onCancelModal = () => {
    // when modal is closed
    setOpenNewTaskModal(false);
  };

  const columnsWithButtons = [
    {
      title: (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          Tasks
          <Button
            size="small"
            type="default"
            onClick={() => {
              setOpenNewTaskModal(true);
            }}
            style={{
              backgroundColor: "#108ee9",
              color: "white",
              border: "none",
            }}
          >
            Add Task
          </Button>
        </div>
      ),
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Score",
      dataIndex: "ranking",
      key: "ranking",
    },
  ];

  const columns = [
    {
      title: "tasks",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Score",
      dataIndex: "ranking",
      key: "ranking",
    },
  ];

  return (
    <PageLayout>
      <Space
        style={{
          fontWeight: "600",
          cursor: "pointer",
          marginTop: "10px",
          marginLeft: "-25px",
        }}
        onClick={() => {
          router.back();
        }}
      >
        <LeftOutlined />
        Back
      </Space>
      <h1 style={{ marginTop: "30px", fontSize: "21px", marginBottom: "8px" }}>
        {project.name} overview
      </h1>
      <div style={{}}>
        <ConfigProvider renderEmpty={displayEmptyTable}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <h2 style={{ fontSize: "17px" }}>Todo</h2>
              <Table
                size="large"
                dataSource={todoTasks}
                columns={columnsWithButtons}
                pagination={false}
                style={{ marginBottom: "40px" }}
              />
            </Col>
            <Col span={8}>
              <h2 style={{ fontSize: "17px" }}>In Progress</h2>
              <Table
                size="large"
                dataSource={inProgressTasks}
                columns={columns}
                pagination={false}
                style={{ marginBottom: "20px" }}
              />
            </Col>
            <Col span={8}>
              <h2 style={{ fontSize: "17px" }}>Done</h2>
              <Table
                size="large"
                dataSource={doneTasks}
                columns={columns}
                pagination={false}
                style={{ marginBottom: "20px" }}
              />
            </Col>
          </Row>
        </ConfigProvider>
        <AddTaskModal
          open={openNewTaskModal}
          handleCancel={onCancelModal}
          onAddTask={onAddTask}
        />
      </div>
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
