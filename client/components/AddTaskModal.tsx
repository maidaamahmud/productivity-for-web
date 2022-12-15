import { Modal } from "antd";

interface Props {
  open: boolean;
  onAddTask: () => void;
  handleCancel: () => void;
}

export default function AddTaskModal({ open, handleCancel, onAddTask }: Props) {
  return (
    <Modal
      title="Add Task"
      open={open}
      onOk={onAddTask}
      onCancel={() => {
        handleCancel();
      }}
      width={800}
    ></Modal>
  );
}
