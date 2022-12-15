import { Button, Modal, Form, Input, Space, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { IProject } from "../type";

const { TextArea } = Input;

interface Props {
  open: boolean;
  onCreate: (values: Omit<IProject, "_id">) => void;
  handleCancel: () => void;
}

const NewProjectModal = ({ open, onCreate, handleCancel }: Props) => {
  const [form] = Form.useForm();

  const onSubmitForm = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Modal
        title={"Create new project"}
        open={open}
        onOk={onSubmitForm}
        onCancel={() => {
          handleCancel();
          form.resetFields();
        }}
        width={800}
      >
        <Form
          form={form}
          name="newProjectForm"
          autoComplete="off"
          style={{ paddingTop: "15px" }}
        >
          <Form.Item
            label="Project name"
            rules={[{ required: true, message: "Give this project a name" }]}
            name="name"
          >
            <Input />
          </Form.Item>
          <div
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                paddingBottom: "15px",
                fontSize: "15px",
              }}
            >
              Project tasks
            </div>
            <Form.List name="tasks">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                      size={"middle"}
                    >
                      <Form.Item
                        {...restField}
                        style={{ width: "60vh" }}
                        name={[name, "description"]}
                        label="Description"
                        rules={[
                          {
                            required: true,
                            message: "Don't forget to descibe the task",
                          },
                        ]}
                      >
                        <TextArea />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        label="Ranking"
                        name={[name, "ranking"]}
                        rules={[
                          {
                            required: true,
                            message: "This task needs a ranking",
                          },
                        ]}
                      >
                        <InputNumber min={1} max={8} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add task
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default NewProjectModal;
