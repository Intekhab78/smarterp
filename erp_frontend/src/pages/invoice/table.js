import React, { useEffect } from "react";
import jsPDF from 'jspdf';
import axios, { axios_post } from "../../axios";

const table = () => {
    useEffect(() => {
        ganratePdf();
    }, []);

    const ganratePdf = async (id) => {
        const response = await axios_post(true, "invoice/details", {
            id: 4
        });
        var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        })
        const pdfData = response.data;
        const item_modal = pdfData.invoice_details;
        let totalCGST = 0;
        let totalCGSTAmount = 0;
        let totalSGST = 0;
        let totalSGSTAmount = 0;
        let totalIGST = 0;
        let totalIGSTAmount = 0;
        const tempDiv = document.createElement('div');
        let tableRows = '';
        item_modal.forEach((item, index) => {
            totalCGST += parseFloat(item.cgst || 0);
            totalCGSTAmount += parseFloat(item.cgst_amount || 0);
            totalSGST += parseFloat(item.sgst || 0);
            totalSGSTAmount += parseFloat(item.sgst_amount || 0);
            totalIGST += parseFloat(item.igst || 0);
            totalIGSTAmount += parseFloat(item.igst_amount || 0);

            tableRows += `
                <tr>
                    <td align="center">${index + 1}</td>
                    <td>${item.itemModel.item_name}</td>
                    <td>${item.itemModel.item_code}</td>
                    <td>${item.ship_quantity || ''}</td>
                    <td>${item.batch_number || 'none'}</td>
                    <td>${item.exp_date || ''}</td>
                    <td>${item.ship_quantity || ''}</td>
                    <td>${item.item_price || ''}</td>
                    <td>${item.item_discount_amount || ''}</td>
                    <td>${item.item_qty || ''}</td>
                    <td>${item.itemModel.rate || ''}</td>
                    <td>${item.item_grand_total || ''}</td>
                    <td>${item.ptr_di || ''}</td>
                    <td>${item.taxa_ble || ''}</td>
                    <td>${item.cgst || ''}</td>
                    <td>${item.cgst_amount || ''}</td>
                    <td>${item.sgst || ''}</td>
                    <td>${item.sgst_amount || ''}</td>
                    <td>${item.igst || ''}</td>
                    <td>${item.igst_amount || ''}</td>
                </tr>
            `;
        });


        tempDiv.innerHTML =
            `<!DOCTYPE html>
     <html lang="en">
     <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />

     <title>Invoice Table</title>
     <style>
      body {
        font-family: Arial, sans-serif;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 2% 0;
        font-size: 1vw;
        table-layout: fixed;
      }

      th,
      td {
        border: 0.1vw solid black;
        padding: 0.3vw 0.5vw;
        text-align: left;
        vertical-align: top;
        word-break:break-all;
      }

      th {
        background-color: #f2f2f2;
        font-weight: bolder;
        font-size: 1vw;
      }
        .product-tbl td{
        font-size: 1vw;
        }
      .header-table {
        width: 100%;
      }

      .header-table td {
        border: 0.1vw solid black;
      }

      .header-left {
        width: 25%;
        text-align: left;
      }

      .header-right {
        width: 45%;
        text-align: left;
      }

      .total-row td {
        border-top: 0.2vw solid black;
      }

      .no-border {
        border: none;
      }

      .signature-row td {
        padding-top: 1.5%;
        font-weight: bolder;
      }

      .signature {
        height: 4vw;
        border-bottom: 0.1vw solid black;
        width: 18%;
      }
     </style>
     </head>

     <body>
     <table class="header-table">
      <tr>
        <td class="header-left" rowspan="2">
          <strong style="font-size: small">MEDISPAN PHARMACEUTICAL</strong><br />
          T4-11A, OKHLA AVENUE, DELHI-25<br />
          Tel No.: 9971743983<br />
          INSPE NO.: 08AQPWA7457J<br />
          GSTIN No.: 07ABDPW5538R1ZV<br />
          <strong>Email:</strong> medispanpharmaceutical@gmail.com
        </td>
        <td class="header-right" colspan="2">
          <strong style="font-size: medium"
            >AHMED GASTRO LIVER & DENTAL CLINIC</strong
          ><br />
          A-2/1A RAFI COMPLEX NEAR OKHLA METRO STATION, <br />ABU FAZAL ENCL.
          JAMIA NAGAR<br />
          OKHLA, NEW DELHI<br />
          FASSAI No.: 13323010000214<br />
          State Code: 07<br />
          Tel No.: 9319188872
        </td>
        <td colspan="2" style="margin-bottom: 10%; margin-bottom: 10%"; width:"100%">
          Invoice No.: <strong>${pdfData.invoice_number || ''}</strong><br />
          Invoice Date: <strong>${pdfData.invoice_date || ''}</strong><br />

          <hr style="border: 0; border-top: 0.1vw solid black; margin: 1% 0" />

          E.B. No.: <br />
           Due Date: <strong>${pdfData.invoice_due_date || ''}</strong><br />
          Page 1 of 1
        </td>
      </tr>
     </table>

     <table class="product-tbl">
      <tr>
        <th width="2%" align="center">-</th>
        <th width="10%">Product Name</th>
        <th width="8%">HSN Code</th>
        <th width="5%">Pack</th>
        <th width="5%">Batch No.</th>
        <th width="5%">Exp.</th>
        <th width="5%">MRP</th>
        <th width="4%">Sale QTY</th>
        <th width="4%">Disc</th>
        <th width="4%">QTY</th>
        <th width="5%">Rate</th>
        <th width="5%">Amount</th>
        <th width="5%">PTR DIS%</th>
        <th width="5%">Taxable</th>
        <th width="5%">CGST%</th>
        <th width="5%">CGST Amount</th>
        <th width="5%">SGST%</th>
        <th width="5%">SGST Amount</th>
        <th width="5%">IGST%</th>
        <th width="5%">IGST Amount</th>
      </tr>
       ${tableRows}
      <tr class="total-row">
        <td colspan="13" align="right"><strong>Total</strong></td>
        <td>${pdfData.taxable_total || ''}</td>
      <td>${totalCGST.toFixed(2) || ''}</td>
      <td>${totalCGSTAmount.toFixed(2) || ''}</td>
      <td>${totalSGST.toFixed(2) || ''}</td>
      <td>${totalSGSTAmount.toFixed(2) || ''}</td>
      <td>${totalIGST.toFixed(2) || ''}</td>
      <td>${totalIGSTAmount.toFixed(2) || ''}</td>
      </tr>
      <tr class="signature-row">
        <td colspan="20" align="LE">
          <strong>Received By:</strong><br /><br />
          <div class="signature"></div>
          <strong>Signature</strong>
        </td>
      </tr>
      </table>
      </body>
      </html>`;
        document.body.appendChild(tempDiv);

        // doc.html(tempDiv, {
        //     callback: function (pdf) {
        //         pdf.save("invoice.pdf");
        //         window.location.reload();
        //     },
        //     x: 20,
        //     y: 20,
        //     width: 255,
        //     windowWidth: 995,
        // });
    }
}


export default table;