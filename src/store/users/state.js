export default function () {
  return {
    // Model of the data
    userLoginInfo: {},
    users: [],
    usersHashMap: {},
    usersOptions: [],
    usersRoleOptions: [
      {
        label: "ADMIN",
        value: 1,
      },
      {
        label: "STANDARD USER",
        value: 2,
      },
    ],
    usersRoleHashMap: {
      ADMIN: {
        label: "ADMIN",
        value: 1,
      },
      "STANDARD USER": {
        label: "STANDARD USER",
        value: 2,
      },
    },
    usersColumns: [
      {
        name: "username",
        align: "center",
        label: "USERNAME",
        field: "username",
        sortable: true,
      },
      {
        name: "name",
        align: "center",
        label: "NAME",
        field: "name",
        sortable: true,
      },
      {
        name: "role",
        align: "center",
        label: "ROLE",
        field: "role",
        sortable: true,
      },
      {
        name: "status",
        align: "center",
        label: "STATUS",
        field: "status",
        sortable: true,
      },
      {
        name: "createdAt",
        align: "center",
        label: "D/T CREATED",
        field: "createdAt",
        sortable: true,
      },
      {
        name: "updatedAt",
        align: "center",
        label: "D/T UPDATED",
        field: "updatedAt",
        sortable: true,
      },
    ],
  };
}
