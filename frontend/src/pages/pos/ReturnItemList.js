import React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Autocomplete,
  Button,
  Icon,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PercentIcon from "@mui/icons-material/Percent";

const ReturnItemList = ({
  rows,
  decrementFetchQty,
  selectedOpenMenuIndex,
  anchorElItem,
  openItem,
  handleCloseItem,
  handleDiscountClickItem,
  handleSalesmanClickItem,
  handleEditPriceClickItem,
  openEditPriceItem,
  handleCloseEditPriceItem,
  handleEditPriceItem,
  applyPriceItem,
  openSalesmanItem,
  handleCloseSalesmanItem,
  salesman,
  autocompletesalesmanValueItem,
  handleAutocompleteChangeItem,
  applySalesmanItem,
  handleRemoveSelectedItem,
  openModalItem,
  handleCloseModalItem,
  calculateDiscountItem,
}) => {
  if (!rows || rows.length === 0) return <div>No items to return</div>;

  const itemsToReturn = rows.filter((item) => item.quantity >= 1);

  if (itemsToReturn.length === 0)
    return (
      <div className="flex justify-center items-center">
        All items have been returned.
      </div>
    );
  console.log("itemsToReturn+++++++++++++++++++++++++", itemsToReturn);
  console.log("rows", rows);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-xs">
        <thead className="bg-gray-100 text-gray-700 text-left text-xs">
          <tr>
            <th className="p-2 border">Item</th>
            <th className="p-2 border text-center">Qty</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Item Discount</th>
            <th className="p-2 border">Global Discount</th>
            <th className="p-2 border">Gross Amt</th>
            <th className="p-2 border">VAT</th>
            <th className="p-2 border">Net Amt</th>
            {/* <th className="p-2 border text-center">Actions</th> */}
          </tr>
        </thead>

        <tbody>
          {itemsToReturn.map((item, index) => (
            <tr key={index} className="border-t">
              {/* Item Name */}
              <td className="p-2 border">{item.item_name}</td>

              {/* Quantity Controls */}
              <td className="p-2 border text-center">
                <div className="flex items-center justify-center space-x-1">
                  <IconButton
                    onClick={() => decrementFetchQty(item.id)}
                    disabled={item.quantity === 0}
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <span>{item.quantity}</span>

                  <IconButton disabled size="small">
                    <AddIcon fontSize="small" />
                  </IconButton>
                </div>
              </td>

              {/* Price */}
              <td className="p-2 border">
                {item.price && Number(item.price).toFixed(2)}
              </td>
              {/* Price */}
              <td className="p-2 border">
                {item.price && Number(item.price * item.quantity).toFixed(2)}
              </td>

              {/* Item Discount */}
              {/* Item Discount */}
              <td className="p-2 border">
                {item.price &&
                  `${Number(item.discount).toFixed(2)} ${
                    item.discounttype === "Percentage" ? "%" : ""
                  }`}
              </td>

              {/* Global Discount */}
              <td className="p-2 border">
                {item.price && Number(item.doc_discount).toFixed(2)}
              </td>

              {/* Net Price */}
              <td className="p-2 border">
                {item.price && Number(item.rate * item.quantity).toFixed(2)}
              </td>

              {/* VAT */}
              <td className="p-2 border">
                {item.price &&
                  (
                    (parseFloat(item.rate) || 0) *
                    ((parseFloat(item.vat) || 0) / 100) *
                    (parseFloat(item.quantity) || 0)
                  ).toFixed(2)}
              </td>

              {/* Total */}
              <td className="p-2 border">
                {item.price &&
                  (
                    (parseFloat(item.perItem_Total) || 0) *
                    (parseFloat(item.quantity) || 0)
                  ).toFixed(2)}
              </td>

              {/* Actions */}
              <td className="p-2 border text-center">
                {selectedOpenMenuIndex === index && (
                  <Menu
                    anchorEl={anchorElItem}
                    open={openItem}
                    onClose={handleCloseItem}
                  >
                    <MenuItem onClick={() => handleDiscountClickItem(index)}>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnItemList;
