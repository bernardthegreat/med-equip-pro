export default function () {
  return {
    // Model of the data
    departments: [],
    departmentsHashMap: {},
    departmentsOptions: [],
    departmentsActiveOptions: [],
    departmentsActiveHashMap: {},
    departmentsColumns: [
      {
        name: "code",
        align: "center",
        label: "CODE",
        field: "code",
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
