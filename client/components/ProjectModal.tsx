import { Button, Modal, Form, Input, Space, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { IProject } from "../type";

interface Props {
  open: boolean;
  projectToEdit: null | IProject;
  onCreate: (values: Omit<IProject, "_id">) => void;
  onEdit: (id: String, values: Omit<IProject, "_id">) => void;
  handleCancel: () => void;
}

const NewProjectModal = ({
  open,
  projectToEdit,
  onCreate,
  onEdit,
  handleCancel,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // If this form is being used to edit an existing project, the form is filled with the existing values
    const intialValues = projectToEdit ? projectToEdit : {};
    form.setFieldsValue(intialValues);
  }, [projectToEdit, form]);

  const onSubmitForm = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        // function run depending on if an existing project is being edited or a new one is being created (resulting function calls api to edit or create)
        projectToEdit ? onEdit(projectToEdit!._id, values) : onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Modal
        title={projectToEdit ? "Edit project" : "Create new project"}
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
                        <Input />
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
