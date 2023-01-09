import { Button, Form, Input, InputNumber, Space } from "antd";
import { MinusCircleFilled } from "@ant-design/icons";
const { TextArea } = Input;

export default function NewProjectModalContent() {
  return (
    <>
      <Form.Item
        label={<label style={{ fontWeight: "500" }}> Project name </label>}
        rules={[{ required: true, message: "Give this project a name" }]}
        name="name"
      >
        <Input size={"large"} />
      </Form.Item>
      <div
        style={{
          background: "#fafafa",
          padding: "25px",
          paddingTop: "40px",
          borderRadius: "4px",
        }}
      >
        <Form.List name="tasks">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="center"
                  size={"middle"}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    style={{ width: "70vh" }}
                    label={
                      <label style={{ fontWeight: "500" }}> Description </label>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Don't forget to descibe the task",
                      },
                    ]}
                  >
                    <TextArea autoSize={true} size={"large"} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label={
                      <label style={{ fontWeight: "500" }}> Ranking </label>
                    }
                    name={[name, "ranking"]}
                    rules={[
                      {
                        required: true,
                        message: "Rank from 1-8",
                      },
                    ]}
                  >
                    <InputNumber min={1} max={8} size={"large"} />
                  </Form.Item>
                  <MinusCircleFilled
                    style={{ color: "#b3b3b3" }}
                    onClick={() => remove(name)}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  style={{
                    borderColor: "#108ee9",
                    background: "#fafafa",
                    borderWidth: "1.5px",
                    color: "#108ee9",
                    fontWeight: "500",
                  }}
                  size="middle"
                  onClick={() => add()}
                  block
                >
                  Add task
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
    </>
  );
}
