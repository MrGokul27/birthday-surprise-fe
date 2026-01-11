import { Grid, Typography, Avatar, Dialog, DialogContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import type { RootState, AppDispatch } from "../../store";
import CommonTable from "../../components/common/CommonTable";
import { uploadBirthdayImage } from "../../store/birthdaySlice";
import api from "../../api/axios";

export default function BirthdayImages() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: birthdays } = useSelector((state: RootState) => state.birthday);

  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleViewImage = async (id: string) => {
    const res = await api.get(`/birthday/${id}/image`, {
      responseType: "blob",
    });
    setImageUrl(URL.createObjectURL(res.data));
    setOpen(true);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "relationship", label: "Relationship" },
    { key: "dob", label: "DOB" },
    { key: "age", label: "Age" },

    {
      key: "upload",
      label: "Upload",
      render: (row: any) => (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              dispatch(
                uploadBirthdayImage({
                  id: row._id,
                  file: e.target.files[0],
                })
              );
            }
          }}
        />
      ),
    },

    {
      key: "image",
      label: "Image",
      render: (row: any) => (
        <Avatar
          sx={{ cursor: "pointer" }}
          src={`${import.meta.env.VITE_API_BASE_URL}/birthday/${row._id}/image`}
          onClick={() => handleViewImage(row._id)}
        />
      ),
    },
  ];

  return (
    <>
      <Typography variant="h5">Birthday Images Gallery 📸</Typography>

      <Grid container>
        <Grid item xs={12} sx={{ width: "100%" }}>
          <CommonTable columns={columns} data={birthdays} />
        </Grid>
      </Grid>

      {/* IMAGE MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <DialogContent>
          <img
            src={imageUrl}
            alt="Birthday"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
