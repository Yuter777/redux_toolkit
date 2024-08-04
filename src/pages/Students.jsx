import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  filterStudents,
} from "../redux/studentSlice";

const { Search } = Input;
const { Option } = Select;

const Students = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.filteredStudents);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleAdd = () => {
    setIsModalVisible(true);
    setEditingStudent(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setIsModalVisible(true);
    setEditingStudent(record);
    form.setFieldsValue(record);
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (editingStudent) {
      dispatch(updateStudent({ ...editingStudent, ...values }));
    } else {
      dispatch(addStudent(values));
    }
    setIsModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    dispatch(filterStudents({ searchText: text, group: selectedGroup }));
  };

  const handleGroupChange = (value) => {
    setSelectedGroup(value);
    dispatch(filterStudents({ searchText, group: value }));
  };

  const getGroups = () => {
    const groups = [...new Set(students.map((student) => student.group))];
    return groups.map((group) => (
      <Option key={group} value={group}>
        {group}
      </Option>
    ));
  };

  const columns = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastname",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
        <Search
          placeholder="Search by name"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select
          placeholder="Filter by group"
          onChange={handleGroupChange}
          allowClear
        >
          {getGroups()}
        </Select>
        <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
          Add Student
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please input the first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input the last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group"
            label="Group"
            rules={[{ required: true, message: "Please input the group!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Students;
