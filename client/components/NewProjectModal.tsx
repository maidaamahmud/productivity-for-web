import {
  Button,
  Modal,
  Form,
  Input,
  Space,
  DatePicker,
  Row,
  Col,
  InputNumber,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { IProject } from "../type";

interface Props {
  open: boolean;
  projectToEdit: null | IProject;
  onCreate: (values: IProject) => void;
  handleCancel: () => void;
}

const NewProjectModal = ({
  open,
  projectToEdit,
  onCreate,
  handleCancel,
}: Props) => {
  const [form] = Form.useForm();
  const intialValues = projectToEdit
    ? {
        ...projectToEdit,
        startDate: moment(projectToEdit.startDate),
        endDate: moment(projectToEdit.endDate),
      }
    : {};
  useEffect(() => {
    form.setFieldsValue(intialValues);
  });
  return (
    <>
      <Modal
        title="Create new project"
        open={open}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
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
          <Row>
            <Col span={10}>
              <Form.Item
                label="Project start date"
                rules={[
                  {
                    required: true,
                    message: "Select the date you want to start",
                  },
                ]}
                name="startDate"
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Project deadline"
                rules={[
                  {
                    required: true,
                    message: "Select the date you want to finish by",
                  },
                ]}
                name="endDate"
              >
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
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
