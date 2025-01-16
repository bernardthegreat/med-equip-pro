export default function () {
  return {
    // Model of the data
    workOrders: [],
    workOrdersHashMap: {},
    workOrdersOptions: [],
    workOrdersActiveOptions: [],
    workOrdersActiveHashMap: {},
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
  };
}
