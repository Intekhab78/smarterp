import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useNavigate } from "react-router-dom";

const AddButtonHeader = ({ title, buttonText, buttonAction }) => {
  const navigate = useNavigate();

  return (
    <MDBox
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={3}
    >
      <MDTypography variant="h4">{title}</MDTypography>
      <MDButton
        variant="gradient"
        color="info"
        onClick={() => navigate(buttonAction)}
      >
        {buttonText}
      </MDButton>
    </MDBox>
  );
};

export default AddButtonHeader;
