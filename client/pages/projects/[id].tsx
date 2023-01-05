import {
  Button,
  Space,
  Table,
  message,
  ConfigProvider,
  Row,
  Col,
  Form,
  Input,
  InputNumber,
  Typography,
} from "antd";
import { LeftOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { GetStaticProps } from "next";
import PageLayout from "../../components/general/PageLayout";
import { IProject, ITask } from "../../type";
import { useRouter } from "next/router";
import { addTask, updateProject } from "../api";
import { useMemo, useState } from "react";
import { refreshData } from "../../utils/globalFunctions";
import FormModal from "../../components/general/FormModal";

const { TextArea } = Input;
const { Text } = Typography;

interface Props {
  project: IProject;
}

export default function ViewProjectTasks({ project }: Props) {
  const router = useRouter();

  const [openNewTaskModal, setOpenNewTaskModal] = useState<boolean>(false);

  const tableData = useMemo(() => {
    const todoTasks = project.tasks?.filter((task) => {
      return task.status === "todo";
    });
    const inProgressTasks = project.tasks?.filter((task) => {
      return task.status === "inProgress";
    });
    const doneTasks = project.tasks?.filter((task) => {
      return task.status === "done";
    });
    return { todoTasks, inProgressTasks, doneTasks };
  }, [project]);

  const onAddTask = async (taskValues: {
    description: string;
    ranking: number;
  }) => {
    const hideMessage = message.loading("Loading..", 0);
    try {
      await addTask(project._id, taskValues);
      message.success(`Task has been added into ${project.name}!`, 2);
      refreshData(router);
    } catch (error: any) {
      message.error("There was an issue adding the task, please try again", 2);
    } finally {
      hideMessage();
    }
    setOpenNewTaskModal(false);
  };

  const onDeleteTask = async (taskId: String) => {
    if (project && project.tasks) {
      const taskIndex = project.tasks.findIndex((task) => task._id === taskId);
      project.tasks.splice(taskIndex, 1);
    }
    try {
      await updateProject(project._id, project);
      refreshData(router);
    } catch (error: any) {
      message.error(
        "There was an issue deleting the task, please try again",
        2
      );
    }
  };

  const onCancelNewTaskModal = () => {
    setOpenNewTaskModal(false);
  };

  const displayEmptyTable = () => (
    <div style={{ textAlign: "center" }}>No Tasks</div>
  );

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
      render: (tasks: ITask[], task: ITask) => {
        return (
          <Space size={"middle"}>
            <Text
              onClick={() => {
                onDeleteTask(task._id);
              }}
            >
              <DeleteOutlined />
            </Text>

            {task.description}
          </Space>
        );
      },
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

      <div>
        <ConfigProvider renderEmpty={displayEmptyTable}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <h2 style={{ fontSize: "17px" }}>Todo</h2>
              <Table
                size="large"
                dataSource={tableData.todoTasks}
                columns={columnsWithButtons}
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

        <FormModal
          isOpen={openNewTaskModal}
          onCancel={onCancelNewTaskModal}
          onOk={onAddTask}
          title={"Add Task"}
        >
          <Space>
            <Form.Item
              style={{ width: "45vh" }}
              label={<label style={{ fontWeight: "500" }}> Description </label>}
              rules={[
                { required: true, message: "Give this task a description" },
              ]}
              name="description"
            >
              <TextArea autoSize={true} size={"large"} />
            </Form.Item>
            <Form.Item
              label={<label style={{ fontWeight: "500" }}> Ranking </label>}
              rules={[{ required: true, message: "Rank from 1-8" }]}
              name="ranking"
            >
              <InputNumber min={1} max={8} size={"large"} />
            </Form.Item>
          </Space>
        </FormModal>
      </div>
    </PageLayout>
  );
}

export const getServerSideProps: GetStaticProps = async (context) => {
  const { params } = context; // params contains the dynamic variables in the route (id)
  const BASE_URL: string = "http://127.0.0.1:4000";
  const results = await axios.get(BASE_URL + "/projects/" + params!.id);
  return {
    props: {
      project: results.data.project,
    },
  };
};
