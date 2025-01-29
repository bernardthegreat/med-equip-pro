<template>
  <q-card>
    <q-card-section class="bg-light">
      <div class="row justify-between items-center">
        <span> WORK ORDER </span>
        <span>
          <q-btn-group>
            <q-btn
              icon="fa fa-times"
              size="sm"
              label="close"
              color="red"
              v-close-popup
            ></q-btn>
          </q-btn-group>
        </span>
      </div>
    </q-card-section>

    <q-card-section
      class="full-width q-pa-none"
      :class="`printout-${this.currentScreen}`"
    >
      <div>
        <div :class="`printout-${this.currentScreen}`">
          <q-pdfviewer
            v-model="this.visible"
            :src="`${this.srcPDF}#&navpanes=0`"
            type="html5"
          />
        </div>

        <div id="divToPrintHeader" style="display: none"></div>

        <div id="divToPrint" style="display: none">
          <div>
            <div class="header">
              <table
                class="prTable"
                style="
                  width: 100%;
                  text-align: center;
                  font-size: 9px;
                  padding: 15px;
                  align-items: center;
                  max-width: 100%;
                  font-weight: thin;
                "
              >
                <thead>
                  <tr>
                    <td style="width: 15% !important; text-align: left">
                      E-code Number:
                    </td>
                    <td style="width: 35%; text-align: left">
                      {{ this.infoDetails.propertyCode }}
                    </td>
                    <td style="width: 15%; text-align: right">Brand:</td>
                    <td style="width: 35%; text-align: left">
                      {{ this.infoDetails.brand }}
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: left">Equipment Name:</td>
                    <td style="text-align: left">
                      {{ this.infoDetails.name }}
                    </td>

                    <td style="text-align: right">Model:</td>
                    <td style="text-align: left">
                      {{ this.infoDetails.model }}
                    </td>
                  </tr>
                  <tr>
                    <td style="text-align: left">Serial Number:</td>
                    <td style="text-align: left">
                      {{ this.infoDetails.serialNumber }}
                    </td>

                    <td style="text-align: right">Location:</td>
                    <td style="text-align: left">
                      {{ this.infoDetails.departmentName }}
                    </td>
                  </tr>
                  <tr v-if="this.infoDetails.workOrderType === 'PREVENTIVE'">
                    <td style="text-align: left">Next PM Date:</td>
                    <td style="text-align: left">
                      {{ this.infoDetails.formattedScheduleAt }}
                    </td>
                    <td style="text-align: right">Rating:</td>
                    <td style="text-align: left">
                      <b>
                        <div
                          v-if="
                            this.infoDetails.rating !== '' &&
                            this.infoDetails.rating !== null
                          "
                        >
                          {{ this.infoDetails.rating }} -
                          {{
                            this.ratingHashMap[this.infoDetails.rating].label
                          }}
                        </div>
                      </b>
                    </td>
                  </tr>
                  <tr v-else>
                    <td style="text-align: left">Rating:</td>
                    <td colspan="3" style="text-align: left">
                      <div
                        v-if="
                          this.infoDetails.rating !== '' &&
                          this.infoDetails.rating !== null
                        "
                      >
                        <b>
                          {{ this.infoDetails.rating }} -
                          {{
                            this.ratingHashMap[this.infoDetails.rating].label
                          }}
                        </b>
                      </div>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>

            <div class="checklist">
              <table
                class="checkListTable"
                v-if="this.infoDetails.workOrderType === 'PREVENTIVE'"
                style="
                  width: 100%;
                  text-align: center;
                  font-size: 8px;
                  padding: 15px;
                  align-items: center;
                  max-width: 100%;
                  font-weight: thin;
                "
              >
                <thead>
                  <tr>
                    <th style="width: 5%"></th>
                    <th style="width: 50%">MARK CHECK ( √ ) IF PERFORM</th>
                    <th style="width: 10%">YES</th>
                    <th style="width: 10%">NO</th>
                    <th style="width: 25%">REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(task, i) in this.infoDetails.taskList" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td style="text-align: left">{{ task.description }}</td>
                    <td>
                      {{ task.taskStatus ? "√" : "" }}
                    </td>
                    <td>
                      {{
                        task.taskStatus
                          ? ""
                          : task.taskStatus === null
                          ? ""
                          : "√"
                      }}
                    </td>
                    <td style="text-align: left">{{ task.taskRemarks }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="remarks">
              <table
                class="remarksTable"
                style="
                  width: 100%;
                  text-align: center;
                  font-size: 9px;
                  padding: 15px;
                  align-items: center;
                  max-width: 100%;
                  font-weight: thin;
                "
              >
                <tbody>
                  <tr>
                    <td style="text-align: justify">
                      <b>REMARKS / RECOMMENDATIONS:</b>
                      {{ this.infoDetails.workOrderDescription }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="timeFrame">
              <table
                class="timeFrameTable"
                style="
                  width: 100%;
                  text-align: center;
                  font-size: 9px;
                  padding: 15px;
                  align-items: center;
                  max-width: 100%;
                  font-weight: thin;
                "
              >
                <thead>
                  <tr>
                    <th style="text-align: left">ASSESSMENT DATE & TIME:</th>
                    <td>{{ this.infoDetails.formattedAssessAt }}</td>
                    <th style="text-align: right">WORK DONE DATE & TIME:</th>
                    <td>
                      {{ this.infoDetails.formattedCompletedAt }}
                    </td>
                  </tr>
                  <tr>
                    <th style="text-align: left">WORK STARTED DATE & TIME:</th>
                    <td>{{ this.infoDetails.formattedStartWorkAt }}</td>
                    <th style="text-align: right">STATUS:</th>
                    <td>
                      <b>
                        {{ this.infoDetails.workStatus }}
                      </b>
                    </td>
                  </tr>
                </thead>
              </table>
            </div>

            <div class="divider">
              <table
                class="footerTable"
                style="
                  width: 100%;
                  text-align: center;
                  font-size: 9px;
                  padding: 15px;
                  align-items: center;
                  max-width: 100%;
                  font-weight: thin;
                "
              >
                <tr style="border: 0">
                  <td></td>
                </tr>
              </table>
            </div>
            <div>
              <table
                class="footerTable"
                style="
                  width: 100%;
                  text-align: center;
                  font-size: 9px;
                  padding: 15px;
                  align-items: center;
                  max-width: 100%;
                  font-weight: thin;
                "
              >
                <thead>
                  <tr style="border: 0">
                    <td style="width: 46%"></td>
                    <td style="width: 8%"></td>
                    <td style="width: 46%"></td>
                  </tr>
                  <tr style="border: 0">
                    <td
                      data-pdfmake='{"borderWidth":"0px 1px 0px 0px", "border": [false, true, false, false]}'
                    >
                      Name and Signature of Technician / Engineer
                    </td>
                    <td></td>
                    <td
                      data-pdfmake='{"borderWidth":"0px 1px 0px 0px", "border": [false, true, false, false]}'
                    >
                      Name and Signature of Client / End User
                    </td>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>

        <div id="divToPrintFooter" style="display: none"></div>
        <div id="iframeContainer"></div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
const utils = require("src/util");
import { ref, defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
var JsBarcode = require("jsbarcode");
export default {
  name: "WorkOrderPrintout",
  props: {
    infoDetails: {
      type: Object,
    },
  },
  data() {
    return {
      srcPDF: "",
      visible: true,
      imgSrc: "",
      firstLogo: "",
      secondLogo: "",
      component: "",
      pdfPrintout: "",
      maximumPage: [],
    };
  },
  emits: ["getPrintoutPDF"],
  computed: {
    ...mapGetters({
      currentScreen: "helpers/currentScreen",
      currentScreenProperty: "helpers/currentScreenProperty",
      apiHost: "helpers/apiHost",
      userLoginInfo: "users/userLoginInfo",
      ratingHashMap: "workOrders/ratingHashMap",
    }),
  },
  async created() {
    // this.component =
    //   this.collegesHashMap[this.applicationInfo.course].collegeShort;
    // this.imgSrc = await utils.getBase64ImageFromURL(
    //   `${this.apiHost}/applicant/file?referenceNumber=${this.userLoginInfo.referenceNumber}&type=photo`
    // );
  },
  async mounted() {
    this.firstLogo = await utils.getBase64ImageFromURL(`img/logos/DOH.jpg`);
    this.secondLogo = await utils.getBase64ImageFromURL(`img/logos/JVGH.png`);
    await this.renderDocument();
  },
  methods: {
    // downloadDocument() {
    //   const linkSource = `data:application/pdf;base64,${this.pdfPrintout}`;
    //   const downloadLink = document.createElement("a");
    //   const fileName = "abc.pdf";
    //   downloadLink.href = linkSource;
    //   downloadLink.download = fileName;
    //   downloadLink.click();
    // },
    textToBase64Barcode(text) {
      var canvas = document.createElement("canvas");
      JsBarcode(canvas, text, { format: "CODE39" });
      return canvas.toDataURL("image/png");
    },
    async renderDocument() {
      // const canvas = createCanvas(0, 0);

      const pdfTable = document.getElementById("divToPrint");
      const pdfTableHeader = document.getElementById("divToPrintHeader");
      const pdfTableFooter = document.getElementById("divToPrintFooter");

      var html = htmlToPdfmake(pdfTable.innerHTML, {
        tableAutoSize: true,
      });

      var headerHTML = htmlToPdfmake(pdfTableHeader.innerHTML, {
        tableAutoSize: true,
      });

      var footerHTML = htmlToPdfmake(pdfTableFooter.innerHTML, {
        tableAutoSize: true,
      });

      let contentHTML = [];

      const headerLogo = JSON.parse(
        JSON.stringify(this.generateHeader("", ""))
      );
      const htmlContent = JSON.parse(JSON.stringify(html));
      // const combinedObj = Object.assign(headerLogo, html[0]);
      const combinedObj = [...headerLogo.stack, ...html];
      // for (const i of [1, 2]) {
      //   contentHTML.push(combinedObj);
      // }

      console.log();

      contentHTML = combinedObj;

      const documentDefinition = {
        info: {
          title: `WORK ORDER FOR SN: ${this.infoDetails.serialNumber}`,
          author: ``,
          subject: `WORK ORDER FOR SN: ${this.infoDetails.serialNumber}`,
          keywords: `WORK ORDER FOR SN: ${this.infoDetails.serialNumber}`,
        },
        header: (currentPage, pageCount) => {
          this.maximumPage = pageCount;
          // return this.generateHeader(currentPage, headerHTML);
        },
        footer: (currentPage, pageCount) => {
          let footerDetails = {
            stack: [
              {
                stack: [...footerHTML],
                margin: [20, 0, 20, 5],
              },
              // {
              //   canvas: [
              //     {
              //       type: "line",
              //       x1: 0,
              //       y1: 0,
              //       x2: 571,
              //       y2: 0,
              //       lineWidth: 1,
              //     },
              //   ],
              // },
              {
                text: "",
                margin: [5, 0, 0, 0],
              },
              // ...this.getReviewer(),
              {
                columns: [
                  {
                    text: " ",
                    columnGap: 0,
                    style: ["pageNumber"],
                  },
                  {
                    text: "",
                    // text: `Page ${currentPage} of ${pageCount}`,
                    style: ["pageNumber"],
                    alignment: "center",
                  },
                  {
                    text: "",
                  },
                ],
                columnGap: 10,
                margin: [40, 5, 40, 0],
              },
            ],
            style: ["footerStyle"],
          };

          return footerDetails;
        },

        // by default we use portrait, you can change it to landscape if you wish

        // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
        pageMargins: [
          20,
          // this.infoDetails.workOrderType === "PREVENTIVE" ? 180 : 165,
          5, 20, 30,
        ],
        // pageSize: {
        //   width: 576,
        //   height: 360,
        // },
        pageSize: "LEGAL",
        pageOrientation: "portrait",

        content: [contentHTML, this.generateHeader("", ""), htmlContent],
        // {
        //     text: "Text on Landscape",
        //     pageBreak: "before",
        //   },
        styles: {
          headerStyle: {
            fontSize: 12,
            bold: true,
            alignment: "center",
          },
          textBold: {
            bold: true,
          },
          textUnbold: {
            bold: false,
          },
          headerContentStyle: {
            fontSize: 10,
            alignment: "center",
          },
          footerStyle: {
            fontSize: 10,
            bold: true,
            alignment: "center",
            //color: "#424242",
          },
          textBold: {
            bold: true,
          },
          positionCenter: {
            alignment: "center",
          },
          positionLeft: {
            alignment: "left",
          },
          positionRight: {
            alignment: "right",
          },
          pageNumber: {
            fontSize: 8,
            bold: false,
          },
        },
      };
      // pdfMake.vfs = pdfFonts.pdfMake.vfs;
      // const body = await this.addRowsDifferentBackground(documentDefinition);
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
      pdfDocGenerator.getBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        this.srcPDF = url;
      });
      // pdfDocGenerator.getBase64((data) => {
      //   this.pdfPrintout = data;
      // });
    },
    addRowsDifferentBackground(tableBody) {
      if (tableBody.content.length > 0) {
        const formattedTableBody = tableBody.content[0];
        formattedTableBody.layout = {
          fillColor: function (rowIndex, node, columnIndex) {
            return rowIndex % 2 === 0 ? "lightgrey" : "white";
          },
        };
        return tableBody;
      }
      return tableBody;
    },
    generateHeader(currentPage, headerHTML) {
      return {
        stack: [
          {
            columns: [
              {
                image: this.firstLogo,
                width: 35,
                height: 35,
              },
              [
                {
                  text: "Republic of the Philippines",
                  fontSize: 6,
                  style: ["textUnbold"],
                  alignment: "center",
                },
                {
                  text: "DEPARTMENT OF HEALTH",
                  fontSize: 6,
                  style: ["textUnbold"],
                  alignment: "center",
                },
                {
                  text: "Central Luzon Center for Health Development",
                  fontSize: 6,
                  style: ["textUnbold"],
                  alignment: "center",
                },
                {
                  text: "JONI VILLANUEVA GENERAL HOSPITAL",
                  fontSize: 8,
                  alignment: "center",
                  bold: true,
                },
                {
                  text: "National Road, Igulot, Bocaue Bulacan",
                  fontSize: 6,
                  style: ["textUnbold"],
                  alignment: "center",
                },
                {
                  text: "Email: jvgh.bulacan@gmail.com",
                  fontSize: 6,
                  style: ["textUnbold"],
                  alignment: "center",
                },
                {
                  text: "Contact No. ER: 09453972491 (Globe) / Admin: 09603026389 (Smart)",
                  fontSize: 6,
                  style: ["textUnbold"],
                  alignment: "center",
                },
              ],
              {
                image: this.secondLogo,
                width: 35,
                height: 35,
              },
            ],
            columnGap: 12,
            margin: [130, 10, 130, 0],
          },
          // {
          //   text: "",
          //   margin: [0, 0, 0, 10],
          // },
          // {
          //   canvas: [
          //     {
          //       type: "line",
          //       x1: 0,
          //       y1: 0,
          //       x2: 571,
          //       y2: 0,
          //       lineWidth: 1,
          //     },
          //   ],
          // },
          {
            text: `${
              this.infoDetails !== undefined
                ? this.infoDetails.workOrderType
                : "PREVENTIVE"
            } MAINTENANCE FORM`,
            margin: [0, 5, 0, 5],
            bold: true,
            alignment: "center",
            fontSize: 8,
          },
          // {
          //   canvas: [
          //     {
          //       type: "line",
          //       x1: 0,
          //       y1: 0,
          //       x2: 571,
          //       y2: 0,
          //       lineWidth: 1,
          //     },
          //   ],
          // },

          // {
          //   stack: [...headerHTML],

          //   margin: [20, 5, 20, 0],
          // },
          // {
          //   canvas: [
          //     {
          //       type: "line",
          //       x1: 0,
          //       y1: 0,
          //       x2: 571,
          //       y2: 0,
          //       lineWidth: 1,
          //     },
          //   ],
          //   margin: [0, 10, 0, 0],
          // },
        ],
        style: ["headerStyle"],
      };
    },
  },
};
</script>
