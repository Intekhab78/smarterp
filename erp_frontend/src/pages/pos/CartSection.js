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

const CartSection = ({
  view,
  activeReturnDisplay,
  rows,
  selectedItem,
  discountPercent,
  decrementFetchQty,
  incrementFetchQty,
  decrementQty,
  incrementQty,
  selectedOpenMenuIndex,
  anchorElItem,
  openItem,
  handleCloseItem,
  handleDiscountClickItem,
  handleSalesmanClickItem,
  handleEditPriceClickItem,
  handleCloseEditPriceItem,
  openEditPriceItem,
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
  applyDiscountItem,
  handleEditItem,
  cartImage,
}) => {
  return (
    <div
      className={`absolute top-0 h-full overflow-y-auto transition-all duration-500 ease-in-out bg-gray-50 border-t border-r border-black rounded-t-md extra-thin-scroll ${
        view === "right"
          ? "left-0 w-full"
          : view === "both"
            ? "left-1/2 w-1/2"
            : "left-full w-1/2"
      }`}
    >
      <div className="px-1">
        {/* ✅ Cart Section */}
        {activeReturnDisplay ? (
          <div>
            {rows?.length > 0 &&
            rows.every((item) => Number(item.quantity) === 0) ? (
              <div className="flex justify-center items-center">
                All items have been returned.
              </div>
            ) : (
              <div>
                <p>Item to Return</p>

                {rows?.length > 0 &&
                  rows
                    ?.filter((item) => item.quantity >= 1)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="border text-sm border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2"
                      >
                        {/* Item Name */}
                        <div className="w-[35%]">
                          <p className=" text-xs">{item.item_name}</p>
                        </div>

                        {/* Qty */}
                        <div className="w-[80px] flex flex-row items-center justify-between space-x-.5">
                          <IconButton
                            onClick={() => decrementFetchQty(item.id)}
                            disabled={item.quantity == 0}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <p>{item.quantity}</p>
                          <IconButton disabled>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </div>

                        {/* Price */}
                        <div className="w-[15%]">
                          {item.price && (
                            <p className=" text-gray-500 ml-4 text-xs">
                              Price: {Number(item.price).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="w-[15%]">
                          {item.price && (
                            <p className=" text-gray-500 ml-4 text-xs">
                              Item Discount:{" "}
                              {Number(item.item_discount_amount).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="w-[15%]">
                          {item.price && (
                            <p className=" text-gray-500 ml-4 text-xs">
                              Global Discount:{" "}
                              {Number(item.doc_discount).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="w-[15%]">
                          {item.price && (
                            <p className=" text-gray-500 ml-4 text-xs">
                              Net Price: {Number(item.net).toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="w-[20%]">
                          {item.price !== undefined && (
                            <p className="text-gray-500 ml-4 text-xs">
                              VAT:{" "}
                              {Number(
                                (item.net * item.quantity * 5) / 100,
                              ).toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Total */}
                        <div className="w-[10%]">
                          {item.price && (
                            <p className=" text-gray-500 ml-4 text-xs">
                              Total: {Number(item.item_grand_total).toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="w-[10%]">
                          <div className="ml-4">
                            <div className="flex">
                              {selectedOpenMenuIndex == index && (
                                <Menu
                                  anchorEl={anchorElItem}
                                  id="action-menu"
                                  open={openItem}
                                  onClose={handleCloseItem}
                                >
                                  <MenuItem
                                    onClick={() =>
                                      handleDiscountClickItem(index)
                                    }
                                  >
                                    <Icon fontSize="small">%</Icon> Discount
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleSalesmanClickItem(index)
                                    }
                                  >
                                    <Icon fontSize="small">user</Icon> Salesman
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleEditPriceClickItem(index)
                                    }
                                  >
                                    <Icon fontSize="small">edit</Icon> Price
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleRemoveSelectedItem(item.id)
                                    }
                                    className="ml-2"
                                  >
                                    <Icon fontSize="small">delete</Icon> Remove
                                  </MenuItem>
                                </Menu>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="border text-xs font-semibold border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2 bg-gray-100">
              <div className="w-[35%]">Item Name</div>
              <div className="w-[80px]">Qty</div>
              <div className="w-[15%] ml-4">Price</div>
              <div className="w-[10%] ml-4">Disc. Per Item</div>
              <div className="w-[20%] ml-4">Line Total</div>
              <div className="w-[10%] ml-4">Global Disc</div>
              <div className="w-[10%] ml-4">Final Total</div>
              <div className="w-[10%] ml-4">Actions</div>
            </div>

            {/* Items */}
            {selectedItem?.length > 0 ? (
              selectedItem?.map((item, index) => (
                <div
                  key={index}
                  className="border text-sm border-gray-300 p-2 rounded-lg flex justify-between items-center mb-2"
                >
                  {/* Item Name */}
                  <div className="w-[35%]">
                    <p className=" text-xs">{item.itemName}</p>
                  </div>

                  {/* Qty */}
                  <div className="w-[80px] flex flex-row items-center justify-between text-left">
                    <IconButton
                      onClick={() => decrementQty(item.id)}
                      disabled={item.qty <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>

                    <p>{item.qty}</p>
                    <IconButton onClick={() => incrementQty(item.id)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </div>

                  {/* Price */}
                  <div className="w-[15%]">
                    {item.finalTotalItem && (
                      <p className=" text-gray-500 ml-4 text-xs">
                        {item.price}
                      </p>
                    )}
                  </div>

                  {/* Discount */}
                  <div className="w-[20%]">
                    {item.finalTotalItem && (
                      <p className="text-gray-500 ml-4 text-xs">
                        {Number(item.price - item.finalTotalItem).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Line Total */}
                  <div className="w-[20%]">
                    {item.finalTotalItem && (
                      <p className="text-gray-500 ml-4 text-xs">
                        {Number(item.finalTotalItem * item.qty).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Global Discount */}
                  <div className="w-[20%]">
                    {item.finalTotalItem && (
                      <p className="text-gray-500 ml-4 text-xs">
                        {Number(
                          (item.finalTotalItem * item.qty * discountPercent) /
                            100,
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Final Total */}
                  <div className="w-[10%]">
                    {item.finalTotalItem && (
                      <p className=" text-gray-500 ml-4 text-xs">
                        {Number(
                          item.finalTotalItem * item.qty -
                            (item.finalTotalItem * item.qty * discountPercent) /
                              100,
                        ).toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-[10%]">
                    <div className="ml-4">
                      <div className="flex">
                        <IconButton
                          onClick={(event) => handleEditItem(item.id)}
                        >
                          <Icon fontSize="small">more_vert</Icon>
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center items-center text-gray-500">
                <img src={cartImage} className="h-24 w-24" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSection;
