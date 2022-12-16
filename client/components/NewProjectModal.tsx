import { Modal, Form, Input, Button, Space, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { IProject } from "../type";
import NewProjectForm from "./NewProjectForm";

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
        title={
          <Space style={{ fontSize: "17px", fontWeight: "500" }}>
            <Tooltip
              title={
                <div>
                  Split your project into tasks and rank them from <b>1-8</b>{" "}
                  based on time and difficulty
                </div>
              }
              color={"#108ee9"}
              key={"#108ee9"}
            >
              <InfoCircleOutlined style={{ color: "#108ee9" }} />
            </Tooltip>
            Time to plan out your project!
          </Space>
        }
        open={open}
        onCancel={() => {
          handleCancel();
          form.resetFields();
        }}
        width={800}
        footer={null}
      >
        <NewProjectForm form={form} />
        <div style={{ display: " flex", justifyContent: "flex-end" }}>
          <Button
            size="large"
            style={{
              background: "#108ee9",
              color: "white",
              marginTop: "20px",
              width: "12vh",
              border: "none",
            }}
            onClick={onSubmitForm}
          >
            Create
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default NewProjectModal;
