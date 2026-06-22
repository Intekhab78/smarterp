import StockAdjustmentForm from "../../../utils/StockAdjustmentForm";

const StockUpdate = () => {
  return (
    <div className="">
      <StockAdjustmentForm
        itemId={3448}
        companyId={21}
        locationId={20}
        onSuccess={() => console.log("Refresh inventory")}
      />
    </div>
  );
};

export default StockUpdate;
