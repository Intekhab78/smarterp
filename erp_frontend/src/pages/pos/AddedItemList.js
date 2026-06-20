import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Button,
  TextField,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
// import {
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Tabs,
//   Tab,
// } from "@mui/material";
const AddedItemList = ({
  selectedItem,
  taxSettings,
  decrementQty,
  incrementQty,
  selectedOpenMenuIndex,
  handleClickItem,
  anchorElItem,
  openItem,
  handleCloseItem,
  handleDiscountClickItem,
  handleSalesmanClickItem,
  handleEditPriceClickItem,
  handleRemoveSelectedItem,
  discountPercent,
  cartImage,
  openSalesmanItem,
  handleCloseSalesmanItem,
  salesman,
  autocompletesalesmanValueItem,
  handleAutocompleteChangeItem,
  applySalesmanItem,
  openEditPriceItem,
  handleCloseEditPriceItem,
  handleEditPriceItem,
  applyPriceItem,
}) => {
  if (!selectedItem || selectedItem.length === 0)
    return (
      <div className="p-5 text-center items-center text-gray-500">
        <img src={cartImage} className="h-24 w-24" />
      </div>
    );

  return (
    <div>
      <div className="border text-xs font-semibold border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2 bg-gray-100">
        <div className="w-[35%]">Item Name</div>
        <div className="w-[80px]">Qty</div>
        <div className="w-[15%] ml-4">Price</div>
        <div className="w-[10%] ml-4">Disc/Item</div>
        <div className="w-[20%] ml-4">Line Total</div>
        <div className="w-[10%] ml-4">Global Disc</div>
        <div className="w-[10%] ml-4">Sub Total</div>
        <div className="w-[10%] ml-4">Tax %</div>
        <div className="w-[10%] ml-4">Final Total</div>
        <div className="w-[10%] ml-4">Actions</div>
      </div>

      {selectedItem.map((item, index) => {
        console.log("items is -----------", item);

        const lineTotal = item.finalTotalItem * item.qty;

        // Calculate per-item discount (flat per unit)
        const perItemDiscount = item.price - item.finalTotalItem;

        // Global discount (spread across all items)
        const globalDisc = (lineTotal * discountPercent) / 100;

        // Final total after global discount and VAT
        const discountedLineTotal = lineTotal - globalDisc;
        const finalTotalWithTax =
          taxSettings.tax_name === "exclusive"
            ? discountedLineTotal // inclusive VAT already included
            : discountedLineTotal + (discountedLineTotal * item.item_tax) / 100; // exclusive VAT added

        return (
          <div
            key={index}
            className="border text-sm border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2"
          >
            <div className="w-[35%]">
              <p className="text-xs">{item.itemName}</p>
            </div>

            <div className="w-[80px] flex flex-row items-center justify-between text-left">
              <IconButton
                onClick={() => decrementQty(item.id)}
                disabled={item.qty <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <p>{item.qty}</p>
              <IconButton
                onClick={() => incrementQty(item.id)}
                // disabled={item.qty >= item.remaining_stock}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </div>

            <div className="w-[15%]">
              <p className="text-gray-500 ml-4 text-xs">{item.price}</p>
            </div>

            <div className="w-[10%] ml-4">
              <p className="text-gray-500 text-xs">
                {perItemDiscount.toFixed(2)}
              </p>
            </div>

            <div className="w-[20%] ml-4">
              <p className="text-gray-500 text-xs">{lineTotal.toFixed(2)}</p>
            </div>

            <div className="w-[10%] ml-4">
              <p className="text-gray-500 text-xs">{globalDisc.toFixed(2)}</p>
            </div>
            <div className="w-[10%] ml-4">
              <p className="text-gray-500 text-xs">
                {(lineTotal - globalDisc).toFixed(2)}
              </p>
            </div>
            <div className="w-[10%] ml-4">
              <p className="text-gray-500 text-xs">{item.item_tax}</p>
            </div>

            <div className="w-[10%] ml-4">
              <p className="text-gray-500 text-xs">
                {finalTotalWithTax.toFixed(2)}
              </p>
            </div>

            <div className="w-[10%] ml-4">
              <div className="flex">
                <IconButton onClick={(event) => handleClickItem(event, index)}>
                  <Icon fontSize="small">more_vert</Icon>
                </IconButton>

                {selectedOpenMenuIndex === index && (
                  <Menu
                    anchorEl={anchorElItem}
                    id="action-menu"
                    open={openItem}
                    onClose={handleCloseItem}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleCloseItem();
                        handleDiscountClickItem(index);
                      }}
                    >
                      <Icon fontSize="small">%</Icon> Discount
                    </MenuItem>
                    <MenuItem onClick={() => handleSalesmanClickItem(index)}>
                      <Icon fontSize="small">user</Icon> Salesman
                    </MenuItem>
                    <MenuItem onClick={() => handleEditPriceClickItem(index)}>
                      <Icon fontSize="small">edit</Icon> Price
                    </MenuItem>
                    <MenuItem onClick={() => handleRemoveSelectedItem(item.id)}>
                      <Icon fontSize="small">delete</Icon> Remove
                    </MenuItem>
                  </Menu>
                )}
              </div>
            </div>

            {/* Salesman Dialog */}

            <Dialog open={openSalesmanItem} onClose={handleCloseSalesmanItem}>
              <DialogTitle>Select Salesman</DialogTitle>

              <DialogContent>
                <Autocomplete
                  disablePortal
                  options={salesman}
                  name="salesman_item_id"
                  getOptionLabel={(option) =>
                    option
                      ? `
                      ${option.salesman_code} -
                       ${option.users?.firstname}`
                      : ""
                  }
                  // 🔥 match by user_id instead of id
                  isOptionEqualToValue={(option, value) =>
                    option.user_id === value.user_id
                  }
                  value={autocompletesalesmanValueItem || null} // ✅ must be an object
                  onChange={(event, newValue) =>
                    handleAutocompleteChangeItem(
                      event,
                      newValue,
                      "salesman_item_id",
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="salesman"
                      variant="outlined"
                    />
                  )}
                />
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseSalesmanItem} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={() => applySalesmanItem(index)}
                  color="primary"
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit Price Dialog */}
            <Dialog open={openEditPriceItem} onClose={handleCloseEditPriceItem}>
              <DialogTitle>Edit Price</DialogTitle>
              <DialogContent>
                <TextField
                  type="number"
                  fullWidth
                  value={item.finalTotalItem}
                  onChange={(e) =>
                    handleEditPriceItem(e.target.value, "value", index, item)
                  }
                  className="mt-4"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditPriceItem} color="secondary">
                  Cancel
                </Button>
                <Button onClick={() => applyPriceItem(index)} color="primary">
                  Apply
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      })}
    </div>
  );
};

export default AddedItemList;
