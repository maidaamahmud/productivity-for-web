import { Form, Modal, Input, InputNumber, Space } from "antd";
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
      onOk={onSubmitForm}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
    >
      <Form
        form={form}
        name="newProjectForm"
        autoComplete="off"
        style={{ paddingTop: "15px" }}
      >
        <Space>
          <Form.Item
            label="Description"
            rules={[
              { required: true, message: "Give this task a description" },
            ]}
            name="description"
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Ranking"
            rules={[{ required: true, message: "Give this task a ranking" }]}
            name="ranking"
          >
            <InputNumber min={1} max={8} />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
}
