import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonTable from "../components/common/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchBirthdays,
  addBirthday,
  updateBirthday,
  deleteBirthday,
} from "../store/birthdaySlice";

/* 🔒 Validation Schema */
const schema = yup.object({
  name: yup.string().required("Name is required"),
  gender: yup.string().required("Gender is required"),
  relationship: yup.string().required("Relationship is required"),
  contact: yup.string().required("Contact is required"),
  dob: yup.string().required("Date of birth is required"),
  email: yup.string().required("Email is required").email("Enter valid email"),
});

type FormData = yup.InferType<typeof schema>;

export default function BirthdayPanel() {
  const role = localStorage.getItem("role");

  const dispatch = useDispatch<AppDispatch>();
  const { data: birthdays, loading } = useSelector(
    (state: RootState) => state.birthday
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const dob = watch("dob");

  /* 🎂 Age Calculation */
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    dispatch(fetchBirthdays());
  }, [dispatch]);

  /* 💾 ADD / UPDATE */
  const onSubmit = async (data: FormData) => {
    try {
      const age = calculateAge(data.dob);

      if (editingId) {
        await dispatch(
          updateBirthday({
            id: editingId,
            data: { ...data, age },
          })
        ).unwrap();

        setToast({
          open: true,
          message: "Birthday updated successfully 🎉",
          severity: "success",
        });
      } else {
        await dispatch(addBirthday({ ...data, age })).unwrap();

        setToast({
          open: true,
          message: "Birthday added successfully 🎂",
          severity: "success",
        });
      }

      reset();
      setEditingId(null);
    } catch {
      setToast({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    }
  };

  /* ✏️ Edit */
  const handleEdit = (row: any) => {
    setEditingId(row._id);
    reset({
      name: row.name,
      gender: row.gender,
      relationship: row.relationship,
      dob: row.dob,
      email: row.email,
      contact: row.contact,
    });
  };

  /* 🗑 Delete */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete?")) return;

    await dispatch(deleteBirthday(id)).unwrap();

    setToast({
      open: true,
      message: "Birthday deleted successfully",
      severity: "success",
    });
  };

  /* 📊 Table Columns */
  const columns = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "relationship", label: "Relationship" },
    { key: "dob", label: "DOB" },
    { key: "contact", label: "Contact" },
    { key: "email", label: "Email" },
    ...(role === "admin"
      ? [
          {
            key: "addedBy",
            label: "Added By",
            render: (row: any) =>
              `${row.createdBy_name} (${row.createdBy_email})`,
          },
        ]
      : []),
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <>
          <Grid sx={{ display: "flex" }}>
            <Button size="small" onClick={() => handleEdit(row)}>
              <EditIcon sx={{ color: "#888" }} />
            </Button>
            <Button size="small" onClick={() => handleDelete(row._id)}>
              <DeleteIcon sx={{ color: "#888" }} />
            </Button>
          </Grid>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, boxShadow: 4, borderRadius: 4 }}>
      <Typography variant="h5" mb={2}>
        {editingId ? "Update Birthday Details" : "Add Birthday Details"}
      </Typography>

      {/* FORM */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Name"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            label="Gender"
            fullWidth
            sx={{ width: 150 }}
            defaultValue=""
            {...register("gender")}
            error={!!errors.gender}
            helperText={errors.gender?.message}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            select
            label="Relationship"
            fullWidth
            sx={{ width: 150 }}
            defaultValue=""
            {...register("relationship")}
            error={!!errors.relationship}
            helperText={errors.relationship?.message}
          >
            <MenuItem value="family">Family</MenuItem>
            <MenuItem value="friend">Friend</MenuItem>
            <MenuItem value="colleague">Colleague</MenuItem>
            <MenuItem value="partner">Partner</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            label="DOB"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("dob")}
            error={!!errors.dob}
            helperText={errors.dob?.message}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Age"
            fullWidth
            value={dob ? calculateAge(dob) : ""}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Email ID"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Contact Number"
            type="number"
            fullWidth
            {...register("contact")}
            error={!!errors.contact}
            helperText={errors.contact?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{ py: 2, backgroundColor: "#ff6c2f" }}
            startIcon={<SaveIcon />}
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {editingId ? "Update Birthday" : "Save Birthday"}
          </Button>

          {editingId && (
            <Button
              variant="outlined"
              sx={{ py: 2, ml: 2, color: "#ff6c2f", borderColor: "#ff6c2f" }}
              onClick={() => {
                reset();
                setEditingId(null);
              }}
            >
              Cancel Edit
            </Button>
          )}
        </Grid>
      </Grid>

      {/* LIST */}
      <Typography variant="body2" color="text.secondary" mt={5} mb={2}>
        {role === "admin"
          ? "You are viewing all birthday records (Admin)"
          : "You are viewing your birthday records"}
      </Typography>

      <Grid container>
        <Grid item xs={12} sx={{ width: "100%" }}>
          <CommonTable columns={columns} data={birthdays} loading={loading} />
        </Grid>
      </Grid>

      {/* 🔔 TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
