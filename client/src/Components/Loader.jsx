import CircularProgress from "@mui/material/CircularProgress";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <CircularProgress sx={{ color: "rgb(34 211 238)" }} />
    </div>
  );
}
