import { Box } from "@mui/material";
import CommonTabs from "../../components/common/CommonTabs";
import BirthdayDetails from "./BirthdayDetails";
import BirthdayWishes from "./BirthdayWishes";
import BirthdayImages from "./BirthdayImages";

export default function BirthdayPanel() {
  return (
    <Box sx={{ p: 3, boxShadow: 4, borderRadius: 4 }}>
      <CommonTabs
        tabs={[
          {
            label: "Birthday Person Details",
            content: <BirthdayDetails />,
          },
          {
            label: "Wish Content",
            content: <BirthdayWishes />,
          },
          {
            label: "Images Gallery",
            content: <BirthdayImages />,
          },
        ]}
      />
    </Box>
  );
}
