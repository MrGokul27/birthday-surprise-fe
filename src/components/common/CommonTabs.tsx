import * as React from "react";
import { Tabs, Tab, Box } from "@mui/material";

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface CommonTabsProps {
  tabs: TabItem[];
}

export default function CommonTabs({ tabs }: CommonTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "#ff6c2f",
              height: 2,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: "#777",
                "&.Mui-selected": {
                  color: "#ff6c2f",
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((tab, index) => (
        <Box key={index} hidden={value !== index} sx={{ pt: 3 }}>
          {value === index && tab.content}
        </Box>
      ))}
    </Box>
  );
}
