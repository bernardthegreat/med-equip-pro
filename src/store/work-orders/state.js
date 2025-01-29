export default function () {
  return {
    // Model of the data
    workOrders: [],
    workOrdersHashMap: {},
    workOrdersOptions: [],
    workOrdersActiveOptions: [],
    workOrdersActiveHashMap: {},

    workStatus: [
      {
        label: "DONE",
        value: "DONE",
      },
      {
        label: "NOT FOUND",
        value: "NOT FOUND",
      },
      {
        label: "IN USE / RESCHEDULE",
        value: "IN USE / RESCHEDULE",
      },
      {
        label: "FOR REPAIR",
        value: "FOR REPAIR",
      },
    ],
    workStatusHashMap: {
      DONE: {
        label: "DONE",
        value: "DONE",
      },
      ["NOT FOUND"]: {
        label: "NOT FOUND",
        value: "NOT FOUND",
      },
      ["IN USE / RESCHEDULE"]: {
        label: "IN USE / RESCHEDULE",
        value: "IN USE / RESCHEDULE",
      },
      ["FOR REPAIR"]: {
        label: "FOR REPAIR",
        value: "FOR REPAIR",
      },
    },
    workOrdersColumns: [
      {
        name: "serialNumber",
        align: "left",
        label: "SERIAL #",
        field: "serialNumber",
        sortable: true,
      },
      {
        name: "propertyCode",
        align: "left",
        label: "PROPERTY CODE",
        field: "propertyCode",
        sortable: true,
      },
      {
        name: "name",
        align: "left",
        label: "NAME",
        field: "name",
        sortable: true,
      },
      {
        name: "brand",
        align: "center",
        label: "BRAND",
        field: "brand",
        sortable: true,
      },
      {
        name: "workOrderType",
        align: "center",
        label: "TYPE",
        field: "workOrderType",
        sortable: true,
      },
      {
        name: "departmentName",
        align: "center",
        label: "DEPARTMENT",
        field: "departmentName",
        sortable: true,
      },
      {
        name: "supplierName",
        align: "center",
        label: "SUPPLIER",
        field: "supplierName",
        sortable: true,
      },
      {
        name: "workOrderStatusDesc",
        align: "center",
        label: "STATUS",
        field: "workOrderStatusDesc",
        sortable: true,
      },
      {
        name: "workOrderDateTime",
        align: "center",
        label: "D/T WORK ORDER",
        field: "workOrderDateTime",
        sortable: true,
      },
    ],

    ratingHashMap: {
      5: {
        label: "EXCELLENT",
        value: 5,
      },
      4: {
        label: "VERY GOOD",
        value: 4,
      },
      3: {
        label: "GOOD",
        value: 3,
      },
      2: {
        label: "FAIR",
        value: 2,
      },
      1: {
        label: "POOR",
        value: 1,
      },
    },
  };
}
