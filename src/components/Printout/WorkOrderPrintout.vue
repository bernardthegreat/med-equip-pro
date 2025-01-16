<template>
  <q-card>
    <q-card-section class="bg-light">
      <div class="row justify-between items-center">
        <span> WORK ORDER </span>
        <span>
          <q-btn-group>
            <q-btn icon="fa fa-times" color="red" v-close-popup></q-btn>
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
        <div id="divToPrint" style="display: none"></div>
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
    // applicationInfo: {
    //   type: Object,
    // },
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

      var html = htmlToPdfmake(pdfTable.innerHTML, {
        tableAutoSize: true,
      });

      const documentDefinition = {
        info: {
          // title: `${this.applicationInfo.appNumber} - APPLICATION FOR ${
          //   this.collegesHashMap[this.applicationInfo.course].label
          // }`,
          // author: `${this.userLoginInfo.lastName.toUpperCase()}, ${this.userLoginInfo.firstName.toUpperCase()} ${this.userLoginInfo.middleName.toUpperCase()}`,
          // subject: `${this.applicationInfo.appNumber} - APPLICATION FOR ${
          //   this.collegesHashMap[this.applicationInfo.course].label
          // }`,
          // keywords: `${this.applicationInfo.appNumber} - APPLICATION FOR ${
          //   this.collegesHashMap[this.applicationInfo.course].label
          // }`,
        },
        header: (currentPage, pageCount) => {
          this.maximumPage = pageCount;
          return this.generateHeader(currentPage);
        },
        footer: (currentPage, pageCount) => {
          let footerDetails = {
            stack: [
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 0,
                    x2: 560,
                    y2: 0,
                    lineWidth: 1,
                  },
                ],
              },
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
                    text: `Page ${currentPage} of ${pageCount}`,
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
        pageMargins: [20, 170, 20, 25],
        // pageSize: {
        //   width: 576,
        //   height: 360,
        // },
        pageSize: "LETTER",
        pageOrientation: "portrait",

        content: [html],
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
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
    generateHeader(currentPage) {
      return {
        stack: [
          {
            columns: [
              {
                image: this.firstLogo,
                width: 55,
                height: 55,
              },
              [
                {
                  text: "          ",
                  fontSize: 10,
                },
                {
                  text: "Republic of the Philippines",
                  fontSize: 10,
                },
                {
                  text: "JONI VILLANUEVA GENERAL HOSPITAL",
                  fontSize: 10,
                },
              ],
              {
                image: this.secondLogo,
                width: 55,
                height: 55,
              },
            ],
            columnGap: 12,
            margin: [40, 10, 40, 0],
          },
          {
            text: "",
            margin: [0, 0, 0, 10],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 560,
                y2: 0,
                lineWidth: 1,
              },
            ],
          },
          {
            text: "",
            margin: [0, 0, 0, 5],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 560,
                y2: 0,
                lineWidth: 1,
              },
            ],
          },
        ],
        style: ["headerStyle"],
      };
    },
  },
};
</script>
