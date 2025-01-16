export default function () {
  return {
    // Model of the data
    equipments: [],
    equipmentsHashMap: {},
    equipmentsOptions: [],
    equipmentsColumns: [
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
        name: "model",
        align: "center",
        label: "MODEL",
        field: "model",
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
        name: "departmentName",
        align: "center",
        label: "DEPARTMENT",
        field: "departmentName",
        sortable: true,
      },
      {
        name: "type",
        align: "center",
        label: "TYPE",
        field: "type",
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
        name: "warrantyPeriod",
        align: "center",
        label: "WARRANTY",
        field: "warrantyPeriod",
        sortable: true,
      },
      // {
      //   name: "createdAt",
      //   align: "center",
      //   label: "D/T CREATED",
      //   field: "createdAt",
      //   sortable: true,
      // },
      {
        name: "updatedAt",
        align: "center",
        label: "D/T UPDATED",
        field: "updatedAt",
        sortable: true,
      },
    ],
    equipmentsActiveOptions: [],
    equipmentsActiveHashMap: {},
    equipmentsTypeOptions: [
      {
        label: "TIE-UP",
        value: "tieup",
      },
      {
        label: "OWNED",
        value: "owned",
      },
    ],
    equipmentsTypeHashMap: {
      tieup: {
        label: "TIE-UP",
        code: "tieup",
      },
      owned: {
        label: "OWNED",
        code: "owned",
      },
    },
  };
}
