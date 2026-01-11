import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  GridLegacy,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonTable from "../../components/common/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchBirthdays,
  addBirthday,
  updateBirthday,
  deleteBirthday,
} from "../../store/birthdaySlice";

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

export default function BirthdayDetails() {
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

  const emptyForm: FormData = {
    name: "",
    gender: "",
    relationship: "",
    dob: "",
    email: "",
    contact: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: emptyForm,
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

      reset(emptyForm);
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
    {
      key: "gender",
      label: "Gender",
      render: (row: any) => (
        <Chip
          label={row.gender}
          size="small"
          sx={{
            fontWeight: 500,
            py:2,
            px:1,
            color: "#000",
            backgroundColor:
              row.gender?.toLowerCase() === "male"
                ? "#dbecfe"
                : row.gender?.toLowerCase() === "female"
                ? "#f7d9e3"
                : "#9e9e9e",
          }}
        />
      ),
    },
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
    <Box>
      <Typography variant="h5" mb={2}>
        {editingId
          ? "Update Birthday Person's Detail"
          : "Add Birthday Person's Detail"}
      </Typography>

      {/* FORM */}
      <Grid container spacing={2}>
        <GridLegacy item xs={12} md={4}>
          <TextField
            label="Name"
            fullWidth
            InputLabelProps={{ shrink: !!watch("name") }}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </GridLegacy>

        <GridLegacy item xs={12} md={2}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Gender"
                fullWidth
                sx={{ width: 150 }}
                {...field}
                error={!!errors.gender}
                helperText={errors.gender?.message}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            )}
          />
        </GridLegacy>

        <GridLegacy item xs={12} md={2}>
          <Controller
            name="relationship"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Relationship"
                fullWidth
                sx={{ width: 150 }}
                {...field}
                error={!!errors.relationship}
                helperText={errors.relationship?.message}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="family">Family</MenuItem>
                <MenuItem value="friend">Friend</MenuItem>
                <MenuItem value="colleague">Colleague</MenuItem>
                <MenuItem value="partner">Partner</MenuItem>
              </TextField>
            )}
          />
        </GridLegacy>

        <GridLegacy item xs={12} md={3}>
          <TextField
            type="date"
            label="DOB"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("dob")}
            error={!!errors.dob}
            helperText={errors.dob?.message}
          />
        </GridLegacy>

        <GridLegacy item xs={12} md={3}>
          <TextField
            label="Age"
            fullWidth
            value={dob ? calculateAge(dob) : ""}
            disabled
          />
        </GridLegacy>

        <GridLegacy item xs={12}>
          <TextField
            label="Email ID"
            fullWidth
            InputLabelProps={{ shrink: !!watch("email") }}
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </GridLegacy>

        <GridLegacy item xs={12}>
          <TextField
            label="Contact Number"
            type="number"
            fullWidth
            InputLabelProps={{ shrink: !!watch("contact") }}
            {...register("contact")}
            error={!!errors.contact}
            helperText={errors.contact?.message}
          />
        </GridLegacy>

        <GridLegacy item xs={12}>
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
                reset(emptyForm);
                setEditingId(null);
              }}
            >
              Cancel Edit
            </Button>
          )}
        </GridLegacy>
      </Grid>

      {/* LIST */}
      <Typography variant="body2" color="text.secondary" mt={5}>
        {role === "admin"
          ? "You are viewing all birthday records (Admin)"
          : "Here are the birthday records of your loved ones."}
      </Typography>

      <Grid container>
        <GridLegacy item xs={12} sx={{ width: "100%" }}>
          <CommonTable columns={columns} data={birthdays} loading={loading} />
        </GridLegacy>
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
