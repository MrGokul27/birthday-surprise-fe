import {
  Grid,
  Typography,
  Avatar,
  Dialog,
  DialogContent,
  IconButton,
  GridLegacy,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState, AppDispatch } from "../../store";
import CommonTable from "../../components/common/CommonTable";
import { uploadBirthdayImages } from "../../store/birthdaySlice";
import api from "../../api/axios";

export default function BirthdayImages() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: birthdays, loading } = useSelector(
    (state: RootState) => state.birthday
  );

  const [tableImageUrls, setTableImageUrls] = useState<{
    [key: string]: string[];
  }>({});
  const [open, setOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchRowImages = async (row: any) => {
    if (!row.photos?.length) return;

    const urls: string[] = [];
    for (let i = 0; i < row.photos.length; i++) {
      try {
        const res = await api.get(`/birthday/${row._id}/image/${i}`, {
          responseType: "blob",
        });
        urls.push(URL.createObjectURL(res.data));
      } catch (err) {
        console.error("Failed to fetch image", err);
      }
    }

    setTableImageUrls((prev) => ({ ...prev, [row._id]: urls }));
  };

  useEffect(() => {
    birthdays.forEach((row) => fetchRowImages(row));
  }, [birthdays]);

  const handleViewAllImages = (id: string, startIndex = 0) => {
    const urls = tableImageUrls[id] || [];
    setCurrentImages(urls);
    setCurrentIndex(startIndex);
    setOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "dob", label: "DOB" },
    {
      key: "upload",
      label: "Upload",
      render: (row: any) => (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            dispatch(
              uploadBirthdayImages({
                id: row._id,
                files: Array.from(e.target.files),
              })
            );
          }}
        />
      ),
    },
    {
      key: "images",
      label: "Images",
      render: (row: any) => {
        const photos = tableImageUrls[row._id] || [];
        const showCount = 3;
        const extraCount = photos.length - showCount;

        return (
          <Grid container spacing={1}>
            {photos.slice(0, showCount).map((url, index) => (
              <GridLegacy item key={index}>
                <Avatar
                  sx={{ width: 48, height: 48, cursor: "pointer" }}
                  src={url}
                  onClick={() => handleViewAllImages(row._id, index)}
                />
              </GridLegacy>
            ))}

            {extraCount > 0 && (
              <GridLegacy item>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    cursor: "pointer",
                    bgcolor: "#ccc",
                    color: "#000",
                    fontSize: 24,
                  }}
                  onClick={() => handleViewAllImages(row._id, showCount)}
                >
                  +{extraCount}
                </Avatar>
              </GridLegacy>
            )}
          </Grid>
        );
      },
    },
  ];

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Birthday Images Gallery 📸
      </Typography>

      <CommonTable columns={columns} data={birthdays} loading={loading} />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 600,
            height: 500,
            maxWidth: "600px",
            maxHeight: "500px",
            borderRadius: 2,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.paper",
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            height: "100%",
            width: "100%",
            position: "relative",
            padding: 0,
          }}
        >
          {/* Left Arrow */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* Image */}
          <img
            src={currentImages[currentIndex]}
            alt={`Birthday ${currentIndex}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />

          {/* Right Arrow */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
}
