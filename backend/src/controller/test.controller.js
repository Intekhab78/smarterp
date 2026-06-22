const fs = require("fs");
const bwipjs = require("bwip-js");
const { exec } = require("child_process");

// Generate barcode image
const generateBarcode = async (req, res) => {
  try {
    const { code } = req.params;

    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: code,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      },
      (err, png) => {
        if (err) {
          return res.status(500).json({ message: "Error generating barcode" });
        }
        res.set("Content-Type", "image/png");
        res.send(png);
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// Direct print
const printLabel = (req, res) => {
  const { name, price, upc } = req.body;

  const command = `
    SIZE 50 mm,30 mm
    GAP 2 mm,0 mm
    DENSITY 8
    SPEED 4
    CLS
    TEXT 40,20,"3",0,1,1,"${name} ₹${price}"
    BARCODE 40,60,"128",80,1,0,2,2,"${upc}"
    PRINT 1
  `;

  const filePath = "label.prn";
  fs.writeFileSync(filePath, command);

  exec(
    `PRINT /D:"\\\\localhost\\TVS LP 46 NEO" ${filePath}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error("Print error:", stderr);
        return res.status(500).json({ error: stderr });
      }
      console.log("Printed:", stdout);
      res.json({ success: true, message: "Label sent to printer" });
    }
  );
};

module.exports = { generateBarcode, printLabel };
