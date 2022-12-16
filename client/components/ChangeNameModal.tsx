import { Form, Modal, Input, InputNumber, Space, Button } from "antd";
const { TextArea } = Input;

interface Props {
  open: boolean;
  onAddTask: (taskValues: { description: string; ranking: number }) => void;
  handleCancel: () => void;
}

export default function AddTaskModal({ open, handleCancel, onAddTask }: Props) {
  const [form] = Form.useForm();

  const onSubmitForm = () => {
    form
      .validateFields()
      .then((values) => {
        onAddTask(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  return (
    <Modal
      title="Add Task"
      open={open}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      footer={null}
    >
      <Form
        layout={"vertical"}
        requiredMark={"optional"}
        form={form}
        name="addTaskForm"
        autoComplete="off"
        style={{ paddingTop: "15px" }}
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
      </Form>
      <div style={{ display: " flex", justifyContent: "flex-end" }}>
        <Button
          size="large"
          style={{
            background: "#108ee9",
            color: "white",
            marginTop: "5px",
            width: "10vh",
            border: "none",
          }}
          onClick={onSubmitForm}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
}
